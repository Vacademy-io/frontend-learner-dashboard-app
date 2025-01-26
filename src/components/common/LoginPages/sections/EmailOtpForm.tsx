// import React, { useState } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useNavigate } from "@tanstack/react-router";

// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { MyInput } from "@/components/design-system/input";
// import { MyButton } from "@/components/design-system/button";
// import { TokenKey } from "@/constants/auth/tokens";
// import {
//   getTokenDecodedData,
//   setInstituteIdInStorage,
//   setTokenInStorage,
// } from "@/lib/auth/sessionUtility";
// import { LOGIN_OTP, REQUEST_OTP } from "@/constants/urls";
// import axios from "axios";
// import { fetchAndStoreInstituteDetails } from "@/services/fetchAndStoreInstituteDetails";

// const emailSchema = z.object({
//   email: z.string().email({ message: "Invalid email address" }),
// });

// const otpSchema = z.object({
//   otp: z
//     .array(z.string())
//     .length(6)
//     .transform((val) => val.join("")),
// });

// type EmailFormValues = z.infer<typeof emailSchema>;
// type OtpFormValues = { otp: string[] };

// export function EmailLogin({
//   onSwitchToUsername,
// }: {
//   onSwitchToUsername: () => void;
// }) {
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   const emailForm = useForm<EmailFormValues>({
//     resolver: zodResolver(emailSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const otpForm = useForm<OtpFormValues>({
//     resolver: zodResolver(otpSchema),
//     defaultValues: {
//       otp: Array(6).fill(""),
//     },
//   });

//   const sendOtpMutation = useMutation({
//     mutationFn: (email: string) => axios.post(REQUEST_OTP, { email }),
//     onSuccess: () => {
//       setIsOtpSent(true);
//       toast.success("OTP sent successfully");
//     },
//     onError: () => {
//       toast.error("Failed to send OTP", {
//         description: "Please try again",
//         duration: 3000,
//       });
//     },
//   });

//   const verifyOtpMutation = useMutation({
//     mutationFn: (data: { email: string; otp: string }) =>
//       axios.post(LOGIN_OTP, data),
//     onSuccess: async (response) => {
//       await setTokenInStorage(TokenKey.accessToken, response.data.accessToken);
//       await setTokenInStorage(
//         TokenKey.refreshToken,
//         response.data.refreshToken
//       );
//       // Decode token to get user data
//       const decodedData = await getTokenDecodedData(response.data.accessToken);

//       // Check authorities in decoded data
//       const authorities = decodedData.authorities;
//       const userId = decodedData.user;
//       const authorityKeys = authorities ? Object.keys(authorities) : [];

//       if (authorityKeys.length == 1) {
//         // Redirect to InstituteSelection if multiple authorities are found
//         navigate({ to: "/institute-selection" });
//       } else {
//         // Get the single institute ID
//         const instituteId = Object.keys(authorities)[0];

//         // await fetchAndStoreInstituteDetails(instituteId, userId);
//         const details = await fetchAndStoreInstituteDetails(
//           instituteId,
//           userId
//         );

//         if (details) {
//           navigate({ to: "/dashboard" });
//           // Navigate after successful fetch
//         }
//       }
//     },
//     onError: () => {
//       toast.error("Invalid OTP", {
//         description: "Please try again",
//         duration: 3000,
//       });
//       otpForm.reset();
//     },
//   });

//   const onEmailSubmit = (data: EmailFormValues) => {
//     setEmail(data.email);
//     sendOtpMutation.mutate(data.email);
//   };

//   const onOtpSubmit = (data: OtpFormValues) => {
//     const otpValue = data.otp.join("");
//     if (otpValue.length === 6) {
//       verifyOtpMutation.mutate({ email, otp: otpValue });
//     }
//   };

//   const handleBackToEmail = () => {
//     setIsOtpSent(false);
//     emailForm.reset();
//   };

//   // Handle input changes for OTP blocks with improved auto-focus
//   const handleOtpChange = (element: HTMLInputElement, index: number) => {
//     const value = element.value.replace(/[^0-9]/g, ""); // Only allow numbers

//     if (value) {
//       const newOtp = [...otpForm.getValues().otp];
//       newOtp[index] = value.substring(0, 1);
//       otpForm.setValue("otp", newOtp);

//       // Auto-focus next input
//       if (index < 5) {
//         const nextInput =
//           element.parentNode?.parentNode?.nextElementSibling?.querySelector(
//             "input"
//           );
//         if (nextInput) {
//           nextInput.focus();
//         }
//       }

//       // If all fields are filled, trigger submit
//       if (index === 5) {
//         const allValues = [...newOtp];
//         if (allValues.every((val) => val !== "")) {
//           verifyOtpMutation.mutate({
//             email,
//             otp: allValues.join(""),
//           });
//         }
//       }
//     }
//   };

//   // Handle paste event for OTP
//   const handleOtpPaste = (e: React.ClipboardEvent, index: number) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData
//       .getData("text")
//       .replace(/[^0-9]/g, "")
//       .slice(0, 6);

//     if (pastedData) {
//       const newOtp = [...otpForm.getValues().otp];
//       for (let i = 0; i < pastedData.length && index + i < 6; i++) {
//         newOtp[index + i] = pastedData[i];
//       }
//       otpForm.setValue("otp", newOtp);

//       // Focus the next empty input or the last input
//       const inputs =
//         e.currentTarget.parentElement?.parentElement?.parentElement?.querySelectorAll(
//           "input"
//         );
//       if (inputs) {
//         const nextEmptyIndex = newOtp.findIndex((val) => !val);
//         if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
//           inputs[nextEmptyIndex].focus();
//         } else {
//           inputs[5].focus();
//         }
//       }

//       // If all fields are filled, trigger submit
//       if (newOtp.every((val) => val !== "")) {
//         verifyOtpMutation.mutate({
//           email,
//           otp: newOtp.join(""),
//         });
//       }
//     }
//   };

//   // Handle backspace for OTP blocks
//   const handleOtpKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     const currentValue = otpForm.getValues().otp[index];

//     if (e.key === "Backspace") {
//       if (!currentValue && index > 0) {
//         const newOtp = [...otpForm.getValues().otp];
//         newOtp[index - 1] = "";
//         otpForm.setValue("otp", newOtp);

//         const prevInput =
//           e.currentTarget.parentNode?.parentNode?.previousElementSibling?.querySelector(
//             "input"
//           );
//         if (prevInput) {
//           prevInput.focus();
//         }
//       } else if (currentValue) {
//         const newOtp = [...otpForm.getValues().otp];
//         newOtp[index] = "";
//         otpForm.setValue("otp", newOtp);
//       }
//     }
//   };

//   return (
//     <div>
//       {!isOtpSent ? (
//         <Form {...emailForm}>
//           <form
//             onSubmit={emailForm.handleSubmit(onEmailSubmit)}
//             className="w-full"
//           >
//             <div className="flex w-full flex-col items-center justify-center gap-4 px-4 md:px-8 lg:px-12">
//               <FormField
//                 control={emailForm.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <MyInput
//                         inputType="email"
//                         inputPlaceholder="you@example.com"
//                         label="Email"
//                         required
//                         size="large"
//                         error={emailForm.formState.errors.email?.message}
//                         {...field}
//                         className="w-[300px] md:w-[348px] lg:w-[348px]"
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="mt-16 flex flex-col items-center gap-3">
//               <MyButton
//                 type="submit"
//                 scale="large"
//                 buttonType="primary"
//                 layoutVariant="default"
//               >
//                 Send OTP
//               </MyButton>
//             </div>
//           </form>
//         </Form>
//       ) : (
//         <Form {...otpForm}>
//           <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="w-full">
//             <div className="flex w-full flex-col items-center justify-center gap-4 px-4 md:px-8 lg:px-12">
//               <div className="flex gap-2">
//                 {[0, 1, 2, 3, 4, 5].map((index) => (
//                   <FormField
//                     key={index}
//                     control={otpForm.control}
//                     name={`otp.${index}`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             type="text"
//                             inputMode="numeric"
//                             maxLength={1}
//                             className="h-12 w-12 text-center text-xl"
//                             onChange={(e) => handleOtpChange(e.target, index)}
//                             onKeyDown={(e) => handleOtpKeyDown(e, index)}
//                             onPaste={(e) => handleOtpPaste(e, index)}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 ))}
//               </div>
//               {otpForm.formState.errors.otp && (
//                 <div className="text-sm text-red-500">
//                   Please enter a valid 6-digit OTP
//                 </div>
//               )}
//             </div>
//             <div className="mt-16 flex flex-col items-center gap-3">
//               <MyButton
//                 type="submit"
//                 scale="large"
//                 buttonType="primary"
//                 layoutVariant="default"
                
//               >
//                 Login
//               </MyButton>
//               <div className="flex">
//               <MyButton
//                 type="button"
//                 scale="medium"
//                 buttonType="text"
//                 onClick={handleBackToEmail}
//               >
//                 Back
//               </MyButton>
//               <MyButton
//                 type="button"
//                 scale="medium"
//                 buttonType="text"
//                 className="text-primary-500"
//                 onClick={() => sendOtpMutation.mutate(email)}
//               >
//                 Resend OTP
//               </MyButton>
              
//               </div>
//             </div>
//           </form>
//         </Form>
//       )}
//       <div className=" flex flex-col items-center">
//         <MyButton
//           type="button"
//           scale="medium"
//           buttonType="text"
//           className="text-primary-500"
//           onClick={onSwitchToUsername}
//         >
//           Login with username
//         </MyButton>
//       </div>
//     </div>
//   );
// }

// //  DONT automaticly login after 6 digits are entered only login after submit button is clicked






import React, { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MyInput } from "@/components/design-system/input";
import { MyButton } from "@/components/design-system/button";
import { TokenKey } from "@/constants/auth/tokens";
import {
  getTokenDecodedData,
  setInstituteIdInStorage,
  setTokenInStorage,
} from "@/lib/auth/sessionUtility";
import { LOGIN_OTP, REQUEST_OTP } from "@/constants/urls";
import axios from "axios";
import { fetchAndStoreInstituteDetails } from "@/services/fetchAndStoreInstituteDetails";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const otpSchema = z.object({
  otp: z
    .array(z.string())
    .length(6)
    .transform((val) => val.join("")),
});

// Email OTP Login Schema
export const emailOtpLoginSchema = z.object({
  email: z
      .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a valid string",
      })
      .trim()
      .email("Invalid email address")
      .max(255, { message: "Email must be less than 255 characters" }),
  otp: z
      .string({
          required_error: "OTP is required",
          invalid_type_error: "OTP must be a valid string",
      })
      .length(6, { message: "OTP must be exactly 6 characters" })
      .regex(/^\d+$/, { message: "OTP must contain only digits" }),
});


