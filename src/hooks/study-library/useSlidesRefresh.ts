import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export const useSlidesRefresh = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { chapterId } = router.state.location.search;

  const refreshSlides = async () => {
    console.log("🔄 [useSlidesRefresh] Starting comprehensive refresh process");
    console.log("📋 [useSlidesRefresh] Chapter ID:", chapterId);
    
    try {
      // 1. Invalidate slides query for the current chapter
      if (chapterId) {
        console.log("🗂️ [useSlidesRefresh] Invalidating slides query:", ["slides", chapterId]);
        await queryClient.invalidateQueries({
          queryKey: ["slides", chapterId],
        });
        
        // Force refetch to ensure data is updated immediately
        await queryClient.refetchQueries({
          queryKey: ["slides", chapterId],
        });
        console.log("✅ [useSlidesRefresh] Slides query refreshed");
      }

      // 2. Invalidate study library data to update subject/module/chapter percentages
      console.log("🗂️ [useSlidesRefresh] Invalidating study library query");
      await queryClient.invalidateQueries({
        queryKey: ["GET_INIT_STUDY_LIBRARY"],
      });
      
      // Force refetch study library to update left sidebar progress
      await queryClient.refetchQueries({
        queryKey: ["GET_INIT_STUDY_LIBRARY"],
      });
      console.log("✅ [useSlidesRefresh] Study library refreshed - sidebar progress updated");

      console.log("✅ [useSlidesRefresh] Complete refresh finished - all progress data updated!");
    } catch (error) {
      console.error("❌ [useSlidesRefresh] Failed to refresh data:", error);
    }
  };

  return {
    refreshSlides,
    chapterId,
  };
}; 