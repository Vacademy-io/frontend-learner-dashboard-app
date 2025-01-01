// import { createFileRoute } from "@tanstack/react-router";
// import { LoginForm } from "@/components/common/LoginPages/sections/login-form";
// // import { SplashScreen } from "@/components/common/LoginPages/layout/splash-container";

// import { getTokenFromCookie } from "@/lib/auth/sessionUtility";
// import { TokenKey } from "@/constants/auth/tokens";
// import { isNullOrEmptyOrUndefined } from "@/lib/utils";

// export const Route = createFileRoute("/login/")({
//   loader: () => {
//     const accessToken = getTokenFromCookie(TokenKey.accessToken);
//     if (!isNullOrEmptyOrUndefined(accessToken)) {
//         throw new Error("Redirect to /dashboard");
//     }
//     return;
//   },
//   component: RouteComponent
// });

// function RouteComponent() {
//   return (
//       <LoginForm />
//   );
// }



import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/common/LoginPages/sections/login-form";
// import { SplashScreen } from "@/components/common/LoginPages/layout/splash-container";

import { Storage } from "@capacitor/storage";
import { TokenKey } from "@/constants/auth/tokens";
import { isNullOrEmptyOrUndefined } from "@/lib/utils";

export const Route = createFileRoute("/login/")({
  loader: async () => {
    const { value: accessToken } = await Storage.get({ key: TokenKey.accessToken });
    if (!isNullOrEmptyOrUndefined(accessToken)) {
      throw new Error("Redirect to /dashboard");
    }
    return;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
