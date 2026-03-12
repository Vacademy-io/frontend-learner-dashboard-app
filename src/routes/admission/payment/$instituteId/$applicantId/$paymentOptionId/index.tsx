import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  fetchPaymentOptions,
  type PaymentOption,
} from "@/routes/courses/-services/payment-options-api";
import {
  INITIATE_APPLICANT_PAYMENT,
  GET_SIGNED_URL_PUBLIC,
  GET_PUBLIC_URL_PUBLIC,
} from "@/constants/urls";
import {
  RazorpayCheckoutForm,
  type RazorpayCheckoutFormRef,
} from "@/components/common/enroll-by-invite/-components/razorpay-checkout-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CheckCircle,
  Loader2,
  IndianRupee,
  AlertCircle,
  GraduationCap,
  Mail,
  QrCode,
  Upload,
  Smartphone,
  X,
  ImageIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface InitiatePaymentResponse {
  /** Internal order ID (used in webhook notes as orderId) */
  order_id?: string;
  status?: string | null;
  message?: string;
  payment_type?: string | null;
  payment_link?: string;
  response_data?: {
    razorpayKeyId?: string;
    razorpayOrderId?: string;
    amount?: number;
    currency?: string;
    amountDue?: number;
    paymentStatus?: string;
    status?: string;
  };
}

interface PaymentSearchParams {
  /** "ONLINE" (default) or "UPI" */
  method?: string;
  /** Pre-resolved file UUID for the institute's UPI QR code image */
  qrCodeFileId?: string;
}

// ── Route definition ──────────────────────────────────────────────────────────

export const Route = createFileRoute(
  "/admission/payment/$instituteId/$applicantId/$paymentOptionId/",
)({
  validateSearch: (search: Record<string, unknown>): PaymentSearchParams => ({
    method: typeof search.method === "string" ? search.method : undefined,
    qrCodeFileId:
      typeof search.qrCodeFileId === "string" ? search.qrCodeFileId : undefined,
  }),
  component: AdmissionPaymentPage,
});

// ── Public screenshot upload (no auth needed) ─────────────────────────────────

async function uploadScreenshotPublic(file: File): Promise<string> {
  const signedResp = await axios.post(
    GET_SIGNED_URL_PUBLIC,
    {
      file_name: file.name.toLowerCase().replace(/\s+/g, "_"),
      file_type: file.type,
      source: "PAYMENT_SCREENSHOTS",
      source_id: "ADMISSION",
    },
    { withCredentials: false },
  );
  const { id, url } = signedResp.data as { id: string; url: string };
  await axios.put(url, file, { headers: { "Content-Type": file.type } });
  return id;
}

// ── Page Component ────────────────────────────────────────────────────────────

