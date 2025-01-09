
  
  // store/assessment-store.ts
  import { create } from 'zustand';
  
  interface AssessmentStore {
    currentQuestion: string;
    currentSection: number;
    questionStates: { [key: string]: QuestionState };
    setCurrentQuestion: (questionId: string) => void;
    setCurrentSection: (section: number) => void;
    markQuestion: (questionId: string, state: Partial<QuestionState>) => void;
  }
  
  export const useAssessmentStore = create<AssessmentStore>((set) => ({
    currentQuestion: '',
    currentSection: 0,
    questionStates: {},
    setCurrentQuestion: (questionId) => set({ currentQuestion: questionId }),
    setCurrentSection: (section) => set({ currentSection: section }),
    markQuestion: (questionId, state) =>
      set((prev) => ({
        questionStates: {
          ...prev.questionStates,
          [questionId]: {
            ...prev.questionStates[questionId],
            ...state,
          },
        },
      })),
  }));
  