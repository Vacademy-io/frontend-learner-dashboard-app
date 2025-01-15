// 'use client'

// import { useEffect, useState } from 'react'
// import { useAssessmentStore } from '@/stores/assessment-store'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Button } from '@/components/ui/button'

// interface AssessmentPreviewProps {
//   onPreviewComplete: () => void
// }

// export function AssessmentPreview({ onPreviewComplete }: AssessmentPreviewProps) {
//   const { assessment } = useAssessmentStore()
//   const [timeLeft, setTimeLeft] = useState(0)

//   useEffect(() => {
//     if (assessment?.assessmentPreview) {
//       const [minutes] = assessment.assessmentPreview.split(' ').map(Number)
//       setTimeLeft(minutes * 60)
//     }
//   }, [assessment])

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onPreviewComplete()
//       return
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1)
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [timeLeft, onPreviewComplete])

//   if (!assessment) return null

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="p-4 border-b bg-background sticky top-0 z-10">
//         <h1 className="text-2xl font-bold">{assessment.title} - Preview</h1>
//         <p className="text-muted-foreground">
//           Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
//         </p>
//       </div>
//       <ScrollArea className="flex-grow">
//         {assessment.sections.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="p-6 border-b">
//             <h2 className="text-xl font-semibold mb-4">Section {sectionIndex + 1}: {section.subject}</h2>
//             {section.questions.map((question, questionIndex) => (
//               <div key={question.questionId} className="mb-6 p-4 bg-background rounded-lg shadow">
//                 <h3 className="text-lg font-medium mb-2">
//                   Question {questionIndex + 1} ({question.questionMark} marks)
//                 </h3>
//                 <p className="mb-2">{question.questionName}</p>
//                 <div className="pl-4">
//                   {question.options.map((option) => (
//                     <p key={option.optionId} className="mb-1">• {option.optionName}</p>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </ScrollArea>
//       <div className="p-4 border-t bg-background sticky bottom-0">
//         <Button onClick={onPreviewComplete}>Start Test</Button>
//       </div>
//     </div>
//   )
// }



// 'use client'

// import { useEffect, useState } from 'react'
// import { useAssessmentStore } from '@/stores/assessment-store'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Button } from '@/components/ui/button'

// interface AssessmentPreviewProps {
//   onPreviewComplete: () => void
// }

// // Define types for the assessment object
// interface Assessment {
//   title: string
//   assessmentPreview: string // Preview time in format like "5 minutes"
//   sections: Section[]
// }

// interface Section {
//   subject: string
//   questions: Question[]
// }

// interface Question {
//   questionId: string
//   questionName: string
//   questionMark: number
//   options: Option[]
// }

// interface Option {
//   optionId: string
//   optionName: string
// }

// export function AssessmentPreview({ onPreviewComplete }: AssessmentPreviewProps) {
//   const { assessment } = useAssessmentStore<Assessment | null>() // Ensure assessment has correct type
//   const [timeLeft, setTimeLeft] = useState(0)

//   // Extract and set the initial timeLeft from the assessment preview
//   useEffect(() => {
//     if (assessment?.assessmentPreview) {
//       const [minutes] = assessment.assessmentPreview.split(' ').map(Number)
//       setTimeLeft(minutes * 60)
//     }
//   }, [assessment])

//   // Countdown timer effect
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onPreviewComplete()
//       return
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1)
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [timeLeft, onPreviewComplete])

//   if (!assessment) return null // Return null if assessment data is unavailable

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header Section */}
//       <div className="p-4 border-b bg-background sticky top-0 z-10">
//         <h1 className="text-2xl font-bold">{assessment.title} - Preview</h1>
//         <p className="text-muted-foreground">
//           Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
//         </p>
//       </div>

//       {/* Scrollable Content Area */}
//       <ScrollArea className="flex-grow">
//         {assessment.sections.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="p-6 border-b">
//             <h2 className="text-xl font-semibold mb-4">
//               Section {sectionIndex + 1}: {section.subject}
//             </h2>
//             {section.questions.map((question, questionIndex) => (
//               <div
//                 key={question.questionId}
//                 className="mb-6 p-4 bg-background rounded-lg shadow"
//               >
//                 <h3 className="text-lg font-medium mb-2">
//                   Question {questionIndex + 1} ({question.questionMark} marks)
//                 </h3>
//                 <p className="mb-2">{question.questionName}</p>
//                 <div className="pl-4">
//                   {question.options.map((option) => (
//                     <p key={option.optionId} className="mb-1">
//                       • {option.optionName}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </ScrollArea>

//       {/* Footer Section */}
//       <div className="p-4 border-t bg-background sticky bottom-0">
//         <Button onClick={onPreviewComplete}>Start Test</Button>
//       </div>
//     </div>
//   )
// }















'use client'

import { useState, useEffect } from 'react'
import { useAssessmentStore } from '@/stores/assessment-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRouter } from '@tanstack/react-router'

export function AssessmentPreview() {
  const { assessment } = useAssessmentStore()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("0")
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (assessment?.assessmentPreview) {
      const [minutes] = assessment.assessmentPreview.split(' ').map(Number)
      setTimeLeft(minutes * 60)
    }
  }, [assessment])

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push('/')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, router])

  if (!assessment) return null

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{assessment.title} - Preview</h1>
          <div className="text-lg font-mono">
            Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="w-full overflow-x-auto">
            {assessment.sections.map((section, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                Section {index + 1}: {section.subject}
              </TabsTrigger>
            ))}
          </TabsList>
          {assessment.sections.map((section, sectionIndex) => (
            <TabsContent key={sectionIndex} value={sectionIndex.toString()}>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{section.sectionDesc}</h2>
                  {section.questions.map((question, questionIndex) => (
                    <div key={question.questionId} className="mb-6 p-4 bg-background rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-2">
                        Question {questionIndex + 1} ({question.questionMark} marks)
                      </h3>
                      <p className="mb-2">{question.questionName}</p>
                      <div className="pl-4">
                        {question.options.map((option) => (
                          <p key={option.optionId} className="mb-1">• {option.optionName}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="p-4 border-t bg-background sticky bottom-0">
        <Button onClick={() => router.push('/')}>Start Test</Button>
      </div>
    </div>
  )
}

