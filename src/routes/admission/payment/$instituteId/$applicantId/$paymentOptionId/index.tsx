import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  fetchPaymentOptionById,
  PaymentOption,
  PaymentPlan,
} from "@/routes/courses/-services/payment-options-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, CreditCard, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  RazorpayCheckoutForm,
  RazorpayCheckoutFormRef,
} from "@/components/common/enroll-by-invite/-components/razorpay-checkout-form";
import { INITIATE_APPLICANT_PAYMENT } from "@/constants/urls";

export const Route = createFileRoute(
  "/admission/payment/$instituteId/$applicantId/$paymentOptionId/",
)({
  component: AdmissionPaymentPage,
});

interface PaymentInitiateResponse {
  response_data: {
    razorpayKeyId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    status: string;
    receipt: string;
    customerId: string;
    amountDue: number;
    amountPaid: number;
    attempts: number;
    createdAt: string;
    email: string | null;
    contact: string | null;
  };
  order_id: string;
  status: string | null;
  message: string;
  payment_type: string | null;
}

function AdmissionPaymentPage() {
  const { instituteId, applicantId, paymentOptionId } = Route.useParams();
  const [paymentOption, setPaymentOption] = useState<PaymentOption | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [email, setEmail] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const razorpayFormRef = useRef<RazorpayCheckoutFormRef>(null);

  useEffect(() => {
    const loadPaymentOption = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPaymentOptionById(instituteId, paymentOptionId);

        if (!data) {
          setError("Payment option not found or invalid");
          return;
        }

        setPaymentOption(data);

        // Auto-select first active payment plan if available
        const activePlans =
          data.payment_plans?.filter((plan) => plan.status === "ACTIVE") || [];
        if (activePlans.length > 0) {
          setSelectedPlan(activePlans[0]);
        }
      } catch (err) {
        console.error("Error loading payment option:", err);
        setError("Failed to load payment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentOption();
  }, [instituteId, applicantId, paymentOptionId]);

  const initiatePayment = async () => {
    if (!selectedPlan) {
      setPaymentError("Please select a payment plan");
      return;
    }

    if (!email || !email.includes("@")) {
      setPaymentError("Please enter a valid email address");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentError(null);

      const amount = selectedPlan.elevated_price || selectedPlan.actual_price;
      const currency = selectedPlan.currency;

      // Call payment initiate API
      const response = await fetch(
        `${INITIATE_APPLICANT_PAYMENT}/${applicantId}/payment/initiate?paymentOptionId=${paymentOptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendor: "RAZORPAY",
            amount: amount,
            currency: currency,
            email: email,
            razorpay_request: {},
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Payment initiation failed:", errorData);
        throw new Error(errorData.message || "Failed to initiate payment");
      }

      const data: PaymentInitiateResponse = await response.json();

      console.log("Payment initiated successfully:", {
        orderId: data.order_id,
        razorpayOrderId: data.response_data.razorpayOrderId,
        message: data.message,
      });

      // Open Razorpay checkout with response_data
      razorpayFormRef.current?.openPayment({
        razorpayKeyId: data.response_data.razorpayKeyId,
        razorpayOrderId: data.response_data.razorpayOrderId,
        amount: data.response_data.amount,
        currency: data.response_data.currency,
        contact: "",
        email: email,
      });
    } catch (err) {
      console.error("Error initiating payment:", err);
      setPaymentError("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    console.log("Payment successful:", paymentData);
    console.log("Razorpay will automatically trigger webhook to:", 
      "POST /admin-core-service/payments/webhook/callback/razorpay");
    
    // Show success message
    alert(
      "Payment successful! Your enrollment is being processed. " +
      "You will receive a confirmation email shortly."
    );
    
    // Note: Razorpay automatically calls the webhook with payment details:
    // - razorpay_payment_id
    // - razorpay_order_id  
    // - razorpay_signature
    // The backend webhook handler will verify and complete the enrollment
    
    // TODO: Redirect to success page or show success message
  };

  const handlePaymentError = (errorMessage: string) => {
    setPaymentError(errorMessage);
  };

  const isEmailValid = email.includes("@") && email.length > 3;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !paymentOption) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Unable to load payment details"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const activePlans =
    paymentOption.payment_plans?.filter((plan) => plan.status === "ACTIVE") ||
    [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 w-full">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Complete Your Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your payment details and proceed with enrollment
          </p>
        </div>

        {/* Payment Option Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {paymentOption.name}
            </CardTitle>
            <CardDescription>
              Payment Type: {paymentOption.type} | Status:{" "}
              {paymentOption.status}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Plans */}
            {activePlans.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Available Payment Plans
                </h3>
                <div className="space-y-3">
                  {activePlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-all
                        ${
                          selectedPlan?.id === plan.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {plan.name}
                            </h4>
                            {selectedPlan?.id === plan.id && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {plan.currency}{" "}
                              {plan.elevated_price || plan.actual_price}
                            </span>
                            {plan.elevated_price &&
                              plan.elevated_price !== plan.actual_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {plan.currency} {plan.actual_price}
                                </span>
                              )}
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {plan.validity_in_days > 0 && (
                              <span>
                                Valid for: {plan.validity_in_days} days
                              </span>
                            )}
                            {plan.tag && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {plan.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Active Plans</AlertTitle>
                <AlertDescription>
                  There are currently no active payment plans available for this
                  payment option.
                </AlertDescription>
              </Alert>
            )}

            {/* Email Input */}
            <div className="space-y-2 p-4 ">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Payment confirmation will be sent to this email
              </p>
            </div>

            {/* Payment Error */}
            {paymentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}

            {/* Payment Button */}
            {activePlans.length > 0 && (
              <div className="pt-4 border-t">
                <Button
                  onClick={initiatePayment}
                  disabled={
                    !selectedPlan || !isEmailValid || isProcessingPayment
                  }
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
                  {selectedPlan && (
                    <span className="ml-2 font-semibold">
                      ({selectedPlan.currency}{" "}
                      {selectedPlan.elevated_price || selectedPlan.actual_price}
                      )
                    </span>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden Razorpay Form */}
        <div className="hidden">
          <RazorpayCheckoutForm
            ref={razorpayFormRef}
            error={paymentError}
            amount={
              selectedPlan?.elevated_price || selectedPlan?.actual_price || 0
            }
            currency={selectedPlan?.currency || "INR"}
            onPaymentReady={handlePaymentSuccess}
            onError={handlePaymentError}
            isProcessing={isProcessingPayment}
            userName=""
            userEmail={email}
            courseName={paymentOption?.name || "Admission Fee"}
            courseDescription="Payment for admission enrollment"
          />
        </div>
      </div>
    </div>
  );
}
