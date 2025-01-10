// import { create } from "zustand";
// import {
//   Assessment,
//   Question,
//   QuestionState,
// } from "../types/assessment";

// interface SectionTimer {
//   timeLeft: number;
//   isRunning: boolean;
// }

// interface AssessmentStore {
//   assessment: Assessment | null;
//   currentSection: number;
//   currentQuestion: Question | null;
//   questionStates: Record<string, QuestionState>;
//   answers: Record<string, string>;
//   sectionTimers: Record<number, SectionTimer>;
//   setAssessment: (assessment: Assessment) => void;
//   setCurrentSection: (sectionIndex: number) => void;
//   setCurrentQuestion: (question: Question) => void;
//   setQuestionState: (questionId: string, state: Partial<QuestionState>) => void;
//   setAnswer: (questionId: string, answerId: string | null) => void;
//   markForReview: (questionId: string) => void;
//   clearResponse: (questionId: string) => void;
//   updateSectionTimer: (sectionIndex: number, timeLeft: number) => void;
//   toggleSectionTimer: (sectionIndex: number, isRunning: boolean) => void;
// }

// export const useAssessmentStore = create<AssessmentStore>((set) => ({
//   assessment: null,
//   currentSection: 0,
//   currentQuestion: null,
//   questionStates: {},
//   answers: {},
//   sectionTimers: {},
//   setAssessment: (assessment) =>
//     set((state) => {
//       const questionStates: Record<string, QuestionState> = {};
//       const sectionTimers: Record<number, SectionTimer> = {};

//       assessment.sections.forEach((section, index) => {
//         const [minutes, seconds] = section.assesmentDuration
//           .split(":")
//           .map(Number);
//         sectionTimers[index] = {
//           timeLeft: (minutes * 60 + seconds) * 1000,
//           isRunning: index === 0,
//         };

//         section.questions.forEach((question) => {
//           questionStates[question.questionId] = {
//             isAnswered: false,
//             isVisited: false,
//             isMarkedForReview: false,
//           };
//         });
//       });

//       return { assessment, questionStates, sectionTimers };
//     }),
//   setCurrentSection: (sectionIndex) =>
//     set((state) => {
//       // Pause current section timer and start new section timer
//       const updatedTimers = { ...state.sectionTimers };
//       Object.keys(updatedTimers).forEach((key) => {
//         updatedTimers[Number(key)].isRunning = Number(key) === sectionIndex;
//       });
//       return { currentSection: sectionIndex, sectionTimers: updatedTimers };
//     }),
//   setCurrentQuestion: (question) =>
//     set((state) => ({
//       currentQuestion: question,
//       questionStates: {
//         ...state.questionStates,
//         [question.questionId]: {
//           ...state.questionStates[question.questionId],
//           isVisited: true,
//         },
//       },
//     })),
//   setQuestionState: (questionId, state) =>
//     set((prevState) => ({
//       questionStates: {
//         ...prevState.questionStates,
//         [questionId]: { ...prevState.questionStates[questionId], ...state },
//       },
//     })),
//   setAnswer: (questionId, answerId) =>
//     set((state) => ({
//       answers: answerId
//         ? { ...state.answers, [questionId]: answerId }
//         : Object.fromEntries(
//             Object.entries(state.answers).filter(([key]) => key !== questionId)
//           ),
//       questionStates: {
//         ...state.questionStates,
//         [questionId]: {
//           ...state.questionStates[questionId],
//           isAnswered: Boolean(answerId),
//         },
//       },
//     })),
//   markForReview: (questionId) =>
//     set((state) => ({
//       questionStates: {
//         ...state.questionStates,
//         [questionId]: {
//           ...state.questionStates[questionId],
//           isMarkedForReview:
//             !state.questionStates[questionId].isMarkedForReview,
//         },
//       },
//     })),
//   clearResponse: (questionId) =>
//     set((state) => ({
//       answers: Object.fromEntries(
//         Object.entries(state.answers).filter(([key]) => key !== questionId)
//       ),
//       questionStates: {
//         ...state.questionStates,
//         [questionId]: {
//           ...state.questionStates[questionId],
//           isAnswered: false,
//         },
//       },
//     })),
//   updateSectionTimer: (sectionIndex, timeLeft) =>
//     set((state) => ({
//       sectionTimers: {
//         ...state.sectionTimers,
//         [sectionIndex]: {
//           ...state.sectionTimers[sectionIndex],
//           timeLeft,
//         },
//       },
//     })),
//   toggleSectionTimer: (sectionIndex, isRunning) =>
//     set((state) => ({
//       sectionTimers: {
//         ...state.sectionTimers,
//         [sectionIndex]: {
//           ...state.sectionTimers[sectionIndex],
//           isRunning,
//         },
//       },
//     })),
// }));



import { create } from 'zustand'
import { Assessment, Question, QuestionState } from '../types/assessment'

interface SectionTimer {
  timeLeft: number
  isRunning: boolean
}

