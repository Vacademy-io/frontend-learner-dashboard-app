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















// 'use client'

// import { useState, useEffect } from 'react'
// import { useAssessmentStore } from '@/stores/assessment-store'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
// import { Navigate, useRouter } from '@tanstack/react-router'
// import { useNavigate } from "@tanstack/react-router";


// export function AssessmentPreview() {
//   const { assessment } = useAssessmentStore()
//   const router = useRouter()
//   const [activeSection, setActiveSection] = useState("0")
//   const [timeLeft, setTimeLeft] = useState(0)
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (assessment?.assessmentPreview) {
//       const [minutes] = assessment.assessmentPreview.split(' ').map(Number)
//       setTimeLeft(minutes * 60)
//     }
//   }, [assessment])

//   // useEffect(() => {
//   //   if (timeLeft <= 0) {
//   //     navigate({ to: "/dashboard" });
//   //     return
//   //   }

//   //   const timer = setInterval(() => {
//   //     setTimeLeft((prev) => prev - 1)
//   //   }, 1000)

//   //   return () => clearInterval(timer)
//   // }, [timeLeft, router])

//   if (!assessment) return null

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="p-4 border-b bg-background sticky top-0 z-10">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-bold">{assessment.title} - Preview</h1>
//           <div className="text-lg font-mono">
//             Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
//           </div>
//         </div>
//         <Tabs value={activeSection} onValueChange={setActiveSection}>
//           <TabsList className="w-full overflow-x-auto">
//             {assessment.sections.map((section, index) => (
//               <TabsTrigger key={index} value={index.toString()}>
//                 Section {index + 1}: {section.subject}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//           {assessment.sections.map((section, sectionIndex) => (
//             <TabsContent key={sectionIndex} value={sectionIndex.toString()}>
//               <ScrollArea className="h-[calc(100vh-200px)]">
//                 <div className="p-6">
//                   <h2 className="text-xl font-semibold mb-4">{section.sectionDesc}</h2>
//                   {section.questions.map((question, questionIndex) => (
//                     <div key={question.questionId} className="mb-6 p-4 bg-background rounded-lg shadow">
//                       <h3 className="text-lg font-medium mb-2">
//                         Question {questionIndex + 1} ({question.questionMark} marks)
//                       </h3>
//                       <p className="mb-2">{question.questionName}</p>
//                       <div className="pl-4">
//                         {question.options.map((option) => (
//                           <p key={option.optionId} className="mb-1">• {option.optionName}</p>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>
//             </TabsContent>
//           ))}
//         </Tabs>
//       </div>
//       <div className="p-4 border-t bg-background sticky bottom-0">
//         <Button onClick={() => navigate({ to: "/dashboard" })}>Start Test</Button>
//       </div>
//     </div>
//   )
// }




// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useAssessmentStore } from '@/stores/assessment-store';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from "@tanstack/react-router";
// import { Navbar } from './navbar';
// import { SectionTabs } from './section-tabs';

// export function AssessmentPreview() {
//   const { assessment } = useAssessmentStore();
//   const [activeSection, setActiveSection] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (assessment?.assessmentPreview) {
//       const [minutes] = assessment.assessmentPreview.split(' ').map(Number);
//       setTimeLeft(minutes * 60);
//     }
//   }, [assessment]);

//   if (!assessment) return null;

//   return (
//     <div className="flex flex-col w-full bg-gray-50">
//       {/* Header with section tabs // replace this with the section-tabs component whithout timer functionality */}
//       <div className="sticky top-0 z-10 bg-white border-b">
//         <div className="flex flex-wrap items-center justify-between p-4">
//           <div className="flex flex-wrap items-center space-x-4">
//             {assessment.sections.map((section, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveSection(index)}
//                 className={`px-4 py-2 text-sm rounded-t-lg ${
//                   activeSection === index
//                     ? 'bg-orange-50 text-orange-500 border border-b-0 border-orange-500'
//                     : 'text-gray-600'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>Section {index + 1}</span>
//                   <span className="text-gray-500">{timeLeft > 0 && 
//                     `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
//                   }</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
      

//       {/* Main content */}
//       <ScrollArea className="flex-1 p-4 sm:p-6">
//         {assessment.sections[activeSection].questions.map((question, idx) => (
//           <div key={question.questionId} className="mb-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start gap-2 mb-4">
//               <span className="text-sm text-gray-500">Question {idx + 1}</span>
//               <span className="text-sm text-gray-500">{question.questionMark} Marks</span>
//             </div>
            
//             <p className="text-base mb-4">{question.questionName}</p>

//             {/* Question image if exists */}
//             {question.questionImage && (
//               <div className="mb-4">
//                 <img 
//                   src={question.questionImage} 
//                   alt="Question illustration"
//                   className="max-w-full rounded-lg"
//                 />
//               </div>
//             )}

//             {/* Answer options */}
//             <div className="space-y-3">
//               {question.options.map((option) => (
//                 <div 
//                   key={option.optionId}
//                   className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
//                 >
//                   {option.optionName}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </ScrollArea>

//       {/* Footer */}
//       <div className="sticky bottom-0 p-4 bg-white border-t">
//         <div className="flex justify-end">
//           <Button 
//             onClick={() => navigate({ to: "/assessment/examination/$assessmentId/LearnerLiveTest/" })}
//             className="bg-orange-500 hover:bg-orange-600 text-white"
//           >
//             Start Test
//           </Button>
//         </div>
//       </div>
//     </div>
//   );




  
//   return (
//     <div className="flex flex-col w-full bg-gray-50">
//       {/* Header with section tabs */}
//       <div className="sticky top-0 z-10 bg-white border-b">
//         <SectionTabs
//           sections={assessment.sections.map((_, i) => ({ name: `Section ${i + 1}` }))}
//           activeSection={activeSection}
//           onSectionChange={setActiveSection}
//           showTimer={true} // No timer functionality
//           canSwitchSections={true}
//         />
//       </div>
  
//       {/* Main content */}
//       <ScrollArea className="flex-1 p-4 sm:p-6">
//         {assessment.sections[activeSection].questions.map((question, idx) => (
//           <div key={question.questionId} className="mb-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start gap-2 mb-4">
//               <span className="text-sm text-gray-500">Question {idx + 1}</span>
//               <span className="text-sm text-gray-500">{question.questionMark} Marks</span>
//             </div>
  
//             <p className="text-base mb-4">{question.questionName}</p>
  
//             {/* Question image if exists */}
//             {question.questionImage && (
//               <div className="mb-4">
//                 <img
//                   src={question.questionImage}
//                   alt="Question illustration"
//                   className="max-w-full rounded-lg"
//                 />
//               </div>
//             )}
  
//             {/* Answer options */}
//             <div className="space-y-3">
//               {question.options.map((option) => (
//                 <div
//                   key={option.optionId}
//                   className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
//                 >
//                   {option.optionName}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </ScrollArea>
  
//       {/* Footer */}
//       <div className="sticky bottom-0 p-4 bg-white border-t">
//         <div className="flex justify-end">
//           <Button
//             onClick={() => navigate({ to: '/dashboard' })}
//             className="bg-orange-500 hover:bg-orange-600 text-white"
//           >
//             Start Test
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
  
// }
















// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useAssessmentStore } from '@/stores/assessment-store';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from "@tanstack/react-router";
// import { Navbar } from './navbar';
// import { SectionTabs } from './section-tabs';
// import { Clock } from 'lucide-react';

// export function AssessmentPreview() {
//   const { assessment } = useAssessmentStore();
//   const [activeSection, setActiveSection] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (assessment?.assessmentPreview) {
//       const [minutes] = assessment.assessmentPreview.split(' ').map(Number);
//       setTimeLeft(minutes * 60);
//     }
//   }, [assessment]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       navigate({ to: "/assessment/examination/$assessmentId/LearnerLiveTest/" });
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft(prev => Math.max(0, prev - 1));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, navigate]);

