// import React from 'react';
// import { create } from 'zustand';
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

// // Store types
// interface QuestionState {
//   answered: boolean;
//   markedForReview: boolean;
//   visited: boolean;
// }

// interface AssessmentStore {
//   currentQuestion: number;
//   currentSection: number;
//   questionStates: { [key: string]: QuestionState };
//   setCurrentQuestion: (questionId: string) => void;
//   setCurrentSection: (section: number) => void;
//   markQuestion: (questionId: string, state: Partial<QuestionState>) => void;
// }

// const useAssessmentStore = create<AssessmentStore>((set) => ({
//   currentQuestion: 0,
//   currentSection: 0,
//   questionStates: {},
//   setCurrentQuestion: (questionId) => set({ currentQuestion: Number(questionId) }),
//   setCurrentSection: (section) => set({ currentSection: section }),
//   markQuestion: (questionId, state) =>
//     set((prev) => ({
//       questionStates: {
//         ...prev.questionStates,
//         [questionId]: {
//           ...prev.questionStates[questionId],
//           ...state,
//         },
//       },
//     })),
// }));

// const QuestionNavigation = ({ assessment }) => {
//   const {
//     currentSection,
//     currentQuestion,
//     questionStates,
//     setCurrentQuestion,
//     setCurrentSection,
//   } = useAssessmentStore();

//   const getQuestionStyle = (questionId: string) => {
//     const state = questionStates[questionId] || {
//       answered: false,
//       markedForReview: false,
//       visited: false,
//     };

//     const baseStyle = "w-full h-full";

//     if (state.answered && state.markedForReview) {
//       return `${baseStyle} bg-green-100 text-green-700`;
//     } else if (state.answered) {
//       return `${baseStyle} bg-green-100 text-green-700`;
//     } else if (state.markedForReview) {
//       return `${baseStyle} bg-rose-50 text-rose-500`;
//     }
//     return `${baseStyle} bg-gray-50 hover:bg-gray-100`;
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <div className="flex gap-2">
//         {assessment.sections.map((section, index) => (
//           <Button
//             key={index}
//             variant={currentSection === index ? "default" : "outline"}
//             onClick={() => setCurrentSection(index)}
//             className="flex-1"
//           >
//             {section.subject}
//           </Button>
//         ))}
//       </div>

//       <div className="space-y-2">
//         <h3 className="text-sm font-medium">Legend:</h3>
//         <div className="space-y-1 text-sm">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="bg-green-100">1</Badge>
//             <span>Answered</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="bg-rose-50">1</Badge>
//             <span>Not Answered</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline">1</Badge>
//             <span>Not Visited</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="bg-rose-50 relative">
//               1
//               <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//             </Badge>
//             <span>Marked for review</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {assessment.sections.map((section, sectionIndex) => (
//           <div
//             key={sectionIndex}
//             className={`${currentSection === sectionIndex ? "block" : "hidden"}`}
//           >
//             <h3 className="font-medium mb-2">{section.subject}</h3>
//             <div className="grid grid-cols-5 gap-2">
//               {section.questions.map((question) => (
//                 <Button
//                   key={question.questionId}
//                   variant="outline"
//                   className={getQuestionStyle(question.questionId)}
//                   onClick={() => setCurrentQuestion(question.questionId)}
//                 >
//                   {question.questionId.replace('Q', '')}
//                   {questionStates[question.questionId]?.markedForReview && (
//                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//                   )}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AssessmentFooter = ({ assessment }) => {
//   const { currentQuestion, currentSection } = useAssessmentStore();
//   const currentSectionQuestions = assessment.sections[currentSection].questions;
//   const currentQuestionIndex = currentSectionQuestions.findIndex(
//     q => q.questionId === currentQuestion.toString()
//   );

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       useAssessmentStore.getState().setCurrentQuestion(
//         currentSectionQuestions[currentQuestionIndex - 1].questionId
//       );
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < currentSectionQuestions.length - 1) {
//       useAssessmentStore.getState().setCurrentQuestion(
//         currentSectionQuestions[currentQuestionIndex + 1].questionId
//       );
//     }
//   };

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
//       <div className="max-w-screen-xl mx-auto flex justify-between items-center">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={handlePrevious}
//           disabled={currentQuestionIndex === 0}
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>

//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Menu className="h-4 w-4" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-80">
//             <QuestionNavigation assessment={assessment} />
//           </SheetContent>
//         </Sheet>

//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={handleNext}
//           disabled={currentQuestionIndex === currentSectionQuestions.length - 1}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default function Assessment() {
//   const assessment = {
//     assessmentId: "A001",
//     title: "The Human Eye and The Colourful World",
//     sections: [
//       {
//         subject: "Biology",
//         questions: Array.from({ length: 10 }, (_, i) => ({
//           questionId: `Q00${i + 1}`,
//           questionType: "Multiple Choice",
//           questionName: `Question ${i + 1}`,
//         })),
//       },
//       {
//         subject: "Physics",
//         questions: [{
//           questionId: "Q011",
//           questionType: "Multiple Choice",
//           questionName: "Question 11",
//         }],
//       },
//     ],
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 pb-16">
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
//         <QuestionNavigation assessment={assessment} />
//       </div>
//       <AssessmentFooter assessment={assessment} />
//     </div>
//   );
// }





 
  