interface AssessmentStore {
  assessment: Assessment | null
  currentSection: number
  currentQuestion: Question | null
  questionStates: Record<string, QuestionState>
  answers: Record<string, string>
  sectionTimers: Record<number, SectionTimer>
  setAssessment: (assessment: Assessment) => void
  setCurrentSection: (sectionIndex: number) => void
  setCurrentQuestion: (question: Question) => void
  setQuestionState: (questionId: string, state: Partial<QuestionState>) => void
  setAnswer: (questionId: string, answerId: string | null) => void
  markForReview: (questionId: string) => void
  clearResponse: (questionId: string) => void
  updateSectionTimer: (sectionIndex: number, timeLeft: number) => void
  toggleSectionTimer: (sectionIndex: number, isRunning: boolean) => void
  isSubmitted: boolean
  submitAssessment: () => void
  findNextAvailableSection: () => number | null
  moveToNextAvailableSection: () => void
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  assessment: null,
  currentSection: 0,
  currentQuestion: null,
  questionStates: {},
  answers: {},
  sectionTimers: {},
  setAssessment: (assessment) => set((state) => {
    const questionStates: Record<string, QuestionState> = {}
    const sectionTimers: Record<number, SectionTimer> = {}
    
    assessment.sections.forEach((section, index) => {
      const [minutes, seconds] = section.assesmentDuration.split(':').map(Number)
      sectionTimers[index] = {
        timeLeft: (minutes * 60 + seconds) * 1000,
        isRunning: index === 0
      }
      
      // Check if questions is an array, if not, convert it to an array
      const questions = Array.isArray(section.questions) ? section.questions : [section.questions]
      questions.forEach(question => {
        questionStates[question.questionId] = {
          isAnswered: false,
          isVisited: false,
          isMarkedForReview: false
        }
      })
    })
    
    return { assessment, questionStates, sectionTimers }
  }),
  setCurrentSection: (sectionIndex) => set((state) => {
    // Pause current section timer and start new section timer
    const updatedTimers = { ...state.sectionTimers }
    Object.keys(updatedTimers).forEach(key => {
      updatedTimers[Number(key)].isRunning = Number(key) === sectionIndex
    })
    return { currentSection: sectionIndex, sectionTimers: updatedTimers }
  }),
  setCurrentQuestion: (question) => set((state) => ({
    currentQuestion: question,
    questionStates: {
      ...state.questionStates,
      [question.questionId]: {
        ...state.questionStates[question.questionId],
        isVisited: true
      }
    }
  })),
  setQuestionState: (questionId, state) => set((prevState) => ({
    questionStates: {
      ...prevState.questionStates,
      [questionId]: { ...prevState.questionStates[questionId], ...state }
    }
  })),
  setAnswer: (questionId, answerId) => set((state) => ({
    answers: answerId ? { ...state.answers, [questionId]: answerId } : 
      Object.fromEntries(Object.entries(state.answers).filter(([key]) => key !== questionId)),
    questionStates: {
      ...state.questionStates,
      [questionId]: { 
        ...state.questionStates[questionId], 
        isAnswered: Boolean(answerId)
      }
    }
  })),
  markForReview: (questionId) => set((state) => ({
    questionStates: {
      ...state.questionStates,
      [questionId]: {
        ...state.questionStates[questionId],
        isMarkedForReview: !state.questionStates[questionId].isMarkedForReview
      }
    }
  })),
  clearResponse: (questionId) => set((state) => ({
    answers: Object.fromEntries(Object.entries(state.answers).filter(([key]) => key !== questionId)),
    questionStates: {
      ...state.questionStates,
      [questionId]: {
        ...state.questionStates[questionId],
        isAnswered: false
      }
    }
  })),
  updateSectionTimer: (sectionIndex, timeLeft) => set((state) => ({
    sectionTimers: {
      ...state.sectionTimers,
      [sectionIndex]: {
        ...state.sectionTimers[sectionIndex],
        timeLeft
      }
    }
  })),
  toggleSectionTimer: (sectionIndex, isRunning) => set((state) => ({
    sectionTimers: {
      ...state.sectionTimers,
      [sectionIndex]: {
        ...state.sectionTimers[sectionIndex],
        isRunning
      }
    }
  })),
  isSubmitted: false,
  submitAssessment: () => set({ isSubmitted: true }),
  findNextAvailableSection: () => {
    const state = get()
    const { sectionTimers } = state
    
    // Find the next section that still has time remaining
    for (let i = 0; i < Object.keys(sectionTimers).length; i++) {
      if (sectionTimers[i]?.timeLeft > 0) {
        return i
      }
    }
    return null // No available sections
  },

  moveToNextAvailableSection: () => {
    const state = get()
    const nextSection = state.findNextAvailableSection()
    
    if (nextSection !== null) {
      const firstQuestion = state.assessment?.sections[nextSection].questions[0]
      if (firstQuestion) {
        state.setCurrentSection(nextSection)
        state.setCurrentQuestion(firstQuestion)
      }
    }
  }
}))

