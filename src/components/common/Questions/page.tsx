'use client'

import { useEffect, useState } from 'react'
import { QuestionNavigator } from '@/components/common/Questions/question-navigator'
import { QuestionDisplay } from '@/components/common/Questions/question-display'
import { SectionTabs } from '@/components/common/Questions/section-tabs'
import { Navbar } from '@/components/common/Questions/navbar'
import { Footer } from '@/components/common/Questions/footer'
import { useAssessmentStore } from '@/stores/assessment-store'

// // This would typically come from an API or database
// const dummyAssessment = {
//   assessmentId: "A001",
//   title: "The Human Eye and The Colourful World",
//   mode: "Online",
//   status: "Active",
//   startDate: "13/10/2024, 11:15 AM",
//   endDate: "15/10/2024, 08:30 PM",
//   assessmentDuration: "20:00",
//   subject: "Physics",
//   assessmentInstruction: `1. Attempt All Questions: Answer all questions. Ensure accuracy and completeness in each response.`,
//   assessmentPreview: "5 min",
//   canSwitchSections: true,
//   sections: [
//     {
//       assesmentDuration: "0:09",
//       subject: "Biology",
//       sectionDesc: "Challenge your understanding of the chapter 'Human Eye'",
//       sectionDuration: "NA",
//       negativeMarking: {
//         checked: true,
//         value: "1",
//       },
//       partialMarking: true,
//       cutoffMarking: {
//         checked: true,
//         value: "08",
//       },
//       totalMark: "20",
//       questions: Array.from({ length: 10 }, (_, i) => ({
//         questionType: "Multiple Choice",
//         questionId: `Q${String(i + 1).padStart(3, '0')}`,
//         questionName: `Question ${i + 1}`,
//         questionMark: "2",
//         imageDetails: [],
//         options: Array.from({ length: 4 }, (_, j) => ({
//           optionId: `O${String(j + 1).padStart(3, '0')}`,
//           optionName: `Option ${j + 1}`,
//         })),
//       })),
//     },
//     {
//       assesmentDuration: "10:00",
//       subject: "Physics",
//       sectionDesc: "Explore the fascinating topics of the colorful world",
//       sectionDuration: "NA",
//       negativeMarking: {
//         checked: true,
//         value: "1",
//       },
//       partialMarking: true,
//       cutoffMarking: {
//         checked: true,
//         value: "08",
//       },
//       totalMark: "20",
//       questions: Array.from({ length: 10 }, (_, i) => ({
//         questionType: "Multiple Choice",
//         questionId: `Q${String(i + 11).padStart(3, '0')}`,
//         questionName: `Question ${i + 11}`,
//         questionMark: "2",
//         imageDetails: [],
//         options: Array.from({ length: 4 }, (_, j) => ({
//           optionId: `O${String(j + 1).padStart(3, '0')}`,
//           optionName: `Option ${j + 1}`,
//         })),
//       })),
//     },
//     {
//       assesmentDuration: "10:00",
//       subject: "Physics",
//       sectionDesc: "Explore the fascinating topics of the colorful world",
//       sectionDuration: "NA",
//       negativeMarking: {
//         checked: true,
//         value: "1",
//       },
//       partialMarking: true,
//       cutoffMarking: {
//         checked: true,
//         value: "08",
//       },
//       totalMark: "20",
//       questions: Array.from({ length: 10 }, (_, i) => ({
//         questionType: "Multiple Choice",
//         questionId: `Q${String(i + 11).padStart(3, '0')}`,
//         questionName: `Question ${i + 11}`,
//         questionMark: "2",
//         imageDetails: [],
//         options: Array.from({ length: 4 }, (_, j) => ({
//           optionId: `O${String(j + 1).padStart(3, '0')}`,
//           optionName: `Option ${j + 1}`,
//         })),
//       })),
//     },
//   ],
// }

// export default function Page() {
//   const { setAssessment } = useAssessmentStore()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)

//   useEffect(() => {
//     setAssessment(dummyAssessment)
//   }, [setAssessment])

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       <Navbar />
//       <SectionTabs />
//       <div className="flex flex-1 overflow-hidden">
//         <QuestionNavigator isOpen={isSidebarOpen} />
//         <div className="flex-1 p-4 overflow-auto">
//           <QuestionDisplay />
//         </div>
//       </div>
//       <Footer 
//         isSidebarOpen={isSidebarOpen}
//         onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//       />
//     </div>
//   )
// }


