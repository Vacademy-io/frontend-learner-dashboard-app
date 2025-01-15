'use client'

import { cn } from '@/lib/utils'
import { useAssessmentStore } from '@/stores/assessment-store'
import { Button } from '@/components/ui/button'

export function SectionTabs() {
  const { 
    assessment, 
    currentSection, 
    setCurrentSection,
    sectionTimers,
    setCurrentQuestion,
    moveToNextAvailableSection,
    updateSectionTimer
  } = useAssessmentStore()

  if (!assessment) return null

  const handleSectionChange = (index: number) => {
    if (sectionTimers[index]?.timeLeft === 0) return
    setCurrentSection(index)
    const firstQuestion = assessment.sections[index].questions[0]
    setCurrentQuestion(firstQuestion)
  }

  const handleEndSection = () => {
    const currentTimer = sectionTimers[currentSection];
    if (currentTimer) {
      updateSectionTimer(currentSection, 0);
      moveToNextAvailableSection();
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b">
      <div className="flex gap-4 overflow-x-auto">
        {assessment.sections.map((section, index) => {
          const timer = sectionTimers[index]
          const minutes = Math.floor(timer?.timeLeft / 60000)
          const seconds = Math.floor((timer?.timeLeft % 60000) / 1000)
          const isTimeUp = timer?.timeLeft === 0
          
          return (
            <button
              key={index}
              onClick={() => handleSectionChange(index)}
              disabled={isTimeUp}
              className={cn(
                "px-4 py-2 text-sm relative whitespace-nowrap",
                currentSection === index && "text-primary",
                currentSection === index && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary",
                isTimeUp && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <span>Section {index + 1}</span>
                {assessment.testDuration.sectionWiseDuration.checked && (
                  <span className={cn(
                    "text-muted-foreground",
                    timer?.timeLeft < 60000 && !isTimeUp && "text-red-500"
                  )}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
      {assessment.testDuration.sectionWiseDuration.checked && (
        <Button 
          variant="outline"
          onClick={handleEndSection}
          className="ml-4"
        >
          End Section
        </Button>
      )}
    </div>
  )
}

