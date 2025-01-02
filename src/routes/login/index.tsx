import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/common/LoginPages/sections/login-form";
import { Storage } from "@capacitor/storage";
import { TokenKey } from "@/constants/auth/tokens";
import { isNullOrEmptyOrUndefined } from "@/lib/utils";

export const Route = createFileRoute("/login/")({
  loader: async () => {
        const { value: accessToken } = await Storage.get({ key: TokenKey.accessToken });
    if (!isNullOrEmptyOrUndefined(accessToken)) {
      throw redirect({ to: "/dashboard" });
    }
    return;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
