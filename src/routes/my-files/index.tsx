import { LayoutContainer } from "@/components/common/layout-container/layout-container";
import MyFilesPage from "@/components/common/my-files/my-files-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-files/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LayoutContainer className="!m-0 !p-0 max-w-none">
      <MyFilesPage />
    </LayoutContainer>
  );
}
