// // CallInitStudyLibraryIfNull.tsx
// import { DashboardLoader } from "@/components/core/dashboard-loader";
// import { useModulesWithChaptersQuery } from "@/services/study-library/getModulesWithChapters";
// import { useSelectedSessionStore } from "@/stores/study-library/selected-session-store";
// import { useGetPackageSessionId } from "@/utils/helpers/study-library-helpers.ts/get-list-from-stores/getPackageSessionId";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "@tanstack/react-router";

// export const ModulesWithChaptersProvider = ({
//     subjectId,
//     children,
// }: {
//     subjectId: string;
//     children: React.ReactNode;
// }) => {
//     const router = useRouter();
//     const { courseId, levelId } = router.state.location.search;
//     const { selectedSession } = useSelectedSessionStore();

//     const packageSessionId = useGetPackageSessionId(
//         courseId || "",
//         selectedSession?.id || "",
//         levelId || "",
//     );
//     // Always call the query hook, but control its execution with enabled
//     const { isLoading } = useQuery({
//         ...useModulesWithChaptersQuery(subjectId, packageSessionId || ""),
//         staleTime: 3600000,
//     });

//     return <div>{isLoading ? <DashboardLoader /> : children}</div>;
// };