// This would typically come from an API or database
const dummyAssessment = {
  assessmentId: "A001",
  title: "The Human Eye and The Colourful World",
  mode: "Online",
  status: "Active",
  startDate: "13/10/2024, 11:15 AM",
  endDate: "15/10/2024, 08:30 PM",
  assessmentDuration: "20:00",
  subject: "Physics",
  assessmentInstruction: `1. Attempt All Questions: Answer all questions. Ensure accuracy and completeness in each response.`,
  assessmentPreview: "5 min",
  canSwitchSections: true,
  sections: [
    {
      assesmentDuration: "0:09",
      subject: "Biology",
      sectionDesc: "Challenge your understanding of the chapter 'Human Eye'",
      sectionDuration: "NA",
      negativeMarking: {
        checked: true,
        value: "1",
      },
      partialMarking: true,
      cutoffMarking: {
        checked: true,
        value: "08",
      },
      totalMark: "20",
      questions: [
          {
            questionType: "Multiple Choice",
            questionId: "Q001",
            questionName: "What is the primary function of the human eye?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "To detect sound" },
              { optionId: "O002", optionName: "To detect light" },
              { optionId: "O003", optionName: "To pump blood" },
              { optionId: "O004", optionName: "To support breathing" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q002",
            questionName:
              "Which part of the eye controls the amount of light entering it?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Cornea" },
              { optionId: "O002", optionName: "Iris" },
              { optionId: "O003", optionName: "Lens" },
              { optionId: "O004", optionName: "Retina" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q003",
            questionName: "What is the function of the cornea?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Focus light" },
              { optionId: "O002", optionName: "Block dust particles" },
              { optionId: "O003", optionName: "Protect the eye from UV light" },
              { optionId: "O004", optionName: "Support the lens" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q004",
            questionName:
              "Which eye defect is caused by the elongation of the eyeball?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Hypermetropia" },
              { optionId: "O002", optionName: "Myopia" },
              { optionId: "O003", optionName: "Astigmatism" },
              { optionId: "O004", optionName: "Presbyopia" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q005",
            questionName:
              "Which structure in the eye focuses light onto the retina?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Lens" },
              { optionId: "O002", optionName: "Cornea" },
              { optionId: "O003", optionName: "Retina" },
              { optionId: "O004", optionName: "Pupil" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q006",
            questionName: "Which of these is a common cause of cataracts?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "High blood pressure" },
              { optionId: "O002", optionName: "Diabetes" },
              { optionId: "O003", optionName: "Aging" },
              { optionId: "O004", optionName: "Lack of sleep" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q007",
            questionName:
              "Which part of the eye is responsible for detecting color?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Lens" },
              { optionId: "O002", optionName: "Retina" },
              { optionId: "O003", optionName: "Pupil" },
              { optionId: "O004", optionName: "Iris" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q008",
            questionName: "What is the effect of hypermetropia?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Inability to see far objects" },
              {
                optionId: "O002",
                optionName: "Inability to see nearby objects",
              },
              {
                optionId: "O003",
                optionName: "Blurred vision at all distances",
              },
              { optionId: "O004", optionName: "Complete blindness" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q009",
            questionName: "What does the retina contain?",
            questionMark: "2",
            imageDetails: [],
            options: [
              { optionId: "O001", optionName: "Photoreceptor cells" },
              { optionId: "O002", optionName: "Ciliary muscles" },
              { optionId: "O003", optionName: "Optic nerves" },
              { optionId: "O004", optionName: "Corneal cells" },
            ],
          },
          {
            questionType: "Multiple Choice",
            questionId: "Q010",
            questionName: "What is the role of the pupil?",
            questionMark: "2",
            imageDetails: [],
            options: [
              {
                optionId: "O001",
                optionName: "Regulate the amount of light entering the eye",
              },
              { optionId: "O002", optionName: "Focus light onto the retina" },
              { optionId: "O003", optionName: "Detect colors" },
              { optionId: "O004", optionName: "Control eye movement" },
            ],
          },
        ],
    },
    {
      assesmentDuration: "10:00",
      subject: "Physics",
      sectionDesc: "Explore the fascinating topics of the colorful world",
      sectionDuration: "NA",
      negativeMarking: {
        checked: true,
        value: "1",
      },
      partialMarking: true,
      cutoffMarking: {
        checked: true,
        value: "08",
      },
      totalMark: "20",
      questions: [
        {
          questionType: "Multiple Choice",
          questionId: "Q011",
          questionName: "What is the speed of light in a vacuum?",
          questionMark: "2",
          imageDetails: [],
          options: [
            { optionId: "O001", optionName: "300,000 km/s" },
            { optionId: "O002", optionName: "150,000 km/s" },
            { optionId: "O003", optionName: "450,000 km/s" },
            { optionId: "O004", optionName: "500,000 km/s" },
          ],
        }
      ],
    },
  ],
}

export default function Page() {
  const { setAssessment } = useAssessmentStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    setAssessment(dummyAssessment)
  }, [setAssessment])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <SectionTabs />
      <div className="flex flex-1 overflow-hidden">
        <QuestionNavigator isOpen={isSidebarOpen} />
        <div className="flex-1 p-4 overflow-auto">
          <QuestionDisplay />
        </div>
      </div>
      <Footer 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  )
}