//   if (!assessment) return null;

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   return (
//     <div className="flex flex-col w-full bg-gray-50">
//       {/* Navbar with Timer */}
//       <div className="sticky top-0 z-20 bg-white border-b">
//         <div className="flex items-center justify-between p-4">
//           <h1 className="text-xl font-semibold">{assessment.title} - Preview</h1>
//           <div className="flex items-center gap-2 text-lg font-mono">
//             <Clock className="h-5 w-5" />
//             <span>{formatTime(timeLeft)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Section Tabs */}
//       <div className="sticky top-16 z-10 bg-white border-b">
//         <SectionTabs
//           sections={assessment.sections.map((_, i) => ({ name: `Section ${i + 1}` }))}
//           activeSection={activeSection}
//           onSectionChange={setActiveSection}
//           canSwitchSections={true}
//         />
//       </div>

//       {/* Main content */}
//       <ScrollArea className="flex-1 p-4 sm:p-6">
//         {assessment.sections[activeSection].questions.map((question, idx) => (
//           <div key={question.questionId} className="mb-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start gap-2 mb-4">
//               <span className="text-sm text-gray-500">Question {idx + 1}</span>
//               <span className="text-sm text-gray-500">{question.questionMark} Marks</span>
//             </div>
            
//             <p className="text-base mb-4">{question.questionName}</p>

//             {question.questionImage && (
//               <div className="mb-4">
//                 <img 
//                   src={question.questionImage} 
//                   alt="Question illustration"
//                   className="max-w-full rounded-lg"
//                 />
//               </div>
//             )}

//             <div className="space-y-3">
//               {question.options.map((option) => (
//                 <div 
//                   key={option.optionId}
//                   className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
//                 >
//                   {option.optionName}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </ScrollArea>

//       {/* Footer */}
//       <div className="sticky bottom-0 p-4 bg-white border-t">
//         <div className="flex justify-end">
//           <Button 
//             onClick={() => navigate({ to: "/assessment/examination/$assessmentId/LearnerLiveTest/" })}
//             className="bg-orange-500 hover:bg-orange-600 text-white"
//           >
//             Start Test
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }





