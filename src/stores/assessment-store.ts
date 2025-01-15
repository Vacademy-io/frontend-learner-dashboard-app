// import { create } from 'zustand'
// import { Assessment, Question, QuestionState } from '../types/assessment'

// interface SectionTimer {
//   timeLeft: number
//   isRunning: boolean
// }

// interface AssessmentStore {
//   assessment: Assessment | null
//   currentSection: number
//   currentQuestion: Question | null
//   questionStates: Record<string, QuestionState>
//   answers: Record<string, string>
//   sectionTimers: Record<number, SectionTimer>
//   setAssessment: (assessment: Assessment) => void
//   setCurrentSection: (sectionIndex: number) => void
//   setCurrentQuestion: (question: Question) => void
//   setQuestionState: (questionId: string, state: Partial<QuestionState>) => void
//   setAnswer: (questionId: string, answerId: string | null) => void
//   markForReview: (questionId: string) => void
//   clearResponse: (questionId: string) => void
//   updateSectionTimer: (sectionIndex: number, timeLeft: number) => void
//   toggleSectionTimer: (sectionIndex: number, isRunning: boolean) => void
//   isSubmitted: boolean
//   submitAssessment: () => void
//   findNextAvailableSection: () => number | null
//   moveToNextAvailableSection: () => void
// }

// export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
//   assessment: null,
//   currentSection: 0,
//   currentQuestion: null,
//   questionStates: {},
//   answers: {},
//   sectionTimers: {},
//   setAssessment: (assessment) => set((state) => {
//     const questionStates: Record<string, QuestionState> = {}
//     const sectionTimers: Record<number, SectionTimer> = {}
    
//     assessment.sections.forEach((section, index) => {
//       const [minutes, seconds] = section.assesmentDuration.split(':').map(Number)
//       sectionTimers[index] = {
//         timeLeft: (minutes * 60 + seconds) * 1000,
//         isRunning: index === 0
//       }
      
//       // Check if questions is an array, if not, convert it to an array
//       const questions = Array.isArray(section.questions) ? section.questions : [section.questions]
//       questions.forEach(question => {
//         questionStates[question.questionId] = {
//           isAnswered: false,
//           isVisited: false,
//           isMarkedForReview: false
//         }
//       })
//     })
    
//     return { assessment, questionStates, sectionTimers }
//   }),
//   setCurrentSection: (sectionIndex) => set((state) => {
//     // Pause current section timer and start new section timer
//     const updatedTimers = { ...state.sectionTimers }
//     Object.keys(updatedTimers).forEach(key => {
//       updatedTimers[Number(key)].isRunning = Number(key) === sectionIndex
//     })
//     return { currentSection: sectionIndex, sectionTimers: updatedTimers }
//   }),
//   setCurrentQuestion: (question) => set((state) => ({
//     currentQuestion: question,
//     questionStates: {
//       ...state.questionStates,
//       [question.questionId]: {
//         ...state.questionStates[question.questionId],
//         isVisited: true
//       }
//     }
//   })),
//   setQuestionState: (questionId, state) => set((prevState) => ({
//     questionStates: {
//       ...prevState.questionStates,
//       [questionId]: { ...prevState.questionStates[questionId], ...state }
//     }
//   })),
//   setAnswer: (questionId, answerId) => set((state) => ({
//     answers: answerId ? { ...state.answers, [questionId]: answerId } : 
//       Object.fromEntries(Object.entries(state.answers).filter(([key]) => key !== questionId)),
//     questionStates: {
//       ...state.questionStates,
//       [questionId]: { 
//         ...state.questionStates[questionId], 
//         isAnswered: Boolean(answerId)
//       }
//     }
//   })),
//   markForReview: (questionId) => set((state) => ({
//     questionStates: {
//       ...state.questionStates,
//       [questionId]: {
//         ...state.questionStates[questionId],
//         isMarkedForReview: !state.questionStates[questionId].isMarkedForReview
//       }
//     }
//   })),
//   clearResponse: (questionId) => set((state) => ({
//     answers: Object.fromEntries(Object.entries(state.answers).filter(([key]) => key !== questionId)),
//     questionStates: {
//       ...state.questionStates,
//       [questionId]: {
//         ...state.questionStates[questionId],
//         isAnswered: false
//       }
//     }
//   })),
//   updateSectionTimer: (sectionIndex, timeLeft) => set((state) => ({
//     sectionTimers: {
//       ...state.sectionTimers,
//       [sectionIndex]: {
//         ...state.sectionTimers[sectionIndex],
//         timeLeft
//       }
//     }
//   })),
//   toggleSectionTimer: (sectionIndex, isRunning) => set((state) => ({
//     sectionTimers: {
//       ...state.sectionTimers,
//       [sectionIndex]: {
//         ...state.sectionTimers[sectionIndex],
//         isRunning
//       }
//     }
//   })),
//   isSubmitted: false,
//   submitAssessment: () => set({ isSubmitted: true }),
//   findNextAvailableSection: () => {
//     const state = get()
//     const { sectionTimers } = state
    
