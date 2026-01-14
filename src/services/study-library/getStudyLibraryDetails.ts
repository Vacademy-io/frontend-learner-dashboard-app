// services/study-library/getStudyLibraryDetails.ts
import authenticatedAxiosInstance from "@/lib/auth/axiosInstance";
import { INIT_STUDY_LIBRARY } from "@/constants/urls";
import { useStudyLibraryStore } from "@/stores/study-library/use-study-library-store";
import { getInstituteId } from "@/utils/study-library/get-list-from-stores/getPackageSessionId";

export const fetchStudyLibraryDetails = async (packageSessionId: string) => {
    // Favor the structured getInstituteId utility
    const idFromDetails = await getInstituteId();

    // Fallback to stand-alone key or hardcoded ID if details are missing
    const effectiveInstituteId = idFromDetails;


    const response = await authenticatedAxiosInstance.get(INIT_STUDY_LIBRARY, {
        params: {
            instituteId: effectiveInstituteId,
            packageSessionId: packageSessionId,
        },
    });
    return response.data;
};

export const useStudyLibraryQuery = (packageSessionId: string) => {
    const setStudyLibraryData = useStudyLibraryStore(
        (state) => state.setStudyLibraryData
    );

    return {
        queryKey: ["GET_INIT_STUDY_LIBRARY"],
        queryFn: async () => {
            const data = await fetchStudyLibraryDetails(packageSessionId);
            setStudyLibraryData(data);
            return data;
        },
        staleTime: 60000,
    };
};
