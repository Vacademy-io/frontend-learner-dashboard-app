'use client'

import { cn } from '@/lib/utils'
import { useAssessmentStore } from '@/stores/assessment-store'




export function SectionTabs() {
  const { 
    assessment, 
    currentSection, 
    setCurrentSection,
    sectionTimers,
    setCurrentQuestion 
  } = useAssessmentStore()

  if (!assessment) return null

  const handleSectionChange = (index: number) => {
    // Prevent switching to sections that are timed out
    if (sectionTimers[index]?.timeLeft === 0) return
    
    setCurrentSection(index)
    // Set first question of new section as current
    const firstQuestion = assessment.sections[index].questions[0]
    setCurrentQuestion(firstQuestion)
  }

  return (
    <div className="flex gap-4 px-4 py-2 border-b">
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
              "px-4 py-2 text-sm relative",
              currentSection === index && "text-primary",
              currentSection === index && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary",
              isTimeUp && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2">
              <span>Section {index + 1}</span>
              <span className={cn(
                "text-muted-foreground",
                timer?.timeLeft < 60000 && !isTimeUp && "text-red-500"
              )}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

