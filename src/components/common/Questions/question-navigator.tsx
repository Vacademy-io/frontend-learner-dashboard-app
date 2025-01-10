'use client'

import * as React from 'react'
import { Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAssessmentStore } from '@/stores/assessment-store'
import { ViewToggle } from './view-toggle'
import { QuestionListView } from './question-list-view'






interface QuestionNavigatorProps {
  isOpen: boolean
}

export function QuestionNavigator({ isOpen }: QuestionNavigatorProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const { 
    assessment, 
    currentSection,
    currentQuestion, 
    questionStates, 
    setCurrentQuestion, 
    setQuestionState 
  } = useAssessmentStore()

  if (!assessment) return null

  const currentSectionQuestions = assessment.sections[currentSection].questions

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question)
    setQuestionState(question.questionId, { isVisited: true })
  }

  const getQuestionButtonClass = (state: QuestionState) => {
    if (state.isAnswered) return 'bg-green-100 hover:bg-green-200 text-green-700'
    if (!state.isVisited) return 'bg-white hover:bg-gray-100 text-gray-700'
    return 'bg-pink-100 hover:bg-pink-200 text-pink-700'
  }

  return (
    <div className={cn(
      "w-64 h-[calc(100vh-12rem)] bg-white border-r transition-all duration-300",
      !isOpen && "w-0 overflow-hidden"
    )}>
      <div className="p-4 border-b">
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {view === "grid" ? (
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-pink-100 rounded" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white border rounded" />
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className="w-3 h-3" />
                <span>Marked for review</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {currentSectionQuestions.map((question, index) => {
                const state = questionStates[question.questionId]
                const isActive = currentQuestion?.questionId === question.questionId
                return (
                  <div key={question.questionId} className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'w-full aspect-square text-sm font-medium p-0',
                        state && getQuestionButtonClass(state),
                        isActive && 'ring-2 ring-primary'
                      )}
                      onClick={() => handleQuestionClick(question)}
                    >
                      {index + 1}
                    </Button>
                    {state?.isMarkedForReview && (
                      <Flag className="absolute -top-1 -right-1 w-2 h-2 text-orange-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <QuestionListView />
      )}
    </div>
  )
}

