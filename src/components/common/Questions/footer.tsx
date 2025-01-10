import { ChevronLeft, ChevronRight, PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAssessmentStore } from '@/stores/assessment-store'
import { cn } from '@/lib/utils'

// interface FooterProps {
//   isSidebarOpen: boolean
//   onToggleSidebar: () => void
// }

// export function Footer({ isSidebarOpen, onToggleSidebar }: FooterProps) {
//   const { assessment, currentQuestion, setCurrentQuestion } = useAssessmentStore()

//   if (!assessment) return null

//   const allQuestions = assessment.sections.flatMap(section => section.questions)
//   const currentIndex = allQuestions.findIndex(q => q.questionId === currentQuestion?.questionId)

//   const handlePrevQuestion = () => {
//     if (currentIndex > 0) {
//       setCurrentQuestion(allQuestions[currentIndex - 1])
//     }
//   }

//   const handleNextQuestion = () => {
//     if (currentIndex < allQuestions.length - 1) {
//       setCurrentQuestion(allQuestions[currentIndex + 1])
//     }
//   }

//   return (
//     <div className="sticky bottom-0 flex h-16 items-center justify-between border-t bg-background px-4">
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={onToggleSidebar}
//         className="relative"
//       >
//         <PanelLeft className={cn("h-4 w-4 transition-transform", isSidebarOpen && "rotate-180")} />
//       </Button>
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={handlePrevQuestion}
//           disabled={currentIndex <= 0}
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         <span className="min-w-[4rem] text-center">
//           {currentQuestion ? `${currentIndex + 1}/${allQuestions.length}` : '-'}
//         </span>
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={handleNextQuestion}
//           disabled={currentIndex === -1 || currentIndex >= allQuestions.length - 1}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   )
// }



interface FooterProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Footer({ isSidebarOpen, onToggleSidebar }: FooterProps) {
  const { 
    assessment, 
    currentQuestion, 
    currentSection,
    setCurrentQuestion,
    setCurrentSection,
    sectionTimers
  } = useAssessmentStore()

  if (!assessment) return null

  const currentSectionQuestions = assessment.sections[currentSection].questions
  const currentIndex = currentSectionQuestions.findIndex(q => q.questionId === currentQuestion?.questionId)
  const isTimeUp = sectionTimers[currentSection]?.timeLeft === 0

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentQuestion(currentSectionQuestions[currentIndex - 1])
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestion(currentSectionQuestions[currentIndex + 1])
    } else {
      // If this is the last question of the section, move to next section if available
      const nextSection = currentSection + 1
      if (nextSection < assessment.sections.length && !sectionTimers[nextSection]?.timeLeft === 0) {
        setCurrentSection(nextSection)
        setCurrentQuestion(assessment.sections[nextSection].questions[0])
      }
    }
  }

  return (
    <div className="sticky bottom-0 flex h-16 items-center justify-between border-t bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="relative"
        disabled={isTimeUp}
      >
        <PanelLeft className={cn("h-4 w-4 transition-transform", isSidebarOpen && "rotate-180")} />
      </Button>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevQuestion}
          disabled={currentIndex <= 0 || isTimeUp}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[4rem] text-center">
          {currentQuestion ? `${currentIndex + 1}/${currentSectionQuestions.length}` : '-'}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextQuestion}
          disabled={
            (currentIndex === currentSectionQuestions.length - 1 && 
             currentSection === assessment.sections.length - 1) || 
            isTimeUp
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

