'use client'

import { cn } from '@/lib/utils'
import { useAssessmentStore } from '@/stores/assessment-store'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

// export function SectionTabs() {
//   const { 
//     assessment, 
//     currentSection, 
//     setCurrentSection,
//     sectionTimers,
//     setCurrentQuestion,
//     moveToNextAvailableSection,
//     updateSectionTimer
//   } = useAssessmentStore()

//   if (!assessment) return null

//   const handleSectionChange = (index: number) => {
//     if (sectionTimers[index]?.timeLeft === 0) return
//     setCurrentSection(index)
//     const firstQuestion = assessment.sections[index].questions[0]
//     setCurrentQuestion(firstQuestion)
//   }

//   const handleEndSection = () => {
//     const currentTimer = sectionTimers[currentSection];
//     if (currentTimer) {
//       updateSectionTimer(currentSection, 0);
//       moveToNextAvailableSection();
//     }
//   }

//   return (
//     <div className="flex items-center justify-between px-4 py-2 border-b">
//       <div className="flex gap-4 overflow-x-auto">
//         {assessment.sections.map((section, index) => {
//           const timer = sectionTimers[index]
//           const minutes = Math.floor(timer?.timeLeft / 60000)
//           const seconds = Math.floor((timer?.timeLeft % 60000) / 1000)
//           const isTimeUp = timer?.timeLeft === 0
          
//           return (
//             <button
//               key={index}
//               onClick={() => handleSectionChange(index)}
//               disabled={isTimeUp}
//               className={cn(
//                 "px-4 py-2 text-sm relative whitespace-nowrap",
//                 currentSection === index && "text-primary",
//                 currentSection === index && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary",
//                 isTimeUp && "opacity-50 cursor-not-allowed"
//               )}
//             >
//               <div className="flex items-center gap-2">
//                 <span>Section {index + 1}</span>
//                 {assessment.testDuration.sectionWiseDuration.checked && (
//                   <span className={cn(
//                     "text-muted-foreground",
//                     timer?.timeLeft < 60000 && !isTimeUp && "text-red-500"
//                   )}>
//                     {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
//                   </span>
//                 )}
//               </div>
//             </button>
//           )
//         })}
//       </div>
//       {assessment.testDuration.sectionWiseDuration.checked && (
//         <Button 
//           variant="outline"
//           onClick={handleEndSection}
//           className="ml-4"
//         >
//           End Section
//         </Button>
//       )}
//     </div>
//   )
// }





// export function SectionTabs() {
//   const { 
//     assessment, 
//     currentSection, 
//     setCurrentSection,
//     sectionTimers,
//     setCurrentQuestion,
//     updateSectionTimer,
//     moveToNextAvailableSection
//   } = useAssessmentStore()

//   useEffect(() => {
//     if (!assessment?.testDuration.sectionWiseDuration) return

//     const timer = setInterval(() => {
//       const currentTimer = sectionTimers[currentSection]
//       if (currentTimer && currentTimer.timeLeft > 0) {
//         updateSectionTimer(currentSection, currentTimer.timeLeft - 1000)
//       } else {
//         moveToNextAvailableSection()
//       }
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [assessment, currentSection, sectionTimers, updateSectionTimer, moveToNextAvailableSection])

//   if (!assessment) return null

//   const handleSectionChange = (index: number) => {
//     if (!assessment.canSwitchSections) return
    
//     if (sectionTimers[index]?.timeLeft === 0) return
    
//     setCurrentSection(index)
//     const firstQuestion = assessment.sections[index].questions[0]
//     setCurrentQuestion(firstQuestion)
//   }

//   const formatTime = (ms: number) => {
//     const minutes = Math.floor(ms / 60000)
//     const seconds = Math.floor((ms % 60000) / 1000)
//     return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
//   }

//   return (
//     <div className="flex gap-4 px-4 py-2 border-b">
//       {assessment.sections.map((section, index) => {
//         const timer = sectionTimers[index]
//         const isTimeUp = timer?.timeLeft === 0
        
//         return (
//           <div key={index} className="flex items-center">
//             <button
//               onClick={() => handleSectionChange(index)}
//               disabled={!assessment.canSwitchSections || isTimeUp}
//               className={cn(
//                 "px-4 py-2 text-sm relative",
//                 currentSection === index && "text-primary",
//                 currentSection === index && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary",
//                 (!assessment.canSwitchSections || isTimeUp) && "opacity-50 cursor-not-allowed"
//               )}
//             >
//               <div className="flex items-center gap-2">
//                 <span>Section {index + 1}</span>
//                 {assessment.testDuration.sectionWiseDuration && (
//                   <span className={cn(
//                     "text-muted-foreground",
//                     timer?.timeLeft < 60000 && !isTimeUp && "text-red-500"
//                   )}>
//                     {formatTime(timer?.timeLeft || 0)}
//                   </span>
//                 )}
//               </div>
//             </button>
//             {!assessment.canSwitchSections && currentSection === index && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={moveToNextAvailableSection}
//                 disabled={isTimeUp}
//                 className="ml-2"
//               >
//                 End Section
//               </Button>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }






export function SectionTabs() {
  const { 
    assessment, 
    currentSection, 
    setCurrentSection,
    sectionTimers,
    setCurrentQuestion,
    updateSectionTimer,
    moveToNextAvailableSection
  } = useAssessmentStore()

  useEffect(() => {
    if (!assessment?.testDuration.sectionWiseDuration) return

    const timer = setInterval(() => {
      const currentTimer = sectionTimers[currentSection]
      if (currentTimer && currentTimer.timeLeft > 0) {
        updateSectionTimer(currentSection, currentTimer.timeLeft - 1000)
      } else {
        moveToNextAvailableSection()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [assessment, currentSection, sectionTimers, updateSectionTimer, moveToNextAvailableSection])

  if (!assessment) return null

  const handleSectionChange = (index: number) => {
    if (!assessment.canSwitchSections) return
    
    if (sectionTimers[index]?.timeLeft === 0) return
    
    setCurrentSection(index)
    const firstQuestion = assessment.sections[index].questions[0]
    setCurrentQuestion(firstQuestion)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <div className="flex gap-4 px-4 py-2 border-b">
      {assessment.sections.map((section, index) => {
        const timer = sectionTimers[index]
        const isTimeUp = timer?.timeLeft === 0
        
        return (
          <div key={index} className="flex items-center">
            <button
              onClick={() => handleSectionChange(index)}
              disabled={!assessment.canSwitchSections || isTimeUp}
              className={cn(
                "px-4 py-2 text-sm relative",
                currentSection === index && "text-primary",
                currentSection === index && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary",
                (!assessment.canSwitchSections || isTimeUp) && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <span>Section {index + 1}</span>
                {assessment.testDuration.sectionWiseDuration && (
                  <span className={cn(
                    "text-muted-foreground",
                    timer?.timeLeft < 60000 && !isTimeUp && "text-red-500"
                  )}>
                    {formatTime(timer?.timeLeft || 0)}
                  </span>
                )}
              </div>
            </button>
            {!assessment.canSwitchSections && currentSection === index && (
              <Button
                variant="outline"
                size="sm"
                onClick={moveToNextAvailableSection}
                disabled={isTimeUp}
                className="ml-2"
              >
                End Section
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}