//     // Find the next section that still has time remaining
//     for (let i = 0; i < Object.keys(sectionTimers).length; i++) {
//       if (sectionTimers[i]?.timeLeft > 0) {
//         return i
//       }
//     }
//     return null // No available sections
//   },

//   moveToNextAvailableSection: () => {
//     const state = get()
//     const nextSection = state.findNextAvailableSection()
    
//     if (nextSection !== null) {
//       const firstQuestion = state.assessment?.sections[nextSection].questions[0]
//       if (firstQuestion) {
//         state.setCurrentSection(nextSection)
//         state.setCurrentQuestion(firstQuestion)
//       }
//     }
//   }
// }))




import { create } from 'zustand'
import { Assessment, Question, QuestionState, TestResponse, TestDuration } from '../types/assessment'
// import { saveData, getData } from '../utils/network'
import { toast } from '@/components/ui/use-toast'
import { App } from '@capacitor/app'
import { saveResponse, saveTestDuration, getTestDuration } from '@/routes/assessment/examination/-utils.ts/capacitor'
import { saveData, getData } from '@/routes/assessment/examination/-utils.ts/network'
import { saveResponse, saveTestDuration, getTestDuration } from '@/routes/assessment/examination/-utils.ts/capacitor'

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
  questionTimers: Record<string, number>
  responses: Record<string, TestResponse>
  testEndTime: number | null
  testDuration: {
    entireTestDurationLeft: string,
    sectionWiseDurationLeft: string,
    questionWiseDurationLeft: string
  } | null
  setAssessment: (assessment: Assessment) => void
  setCurrentSection: (sectionIndex: number) => void
  setCurrentQuestion: (question: Question) => void
  setQuestionState: (questionId: string, state: Partial<QuestionState>) => void
  setAnswer: (questionId: string, answerId: string | null) => void
  markForReview: (questionId: string) => void
  clearResponse: (questionId: string) => void
  updateSectionTimer: (sectionIndex: number, timeLeft: number) => void
  toggleSectionTimer: (sectionIndex: number, isRunning: boolean) => void
  setQuestionTimer: (questionId: string, timeLeft: number) => void
  updateTimeTaken: (questionId: string) => void
  setTestEndTime: (endTime: number) => void
  isSubmitted: boolean
  submitAssessment: () => void
  findNextAvailableSection: () => number | null
  moveToNextAvailableSection: () => void
  loadStoredData: () => Promise<void>
  updateTestDuration: (duration: {
    entireTestDurationLeft: string,
    sectionWiseDurationLeft: string,
    questionWiseDurationLeft: string
  }) => void
  loadTestDuration: () => Promise<void>
}

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  assessment: null,
  currentSection: 0,
  currentQuestion: null,
  questionStates: {},
  answers: {},
  sectionTimers: {},
  questionTimers: {},
  responses: {},
  testEndTime: null,
  testDuration: null,
  setAssessment: (assessment) => set((state) => {
    const questionStates: Record<string, QuestionState> = {}
    const sectionTimers: Record<number, SectionTimer> = {}
    const questionTimers: Record<string, number> = {}
    
    assessment.sections.forEach((section, index) => {
      if (assessment.testDuration.sectionWiseDuration.checked) {
        const [minutes, seconds] = section.sectionDuration.split(':').map(Number)
        sectionTimers[index] = {
          timeLeft: (minutes * 60 + seconds) * 1000,
          isRunning: index === 0
        }
      }
      
      section.questions.forEach(question => {
        questionStates[question.questionId] = {
          isAnswered: false,
          isVisited: false,
          isMarkedForReview: false,
          timeTaken: 0
        }
        if (assessment.testDuration.questionWiseDuration.checked) {
          // Set a default timer for each question (e.g., 5 minutes)
          questionTimers[question.questionId] = 5 * 60
        }
      })
    })
    
    let testEndTime = null
    if (assessment.testDuration.entireTestDuration) {
      const [hours, minutes] = assessment.testDuration.entireTestDuration.split(':').map(Number)
      const durationInMs = (hours * 3600 + minutes * 60) * 1000
      testEndTime = Date.now() + durationInMs
    }
    
    saveData('assessment', assessment)
    saveData('questionStates', questionStates)
    saveData('sectionTimers', sectionTimers)
    saveData('questionTimers', questionTimers)
    saveData('testEndTime', testEndTime)
    
    return { assessment, questionStates, sectionTimers, questionTimers, testEndTime }
  }),
  setCurrentSection: (sectionIndex) => set((state) => {
    const updatedTimers = { ...state.sectionTimers }
    if (state.assessment?.testDuration.sectionWiseDuration.checked) {
      Object.keys(updatedTimers).forEach(key => {
        updatedTimers[Number(key)].isRunning = Number(key) === sectionIndex
      })
    }
    saveData('sectionTimers', updatedTimers)
    saveData('currentSection', sectionIndex)
    return { currentSection: sectionIndex, sectionTimers: updatedTimers }
  }),
  setCurrentQuestion: (question) => set((state) => {
    const updatedStates = {
      ...state.questionStates,
      [question.questionId]: {
        ...state.questionStates[question.questionId],
        isVisited: true
      }
    }
    saveData('questionStates', updatedStates)
    saveData('currentQuestion', question)
    return { currentQuestion: question, questionStates: updatedStates }
  }),
  setQuestionState: (questionId, state) => set((prevState) => {
    const updatedStates = {
      ...prevState.questionStates,
      [questionId]: { ...prevState.questionStates[questionId], ...state }
    }
    saveData('questionStates', updatedStates)
    return { questionStates: updatedStates }
  }),
  setAnswer: (questionId, answerId) => set((state) => {
    const question = state.assessment?.sections
      .flatMap(section => section.questions)
      .find(q => q.questionId === questionId)

    if (!question) return state

    const updatedResponses = {
      ...state.responses,
      [questionId]: { 
        ...state.responses[questionId],
        questionId,
        answerId: answerId ? [answerId] : [],
        timeTaken: state.responses[questionId]?.timeTaken || 0
      }
    }
    const updatedStates = {
      ...state.questionStates,
      [questionId]: { 
        ...state.questionStates[questionId], 
        isAnswered: Boolean(answerId)
      }
    }
    
    saveResponse(questionId, answerId ? [answerId] : [], question.questionType)
    
    return { responses: updatedResponses, questionStates: updatedStates }
  }),
  markForReview: (questionId) => set((state) => {
    const updatedStates = {
      ...state.questionStates,
      [questionId]: {
        ...state.questionStates[questionId],
        isMarkedForReview: !state.questionStates[questionId].isMarkedForReview
      }
    }
    saveData('questionStates', updatedStates)
    return { questionStates: updatedStates }
  }),
  clearResponse: (questionId) => set((state) => {
    const { [questionId]: _, ...updatedResponses } = state.responses
    const updatedStates = {
      ...state.questionStates,
      [questionId]: {
        ...state.questionStates[questionId],
        isAnswered: false
      }
    }
    saveData('responses', updatedResponses)
    saveData('questionStates', updatedStates)
    return { responses: updatedResponses, questionStates: updatedStates }
  }),
  updateSectionTimer: (sectionIndex, timeLeft) => set((state) => {
    if (!state.assessment?.testDuration.sectionWiseDuration.checked) return state
    const updatedTimers = {
      ...state.sectionTimers,
      [sectionIndex]: {
        ...state.sectionTimers[sectionIndex],
        timeLeft
      }
    }
    saveData('sectionTimers', updatedTimers)
    return { sectionTimers: updatedTimers }
  }),
  toggleSectionTimer: (sectionIndex, isRunning) => set((state) => {
    if (!state.assessment?.testDuration.sectionWiseDuration.checked) return state
    const updatedTimers = {
      ...state.sectionTimers,
      [sectionIndex]: {
        ...state.sectionTimers[sectionIndex],
        isRunning
      }
    }
    saveData('sectionTimers', updatedTimers)
    return { sectionTimers: updatedTimers }
  }),
  setQuestionTimer: (questionId, timeLeft) => set((state) => {
    if (!state.assessment?.testDuration.questionWiseDuration.checked) return state
    const updatedTimers = { ...state.questionTimers, [questionId]: timeLeft }
    saveData('questionTimers', updatedTimers)
    return { questionTimers: updatedTimers }
  }),
  updateTimeTaken: (questionId) => set((state) => {
    if (!state.assessment?.testDuration.questionWiseDuration.checked) return state
    const timeTaken = state.responses[questionId]?.timeTaken || 0
    const newTimeTaken = timeTaken + 1
    const updatedResponses = {
      ...state.responses,
      [questionId]: { ...state.responses[questionId], timeTaken: newTimeTaken }
    }
    saveData('responses', updatedResponses)
    return { responses: updatedResponses }
  }),
  setTestEndTime: (endTime) => set({ testEndTime: endTime }),
  isSubmitted: false,
  submitAssessment: () => {
    set({ isSubmitted: true })
    saveData('responses', null)
    saveData('questionStates', null)
    saveData('sectionTimers', null)
    saveData('questionTimers', null)
    saveData('testEndTime', null)
  },
  findNextAvailableSection: () => {
    const state = get()
    const { sectionTimers } = state
    
    for (let i = 0; i < Object.keys(sectionTimers).length; i++) {
      if (sectionTimers[i]?.timeLeft > 0) {
        return i
      }
    }
    return null
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
  },
  loadStoredData: async () => {
    const assessment = await getData('assessment')
    const questionStates = await getData('questionStates')
    const responses = await getData('responses')
    const sectionTimers = await getData('sectionTimers')
    const questionTimers = await getData('questionTimers')
    const currentSection = await getData('currentSection')
    const currentQuestion = await getData('currentQuestion')
    const testEndTime = await getData('testEndTime')

    set({
      assessment: assessment || null,
      questionStates: questionStates || {},
      responses: responses || {},
      sectionTimers: sectionTimers || {},
      questionTimers: questionTimers || {},
      currentSection: currentSection || 0,
      currentQuestion: currentQuestion || null,
      testEndTime: testEndTime || null
    })
  },
  updateTestDuration: (duration) => {
    saveTestDuration(duration)
    set({ testDuration: duration })
  },
  loadTestDuration: async () => {
    const duration = await getTestDuration()
    if (duration) {
      set({ testDuration: duration })
    }
  }
}))

// Initialize back button handler for mobile
if (typeof window !== 'undefined') {
  App.addListener('backButton', () => {
    if (!useAssessmentStore.getState().isSubmitted) {
      const confirmSubmit = window.confirm('Are you sure you want to submit the test?')
      if (confirmSubmit) {
        useAssessmentStore.getState().submitAssessment()
      }
    }
  })
}