type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = { otp: string[] };

export function EmailLogin({
  onSwitchToUsername,
}: {
  onSwitchToUsername: () => void;
}) {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(6).fill(""),
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => axios.post(REQUEST_OTP, { email }),
    onSuccess: () => {
      setIsOtpSent(true);
      toast.success("OTP sent successfully");
    },
    onError: () => {
      toast.error("Failed to send OTP", {
        description: "Please try again",
        duration: 3000,
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      axios.post(LOGIN_OTP, data),
    onSuccess: async (response) => {
      await setTokenInStorage(TokenKey.accessToken, response.data.accessToken);
      await setTokenInStorage(
        TokenKey.refreshToken,
        response.data.refreshToken
      );
      // Decode token to get user data
      const decodedData = await getTokenDecodedData(response.data.accessToken);

      // Check authorities in decoded data
      const authorities = decodedData.authorities;
      const userId = decodedData.user;
      const authorityKeys = authorities ? Object.keys(authorities) : [];

      if (authorityKeys.length == 1) {
        // Redirect to InstituteSelection if multiple authorities are found
        navigate({ to: "/institute-selection" });
      } else {
        // Get the single institute ID
        const instituteId = Object.keys(authorities)[0];

        const details = await fetchAndStoreInstituteDetails(
          instituteId,
          userId
        );

        if (details) {
          navigate({ to: "/dashboard" });
        }
      }
    },
    onError: () => {
      toast.error("Invalid OTP", {
        description: "Please try again",
        duration: 3000,
      });
      otpForm.reset();
    },
  });

  const onEmailSubmit = (data: EmailFormValues) => {
    setEmail(data.email);
    sendOtpMutation.mutate(data.email);
  };

  const onOtpSubmit = (data: OtpFormValues) => {
    const otpValue = data.otp.join("");
    if (otpValue.length === 6) {
      verifyOtpMutation.mutate({ email, otp: otpValue });
    }
  };

  const handleBackToEmail = () => {
    setIsOtpSent(false);
    emailForm.reset();
  };

  // Handle input changes for OTP blocks with improved navigation
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Only allow numbers

    if (value) {
      const newOtp = [...otpForm.getValues().otp];
      newOtp[index] = value.substring(0, 1);
      otpForm.setValue("otp", newOtp);

      // Auto-focus next input if current input is filled
      if (index < 5 && value.length === 1) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace for OTP blocks with improved navigation
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const currentValue = otpForm.getValues().otp[index];

    if (e.key === "Backspace") {
      if (!currentValue && index > 0) {
        // If current input is empty, move to previous input and clear it
        const newOtp = [...otpForm.getValues().otp];
        newOtp[index - 1] = "";
        otpForm.setValue("otp", newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else if (currentValue) {
        // If current input has a value, clear it
        const newOtp = [...otpForm.getValues().otp];
        newOtp[index] = "";
        otpForm.setValue("otp", newOtp);
      }
    }
  };

  return (
    <div>
      {!isOtpSent ? (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="w-full"
          >
            <div className="flex w-full flex-col items-center justify-center gap-4 px-4 md:px-8 lg:px-12">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MyInput
                        inputType="email"
                        inputPlaceholder="you@example.com"
                        label="Email"
                        required
                        size="large"
                        error={emailForm.formState.errors.email?.message}
                        {...field}
                        className="w-[300px] md:w-[348px] lg:w-[348px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-16 flex flex-col items-center gap-3">
              <MyButton
                type="submit"
                scale="large"
                buttonType="primary"
                layoutVariant="default"
              >
                Send OTP
              </MyButton>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="w-full">
            <div className="flex w-full flex-col items-center justify-center gap-4 px-4 md:px-8 lg:px-12">
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <FormField
                    key={index}
                    control={otpForm.control}
                    name={`otp.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            ref={(el) => (otpInputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="h-12 w-12 text-center text-xl"
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {otpForm.formState.errors.otp && (
                <div className="text-sm text-red-500">
                  Please enter a valid 6-digit OTP
                </div>
              )}
            </div>
            <div className="mt-16 flex flex-col items-center gap-3">
              {/* <MyButton
                type="submit"
                scale="large"
                buttonType="primary"
                layoutVariant="default"
              >
                Login
              </MyButton> */}
              <MyButton
  type="submit"
  scale="large"
  buttonType="primary"
  layoutVariant="default"
  disabled={otpForm.getValues().otp.some(value => value === '')}
  onClick={() => otpForm.handleSubmit(onOtpSubmit)()}
>
  Login
</MyButton>
              <div className="flex">
                <MyButton
                  type="button"
                  scale="medium"
                  buttonType="text"
                  onClick={handleBackToEmail}
                >
                  Back
                </MyButton>
                <MyButton
                  type="button"
                  scale="medium"
                  buttonType="text"
                  className="text-primary-500"
                  onClick={() => sendOtpMutation.mutate(email)}
                >
                  Resend OTP
                </MyButton>
              </div>
            </div>
          </form>
        </Form>
      )}
      <div className=" flex flex-col items-center">
        <MyButton
          type="button"
          scale="medium"
          buttonType="text"
          className="text-primary-500"
          onClick={onSwitchToUsername}
        >
          Login with username
        </MyButton>
      </div>
    </div>
  );
}
