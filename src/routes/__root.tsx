// import { QueryClient } from "@tanstack/react-query";
// import {
//   createRootRouteWithContext,
//   Outlet,
//   redirect,
// } from "@tanstack/react-router";
// import React, { Suspense, useEffect } from "react";
// import {
//   AppUpdate,
//   AppUpdateAvailability,
// } from "@capawesome/capacitor-app-update";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { toast } from "sonner";
// import { useUpdate } from "@/stores/useUpdate";
// import Favicon from "react-favicon";
// import useStore from "@/components/common/layout-container/sidebar/useSidebar";

// const TanStackRouterDevtools =
//   process.env.NODE_ENV === "production"
//     ? () => null
//     : React.lazy(() =>
//         import("@tanstack/router-devtools").then((res) => ({
//           default: res.TanStackRouterDevtools,
//         }))
//       );

// const RootComponent = () => {
//   const { setUpdateAvailable } = useUpdate();
//   const { instituteLogoFileUrl } = useStore();
//   const vacademyUrl = "/vacademy-logo.svg";
//   const getFallbackLogoUrl = (logoUrl: string | null | undefined): string => {
//     return logoUrl && logoUrl.trim() !== "" ? logoUrl : vacademyUrl;
//   };

//   useEffect(() => {
//     (async () => {
//       const result = await AppUpdate.getAppUpdateInfo();
//       if (
//         result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE
//       ) {
//         toast.warning("Update available, please update app...");
//         setUpdateAvailable(true);
//         if (result.immediateUpdateAllowed) {
//           await AppUpdate.performImmediateUpdate();
//         }
//       }
//     })();
//   }, []);

//   return (
//     <>
//       <Outlet />
//       {/* Development tools */}
//       <Suspense>
//         <TanStackRouterDevtools />
//       </Suspense>
//       <Favicon url={getFallbackLogoUrl(instituteLogoFileUrl)} />
//       <ReactQueryDevtools initialIsOpen={false} />
//     </>
//   );
// };

// export const Route = createRootRouteWithContext<{
//   queryClient: QueryClient;
// }>()({
//   beforeLoad: ({ location }) => {
//     if (location.pathname === "/") {
//       throw redirect({
//         to: "/login",
//       });
//     }
//   },
//   component: RootComponent,
// });

import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import React, { Suspense, useEffect } from "react";
import {
  AppUpdate,
  AppUpdateAvailability,
} from "@capawesome/capacitor-app-update";
import { App } from "@capacitor/app"; // Import Capacitor's App module
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import { useUpdate } from "@/stores/useUpdate";
import Favicon from "react-favicon";
import useStore from "@/components/common/layout-container/sidebar/useSidebar";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

const RootComponent = () => {
  const { setUpdateAvailable } = useUpdate();
  const { instituteLogoFileUrl } = useStore();
  const navigate = useNavigate(); // Get the router navigation function
  const vacademyUrl = "/vacademy-logo.svg";

  const getFallbackLogoUrl = (logoUrl: string | null | undefined): string => {
    return logoUrl && logoUrl.trim() !== "" ? logoUrl : vacademyUrl;
  };

  useEffect(() => {
    (async () => {
      const result = await AppUpdate.getAppUpdateInfo();
      if (
        result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE
      ) {
        toast.warning("Update available, please update app...");
        setUpdateAvailable(true);
        if (result.immediateUpdateAllowed) {
          await AppUpdate.performImmediateUpdate();
        }
      }
    })();
  }, []);

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log("Deep link opened:", event.url);

      // Extract path after domain
      const path = new URL(event.url).pathname;

      // Navigate within the app
      if (path) {
        navigate({ to: path });
      }
    };

    App.addListener("appUrlOpen", handleDeepLink);

    return () => {
      App.removeAllListeners();
    };
  }, [navigate]);

  return (
    <>
      <Outlet />
      {/* Development tools */}
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      <Favicon url={getFallbackLogoUrl(instituteLogoFileUrl)} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RootComponent,
});