function AdmissionPaymentPage() {
  const { instituteId, applicantId, paymentOptionId } = Route.useParams();
  const { method, qrCodeFileId } = Route.useSearch();

  const isUpiMode = method === "UPI";

  // ── Razorpay refs / state (online mode) ──────────────────────────────────
  const razorpayRef = useRef<RazorpayCheckoutFormRef>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [razorpayError, setRazorpayError] = useState<string | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // ── UPI state ─────────────────────────────────────────────────────────────
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotFileId, setScreenshotFileId] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);

  // ── Fetch payment option ──────────────────────────────────────────────────
  const { data: option, isLoading: loadingOptions } =
    useQuery<PaymentOption | null>({
      queryKey: ["admission-payment-option", paymentOptionId, instituteId],
      queryFn: () => fetchPaymentOptions(instituteId),
      enabled: !!instituteId,
      staleTime: 5 * 60_000,
    });

  const plan = option?.payment_plans?.[0];

  // ── Fetch QR code image URL (UPI mode only, when qrCodeFileId is present) ─
  const { data: qrImageUrl, isLoading: loadingQr } = useQuery<string>({
    queryKey: ["upi-qr-url", qrCodeFileId],
    queryFn: async () => {
      const resp = await axios.get(GET_PUBLIC_URL_PUBLIC, {
        params: { fileId: qrCodeFileId, expiryDays: 1 },
        withCredentials: false,
      });
      return resp.data as string;
    },
    enabled: isUpiMode && !!qrCodeFileId,
    staleTime: 60 * 60_000, // 1 hour
  });

  // ── Online payment mutation (Razorpay) ────────────────────────────────────
  const initiateMutation = useMutation({
    mutationFn: async ({
      amount,
      currency,
      email,
    }: {
      amount: number;
      currency: string;
      email: string;
    }): Promise<InitiatePaymentResponse> => {
      const resp = await axios.post(
        INITIATE_APPLICANT_PAYMENT(applicantId),
        {
          vendor: "RAZORPAY",
          amount,
          currency,
          razorpay_request: { email },
        },
        { params: { paymentOptionId } },
      );
      return resp.data;
    },
  });

  // ── UPI / manual payment mutation ────────────────────────────────────────
  const upiMutation = useMutation({
    mutationFn: async ({
      file_id,
      transaction_id,
    }: {
      file_id: string | null;
      transaction_id: string;
    }): Promise<InitiatePaymentResponse> => {
      const resp = await axios.post(
        INITIATE_APPLICANT_PAYMENT(applicantId),
        {
          vendor: "MANUAL",
          amount: plan?.actual_price,
          currency: plan?.currency || "INR",
          email: email.trim(),
          manual_request: { file_id, transaction_id },
        },
        { params: { paymentOptionId } },
      );
      return resp.data;
    },
  });

  // ── Online pay handler ────────────────────────────────────────────────────
  const handleOnlinePay = async () => {
    if (!plan || !option) {
      toast.error("No payment plan configured. Please contact the institute.");
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsPaying(true);
    setRazorpayError(null);
    try {
      const initiated = await initiateMutation.mutateAsync({
        amount: plan.actual_price,
        currency: plan.currency || "INR",
        email: trimmedEmail,
      });
      const rd = initiated?.response_data;
      const razorpayKeyId = rd?.razorpayKeyId;
      const razorpayOrderId = rd?.razorpayOrderId;
      const orderAmount = rd?.amount ?? plan.actual_price;
      const orderCurrency = rd?.currency ?? plan.currency ?? "INR";
      if (initiated?.payment_link) {
        window.location.href = initiated.payment_link;
        return;
      }
      if (!razorpayKeyId || !razorpayOrderId) {
        toast.error(
          "Could not retrieve payment details from the server. Please try again.",
        );
        return;
      }
      razorpayRef.current?.openPayment({
        razorpayKeyId,
        razorpayOrderId,
        amount: orderAmount,
        currency: orderCurrency,
        contact: "",
        email: trimmedEmail,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { ex?: string; message?: string } } })
          ?.response?.data?.ex ||
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to initiate payment");
      toast.error(msg);
    } finally {
      setIsPaying(false);
    }
  };

  // ── Screenshot file change handler ────────────────────────────────────────
  const handleScreenshotChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotFileId(null);
    setIsUploadingScreenshot(true);
    try {
      const fileId = await uploadScreenshotPublic(file);
      setScreenshotFileId(fileId);
      toast.success("Screenshot uploaded successfully.");
    } catch {
      toast.error("Screenshot upload failed. You can still submit without it.");
      setScreenshotFile(null);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  // ── UPI confirm handler ───────────────────────────────────────────────────
  const handleUpiConfirm = async () => {
    if (!plan || !option) {
      toast.error("No payment plan configured. Please contact the institute.");
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    const trimmed = transactionId.trim();
    if (!trimmed) {
      setTransactionIdError("UPI Transaction ID is required.");
      return;
    }
    setTransactionIdError("");
    setIsPaying(true);
    try {
      await upiMutation.mutateAsync({
        file_id: screenshotFileId,
        transaction_id: trimmed,
      });
      setPaymentDone(true);
      toast.success(
        "Payment submitted! The institute will verify and update your status.",
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { ex?: string; message?: string } } })
          ?.response?.data?.ex ||
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Failed to submit payment");
      toast.error(msg);
    } finally {
      setIsPaying(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentDone(true);
    toast.success(
      "Payment submitted! Your admission status will update shortly.",
    );
  };

  // ── Shared loading state ──────────────────────────────────────────────────
  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md space-y-4">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // ── No plan found ─────────────────────────────────────────────────────────
  if (!plan || !option) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h1 className="text-lg font-semibold text-gray-900">
            Payment Option Not Found
          </h1>
          <p className="text-sm text-gray-500">
            This payment link appears to be invalid or the payment option is no
            longer available. Please contact the institute for assistance.
          </p>
        </div>
      </div>
    );
  }

  // ── Payment complete state ────────────────────────────────────────────────
  if (paymentDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Payment Submitted!
          </h1>
          <p className="text-sm text-gray-500">
            {isUpiMode
              ? "Thank you. The institute will verify your payment and update your admission status shortly."
              : "Thank you. Your payment is being processed and your admission status will be updated shortly."}
          </p>
        </div>
      </div>
    );
  }

  // ── Shared page wrapper ───────────────────────────────────────────────────
  const pageWrapper = (children: React.ReactNode) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              Admission Fee Payment
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{option.name}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="px-6 pt-5">
          <div className="rounded-xl bg-orange-50 border border-orange-200 px-4 py-4">
            <p className="text-xs text-gray-500 mb-1">Amount Due</p>
            <p className="text-3xl font-bold text-gray-900 flex items-center gap-1">
              {plan.currency === "INR" ? (
                <IndianRupee className="w-6 h-6" />
              ) : (
                <span className="text-2xl">{plan.currency}</span>
              )}
              {plan.actual_price.toLocaleString("en-IN")}
            </p>
            {plan.elevated_price > plan.actual_price && (
              <p className="text-xs text-gray-400 mt-1 line-through">
                {plan.currency === "INR" ? "₹" : plan.currency}
                {plan.elevated_price.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────────
  // Case 2 — UPI payment
  // ────────────────────────────────────────────────────────────────────────────
  if (isUpiMode) {
    return pageWrapper(
      <div className="px-6 pb-6 pt-4 space-y-5">
        {/* QR Code section — only when qrCodeFileId is present */}
        {qrCodeFileId && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              Scan QR Code to Pay
            </p>
            {loadingQr ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : qrImageUrl ? (
              <div className="rounded-2xl border-2 border-primary/20 bg-white shadow-md flex flex-col items-center justify-center p-6 gap-3">
                <img
                  src={qrImageUrl}
                  alt="UPI QR Code"
                  className="w-full max-w-xs aspect-square object-contain rounded-xl"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Open any UPI app and scan to pay
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                <QrCode className="w-10 h-10" />
                <p className="text-xs">QR code could not be loaded</p>
              </div>
            )}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            className={
              emailError ? "border-red-400 focus-visible:ring-red-400" : ""
            }
          />
          {emailError && <p className="text-xs text-red-500">{emailError}</p>}
        </div>

        {/* Screenshot upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            Payment Screenshot{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>

          {screenshotFile ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              {isUploadingScreenshot ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className="text-xs text-emerald-700 flex-1 truncate">
                {isUploadingScreenshot
                  ? `Uploading ${screenshotFile.name}…`
                  : screenshotFile.name}
              </span>
              {!isUploadingScreenshot && (
                <button
                  type="button"
                  onClick={() => {
                    setScreenshotFile(null);
                    setScreenshotFileId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer px-4 py-3 transition-colors">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                Click to upload screenshot
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleScreenshotChange}
              />
            </label>
          )}
        </div>

        {/* UPI Transaction ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            UPI Transaction ID <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. 123456789012"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              if (transactionIdError) setTransactionIdError("");
            }}
            className={
              transactionIdError
                ? "border-red-400 focus-visible:ring-red-400"
                : ""
            }
          />
          {transactionIdError && (
            <p className="text-xs text-red-500">{transactionIdError}</p>
          )}
          <p className="text-xs text-gray-400">
            Enter the 12-digit transaction reference from your UPI app.
          </p>
        </div>

        {/* Confirm button */}
        <Button
          className="w-full gap-2"
          size="lg"
          disabled={isPaying || isUploadingScreenshot}
          onClick={handleUpiConfirm}
        >
          {isPaying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Confirm Payment
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-400">
          The institute will review your payment and update your admission
          status.
        </p>
      </div>,
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Case 1 — Online payment (Razorpay)
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {pageWrapper(
        <div className="px-6 pb-6 pt-4 space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              className={
                emailError ? "border-red-400 focus-visible:ring-red-400" : ""
              }
            />
            {emailError && <p className="text-xs text-red-500">{emailError}</p>}
          </div>

          <Button
            className="w-full gap-2"
            size="lg"
            disabled={isPaying}
            onClick={handleOnlinePay}
          >
            {isPaying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <IndianRupee className="w-4 h-4" />
                Pay Now
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Secured by Razorpay · Your payment is encrypted and safe
          </p>
        </div>,
      )}

      {/* Hidden Razorpay checkout form */}
      <div className="hidden">
        <RazorpayCheckoutForm
          ref={razorpayRef}
          error={razorpayError}
          amount={plan.actual_price}
          currency={plan.currency || "INR"}
          onPaymentReady={handlePaymentSuccess}
          onError={(err) => {
            setRazorpayError(err);
            if (!err.toLowerCase().includes("cancel")) {
              toast.error(err);
            }
          }}
          courseName={option.name || "Admission Fee"}
          courseDescription="Payment for school admission"
          userName=""
        />
      </div>
    </>
  );
}
