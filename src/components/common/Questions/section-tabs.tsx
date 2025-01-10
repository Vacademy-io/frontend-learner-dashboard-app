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
        
        return (
          <button
            key={index}
            onClick={() => handleSectionChange(index)}
            className={cn(
              "px-4 py-2 text-sm relative",
              currentSection === index && "text-primary",
              currentSection === index && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <span>Section {index + 1}</span>
              <span className="text-muted-foreground">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

