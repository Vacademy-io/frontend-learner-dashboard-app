import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/common/LoginPages/sections/login-form";
import { Storage } from "@capacitor/storage";
import { TokenKey } from "@/constants/auth/tokens";
import { isNullOrEmptyOrUndefined } from "@/lib/utils";

export const Route = createFileRoute("/login/")({
  
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
