// services/study-library/getStudyLibraryDetails.ts
import authenticatedAxiosInstance from "@/lib/auth/axiosInstance";
import { INIT_STUDY_LIBRARY, INSTITUTE_ID } from "@/constants/urls";
import { useStudyLibraryStore } from "@/stores/study-library/use-study-library-store";
import { getTokenFromStorage } from "@/lib/auth/sessionUtility";

export const fetchStudyLibraryDetails = async (packageSessionId: string) => {
    
    // Dynamically retrieve the active institute ID from storage
    // This avoids using the hardcoded fallback from urls.ts
    const storedInstituteId = await getTokenFromStorage("InstituteId") ;

    const effectiveInstituteId = (storedInstituteId && storedInstituteId !== "undefined")
        ? storedInstituteId
        : INSTITUTE_ID;

   
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
