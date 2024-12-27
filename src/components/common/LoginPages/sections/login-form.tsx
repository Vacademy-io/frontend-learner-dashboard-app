
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
// import { setAuthorizationCookie } from "@/lib/auth/sessionUtility";
// import { TokenKey } from "@/constants/auth/tokens";
import { useNavigate } from "@tanstack/react-router";

import { LoginImage } from "@/assets/svgs"; // Add the logo here

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { hasSeenAnimation, setHasSeenAnimation } = useAnimationStore();
  const [showSplash, setShowSplash] = useState(!hasSeenAnimation);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  // Handle splash screen timing
  useEffect(() => {
    if (!hasSeenAnimation) {
      const timer = setTimeout(() => {
        setHasSeenAnimation();
        setShowSplash(false);
      }, 2000); // Splash screen duration
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [hasSeenAnimation, setHasSeenAnimation]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      loginUser(values.username, values.password),
    onSuccess: (response) => {
      if (response) {
        // setAuthorizationCookie(TokenKey.accessToken, response.accessToken);
        // setAuthorizationCookie(TokenKey.refreshToken, response.refreshToken);
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Login Error", {
          description: "Invalid credentials",
          className: "error-toast",
          duration: 3000,
        });
        form.reset();
      }
    },
    onError: () => {
      toast.error("Login Error", {
        description: "Invalid username or password",
        className: "error-toast",
        duration: 3000,
      });
      form.reset();
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  // Conditionally render the splash screen
  if (showSplash) {
    return <SplashScreen isAnimationEnabled children={undefined} />;
  }

  // Login form content
  return (
    <div className="w-screen bg-whit">
      {/* Logo Section */}
      <div className="relative p-16 flex flex-col w-full items-center justify-center">
        <img src={LoginImage} alt="logo" width={80} height={80} />
      </div>

      {/* Login Form Section */}
      <div className="flex w-full flex-col items-center justify-center gap-20 px-8">
        <Heading
          heading="Hello, Student!"
          subHeading="Ready to learn something new? Log in and continue your academic adventure!"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="flex w-full flex-col items-center justify-center gap-8 px-16">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <MyInput
                          inputType="text"
                          inputPlaceholder="Enter your username"
                          input={value}
                          onChangeFunction={onChange}
                          error={form.formState.errors.username?.message}
                          required
                          size="large"
                          label="Username"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span>
                  <Link to="/login/forgot-password">
                    <div className="cursor-pointer text-caption font-regular text-primary-500 inline-block pl-1">
                      Forgot Username?
                    </div>
                  </Link>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <MyInput
                          inputType="password"
                          inputPlaceholder="••••••••"
                          input={value}
                          onChangeFunction={onChange}
                          error={form.formState.errors.password?.message}
                          required
                          size="large"
                          label="Password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span>
                  <Link to="/login/forgot-password">
                    <div className="cursor-pointer text-caption font-regular text-primary-500 inline-block pl-1">
                      Forgot Password?
                    </div>
                  </Link>
                </span>
              </div>
            </div>
            <div className="mt-20 flex flex-col items-center gap-1">
              <MyButton
                type="submit"
                scale="large"
                buttonType="primary"
                layoutVariant="default"
              >
                Login
              </MyButton>
              <div className="flex gap-1 text-body font-regular">
                <div className="text-neutral-500">
                Don’t have an account?
                </div>
                <Link to="/login" className="cursor-pointer text-primary-500">
                  Create Request
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
