import AccountDetailsEdit from "@/components/common/user-profile/account-details-edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/change-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-white relative rounded-lg h-screen w-full max-w-md mx-auto shadow-lg sm:max-w-md md:max-w-lg lg:max-w-xl">
      <AccountDetailsEdit isModal={false} />
    </div>
  );
}
