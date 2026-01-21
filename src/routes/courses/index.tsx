import { createFileRoute } from "@tanstack/react-router";
import CourseCatalougePage from "./-component/CourseCatalougePage";
// Removed legacy institute resolution in favor of domain routing
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { handleGetInstituteIdWithLocalStorageCheck } from "./-services/courses-services";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import RootNotFoundComponent from "@/components/core/default-not-found";
import { DashboardLoader } from "@/components/core/dashboard-loader";
import { useDomainRouting } from "@/hooks/use-domain-routing";

export const Route = createFileRoute("/courses/")({
    component: CoursesContainerComponent,
    validateSearch: () => {
        return {};
    },
});

function CoursesContainerComponent() {
    const navigate = useNavigate();
    const domainRouting = useDomainRouting();


    // Authenticated redirect logic removed to allow public access for logged-in users
    // If we need to restore the pending payment check without redirect, we can do it here,
    // but the original logic was specific to "preventing redirect".
    // Since we aren't redirecting anymore, no special logic is needed.

    if (domainRouting.isLoading) return <DashboardLoader />;

    // If we couldn't resolve any instituteId, show not found
    if (!domainRouting.instituteId) {
        return <RootNotFoundComponent />;
    }

    return (
        <div className="min-h-screen bg-white">
            <CourseCatalougePage instituteId={domainRouting.instituteId} />
        </div>
    );
}
