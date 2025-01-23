import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/common/LoginPages/layout/splash-container";
import { useAnimationStore } from "@/stores/login/animationStore";
import { Heading } from "@/components/common/LoginPages/ui/heading";
import { MyInput } from "@/components/design-system/input";
import { MyButton } from "@/components/design-system/button";
import { Link } from "@tanstack/react-router";
import { loginSchema } from "@/schemas/login/login";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser } from "@/hooks/login/login-button";
import { Storage } from "@capacitor/storage";
import { TokenKey } from "@/constants/auth/tokens";
import { useNavigate } from "@tanstack/react-router";
import HeaderLogo from "../ui/header_logo";

import { isNullOrEmptyOrUndefined } from "@/lib/utils";
import {
  getTokenFromStorage,
  setTokenInStorage,
} from "@/lib/auth/sessionUtility";
import { EmailLogin } from "./EmailOtpForm";
import { UsernameLogin } from "./UsernamePasswordForm";
type FormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { hasSeenAnimation, setHasSeenAnimation } = useAnimationStore();
  const [showSplash, setShowSplash] = useState(!hasSeenAnimation);
  const navigate = useNavigate();
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  // const form = useForm<FormValues>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: {
  //     username: "",
  //     password: "",
  //   },
  //   mode: "onTouched",
  // });
  // useEffect(() => {
  //   const redirect = async () => {
  //     const token = await getTokenFromStorage(TokenKey.accessToken);
  //     if (!isNullOrEmptyOrUndefined(token)) {
  //       navigate({ to: "/dashboard" });
  //     }
  //   };
  //   redirect();
  // }, []);
  // // Handle splash screen timing
  useEffect(() => {
    if (!hasSeenAnimation) {
      const timer = setTimeout(() => {
        setHasSeenAnimation();
        setShowSplash(false);
      }, 2000); // Splash screen duration
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [hasSeenAnimation, setHasSeenAnimation]);

  // const mutation = useMutation({
  //   mutationFn: (values: FormValues) =>
  //     loginUser(values.username, values.password),
  //   onSuccess: async (response) => {
  //     if (response) {
  //       // Store tokens in Capacitor Storage
  //       await setTokenInStorage(TokenKey.accessToken, response.accessToken);
  //       await setTokenInStorage(TokenKey.refreshToken, response.refreshToken);
  //       navigate({ to: "/dashboard" });
  //     } else {
  //       toast.error("Login Error", {
  //         description: "Invalid credentials",
  //         className: "error-toast",
  //         duration: 3000,
  //       });
  //       form.reset();
  //     }
  //   },
  //   onError: () => {
  //     toast.error("Login Error", {
  //       description: "Invalid username or password",
  //       className: "error-toast",
  //       duration: 3000,
  //     });
  //     form.reset();
  //   },
  // });

  // function onSubmit(values: FormValues) {
  //   mutation.mutate(values);
  // }

  // Conditionally render the splash screen
  if (showSplash) {
    return <SplashScreen isAnimationEnabled />;
  }

  // Login form content
  return (
    <div className="w-screen bg-white gap-4 md:gap-8 lg:gap-10">
      {/* Logo Section */}
      <HeaderLogo />

      {/* Login Form Section */}
      <div className="flex w-full flex-col items-center justify-center gap-4 md:gap-8 lg:gap-12 px-4 md:px-8 lg:px-12">
        <Heading
          heading="Hello, Student!"
          subHeading="Ready to learn something new? Log in and continue your academic adventure!"
        />
        {/* Toggle Content */}
        <div className="w-full max-w-md">
          {isEmailLogin ? (
            <EmailLogin onSwitchToUsername={() => setIsEmailLogin(false)} />
          ) : (
            <UsernameLogin onSwitchToEmail={() => setIsEmailLogin(true)} />
          )}
        </div>

          
        <div className="flex font-regular pb-5 items-center">
          <div className="text-neutral-500 text-sm md:text-base lg:text-base">
            Don’t have an account?
          </div>
          <MyButton
            type="button"
            scale="medium"
            buttonType="text"
            layoutVariant="default"
            className="text-primary-500"
            onClick={() => navigate({ to: "/login" })}
          >
            Create Account
          </MyButton>
        </div>
      </div>
    </div>
  );
}
