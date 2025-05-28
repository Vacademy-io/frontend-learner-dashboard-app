import { ADD_DOUBT } from "@/constants/urls";
import { DoubtType } from "../types/add-doubt-type";
import { useMutation } from "@tanstack/react-query";
import authenticatedAxiosInstance from "@/lib/auth/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaRefsStore } from "@/stores/mediaRefsStore";

export const useAddDoubt = () => {
   const queryClient = useQueryClient();

   const { currentPdfPage } = useMediaRefsStore();
    const { currentYoutubeTime } = useMediaRefsStore();
    const { currentUploadedVideoTime } = useMediaRefsStore();

   return useMutation({
    mutationFn: async (doubt: DoubtType) => {
        if(doubt.id==undefined){
            return authenticatedAxiosInstance.post(ADD_DOUBT, doubt);
        }else {
            return authenticatedAxiosInstance.post(`${ADD_DOUBT}?doubtId=${doubt.id}`, doubt)
        }
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_DOUBTS"] });
    },
});
}

