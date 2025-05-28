import { create } from 'zustand';

interface MediaRefsStore {
  currentPdfPage: number;
  currentYoutubeTime: number;
  currentUploadedVideoTime: number;
  navigationTrigger: number;
  setCurrentPdfPage: (page: number) => void;
  setCurrentYoutubeTime: (time: number) => void;
  setCurrentUploadedVideoTime: (time: number) => void;
  navigateToPdfPage: (page: number) => void;
}

export const useMediaRefsStore = create<MediaRefsStore>((set) => ({
  // State values
  currentPdfPage: 0,
  currentYoutubeTime: 0,
  currentUploadedVideoTime: 0,
  navigationTrigger: 0,

  // Setters
  setCurrentPdfPage: (page: number) => set({ currentPdfPage: page }),
  setCurrentYoutubeTime: (time: number) => set({ currentYoutubeTime: time }),
  setCurrentUploadedVideoTime: (time: number) => set({ currentUploadedVideoTime: time }),
  navigateToPdfPage: (page: number) => set((state) => ({ 
    currentPdfPage: page, 
    navigationTrigger: state.navigationTrigger + 1 
  })),
})); 