'use client'

import React, { useState, useEffect } from 'react';
import { useAssessmentStore } from '@/stores/assessment-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNavigate } from "@tanstack/react-router";
import { Navbar } from './navbar';
import { SectionTabs } from './section-tabs';
import { Clock } from 'lucide-react';

export function AssessmentPreview() {
  const { assessment } = useAssessmentStore();
  const [activeSection, setActiveSection] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // Set initial time to 2 minutes (120 seconds)
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate({ to: "/assessment/examination/$assessmentId/LearnerLiveTest/" });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  if (!assessment) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full bg-gray-50">
      {/* Navbar with Timer */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">{assessment.title} - Preview</h1>
          <div className="flex items-center gap-2 text-lg font-mono">
            <Clock className="h-5 w-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="sticky top-16 z-10 bg-white border-b">
        <SectionTabs
          sections={assessment.sections.map((_, i) => ({ name: `Section ${i + 1}` }))}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          canSwitchSections={true}
        />
      </div>

      {/* Main content */}
      <ScrollArea className="flex-1 p-4 sm:p-6">
        {assessment.sections[activeSection].questions.map((question, idx) => (
          <div key={question.questionId} className="mb-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-2 mb-4">
              <span className="text-sm text-gray-500">Question {idx + 1}</span>
              <span className="text-sm text-gray-500">{question.questionMark} Marks</span>
            </div>
            
            <p className="text-base mb-4">{question.questionName}</p>

            {question.questionImage && (
              <div className="mb-4">
                <img 
                  src={question.questionImage} 
                  alt="Question illustration"
                  className="max-w-full rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3">
              {question.options.map((option) => (
                <div 
                  key={option.optionId}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  {option.optionName}
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t">
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate({ to: "/assessment/examination/$assessmentId/LearnerLiveTest/" })}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Start Test
          </Button>
        </div>
      </div>
    </div>
  );
}
