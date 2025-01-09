

// import React from 'react';
// import { create } from 'zustand';
// import { useQuery } from '@tanstack/react-query';
// import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

// // Types
// interface Question {
//   id: number;
//   text: string;
//   options: { id: string; text: string }[];
// }

// interface QuestionState {
//   answered: boolean;
//   markedForReview: boolean;
//   visited: boolean;
// }

// // Zustand Store
// interface AssessmentStore {
//   currentQuestion: number;
//   currentSection: number;
//   isSidebarOpen: boolean;
//   questionStates: { [key: number]: QuestionState };
//   setCurrentQuestion: (questionNumber: number) => void;
//   setCurrentSection: (section: number) => void;
//   toggleSidebar: () => void;
//   markQuestion: (questionNumber: number, state: Partial<QuestionState>) => void;
// }

// const useAssessmentStore = create<AssessmentStore>((set) => ({
//   currentQuestion: 1,
//   currentSection: 0,
//   isSidebarOpen: true,
//   questionStates: {},
//   setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
//   setCurrentSection: (section) => set({ currentSection: section }),
//   toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
//   markQuestion: (questionNumber, state) =>
//     set((prev) => ({
//       questionStates: {
//         ...prev.questionStates,
//         [questionNumber]: {
//           ...prev.questionStates[questionNumber],
//           ...state,
//         },
//       },
//     })),
// }));

// // Question Navigation Component
// const QuestionNavigation: React.FC = () => {
//   const {
//     currentQuestion,
//     currentSection,
//     questionStates,
//     setCurrentQuestion,
//     setCurrentSection,
//     markQuestion,
//   } = useAssessmentStore();

//   const getQuestionStyle = (questionNumber: number) => {
//     const state = questionStates[questionNumber] || {
//       answered: false,
//       markedForReview: false,
//       visited: false,
//     };

//     const baseStyle = "relative";

//     if (state.answered && state.markedForReview) {
//       return `${baseStyle} bg-green-100 border-green-500 text-green-700`;
//     } else if (state.answered) {
//       return `${baseStyle} bg-green-100 border-green-500 text-green-700`;
//     } else if (state.markedForReview) {
//       return `${baseStyle} bg-rose-50 border-rose-200 text-rose-500`;
//     }
//     return `${baseStyle} bg-gray-50 hover:bg-gray-100`;
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <div className="flex gap-2">
//         {["Section 1", "Section 2"].map((section, index) => (
//           <Button
//             key={index}
//             variant={currentSection === index ? "default" : "outline"}
//             onClick={() => setCurrentSection(index)}
//           >
//             {section}
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

//       <div className="grid grid-cols-5 gap-2">
//         {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
//           <Button
//             key={num}
//             variant="outline"
//             className={getQuestionStyle(num)}
//             onClick={() => setCurrentQuestion(num)}
//           >
//             {num}
//             {questionStates[num]?.markedForReview && (
//               <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//             )}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Footer Navigation
// const AssessmentFooter: React.FC = () => {
//   const { currentQuestion, isSidebarOpen, toggleSidebar } = useAssessmentStore();

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
//       <div className="max-w-screen-xl mx-auto flex justify-between items-center">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => useAssessmentStore.getState().setCurrentQuestion(currentQuestion - 1)}
//           disabled={currentQuestion === 1}
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
//             <QuestionNavigation />
//           </SheetContent>
//         </Sheet>

//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => useAssessmentStore.getState().setCurrentQuestion(currentQuestion + 1)}
//           disabled={currentQuestion === 30}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Main Question Display
// const QuestionDisplay: React.FC<{ question: Question }> = ({ question }) => {
//   const { markQuestion } = useAssessmentStore();

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Question {question.id}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p className="mb-6">{question.text}</p>
//         <RadioGroup
//           onValueChange={() => 
//             markQuestion(question.id, { answered: true, visited: true })
//           }
//         >
//           {question.options.map((option) => (
//             <div key={option.id} className="flex items-center space-x-2">
//               <RadioGroupItem value={option.id} id={option.id} />
//               <Label htmlFor={option.id}>{option.text}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </CardContent>
//     </Card>
//   );
// };

// // Mock API call
// const fetchQuestions = async () => {
//   // Simulating API call
//   return [
//     {
//       id: 1,
//       text: "What is the primary function of the human eye?",
//       options: [
//         { id: "a", text: "To detect sound" },
//         { id: "b", text: "To detect light" },
//         { id: "c", text: "To pump blood" },
//         { id: "d", text: "To support breathing" },
//       ]
//     },
//     {
//         id: 2,
//         text: "What is the primary function of the human eye?",
//         options: [
//           { id: "a", text: "To detect sound" },
//           { id: "b", text: "To detect light" },
//           { id: "c", text: "To pump blood" },
//           { id: "d", text: "To support breathing" },
//         ]
//       },
//       {
//         id: 3,
//         text: "Whaklsnfof the human eye?",
//         options: [
//           { id: "a", text: "To detesl" },
//           { id: "c", text: "To pump blood" },
//           { id: "d", text: "To support breathing" },
//         ]
//       },
//       {
//         id: 1,
//         text: "What is the primary function of the human eye?",
//         options: [
//           { id: "a", text: "To detect sound" },
//           { id: "b", text: "To detect light" },
//           { id: "c", text: "To pump blood" },
//           { id: "d", text: "To support breathing" },
//         ]
//       },

//   ];
// };

// // Main Assessment Component
// export const Assessment: React.FC = () => {
//   const { currentQuestion, isSidebarOpen } = useAssessmentStore();
  
//   const { data: questions = [] } = useQuery({
//     queryKey: ['questions'],
//     queryFn: fetchQuestions
//   });

//   return (
//     <div className="min-h-screen bg-gray-100 pb-16">
//       <div className={`p-6 ${isSidebarOpen ? 'ml-80' : 'ml-0'} transition-all duration-300`}>
//         {questions[currentQuestion - 1] && (
//           <QuestionDisplay question={questions[currentQuestion - 1]} />
//         )}
//       </div>
//       <AssessmentFooter />
//     </div>
//   );
// };

// export default Assessment;

















import React from 'react';
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Assessment, Question as QuestionType } from '@/types/assessment';

interface QuestionState {
  answered: boolean;
  markedForReview: boolean;
  visited: boolean;
}

interface AssessmentStore {
  currentQuestion: number;
  currentSection: number;
  isSidebarOpen: boolean;
  questionStates: { [key: string]: QuestionState };
  setCurrentQuestion: (questionNumber: number) => void;
  setCurrentSection: (section: number) => void;
  toggleSidebar: () => void;
  markQuestion: (questionId: string, state: Partial<QuestionState>) => void;
}

const useAssessmentStore = create<AssessmentStore>((set) => ({
  currentQuestion: 0,
  currentSection: 0,
  isSidebarOpen: true,
  questionStates: {},
  setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
  setCurrentSection: (section) => set({ currentSection: section }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  markQuestion: (questionId, state) =>
    set((prev) => ({
      questionStates: {
        ...prev.questionStates,
        [questionId]: {
          ...prev.questionStates[questionId],
          ...state,
        },
      },
    })),
}));

const QuestionNavigation: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  const {
    currentQuestion,
    currentSection,
    questionStates,
    setCurrentQuestion,
    setCurrentSection,
  } = useAssessmentStore();

  const getQuestionStyle = (questionId: string) => {
    const state = questionStates[questionId] || {
      answered: false,
      markedForReview: false,
      visited: false,
    };

    const baseStyle = "relative";

    if (state.answered && state.markedForReview) {
      return `${baseStyle} bg-green-100 border-green-500 text-green-700`;
    } else if (state.answered) {
      return `${baseStyle} bg-green-100 border-green-500 text-green-700`;
    } else if (state.markedForReview) {
      return `${baseStyle} bg-rose-50 border-rose-200 text-rose-500`;
    }
    return `${baseStyle} bg-gray-50 hover:bg-gray-100`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-2">
        {assessment.sections.map((section, index) => (
          <Button
            key={index}
            variant={currentSection === index ? "default" : "outline"}
            onClick={() => setCurrentSection(index)}
          >
            {section.subject}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Legend:</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100">1</Badge>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-rose-50">1</Badge>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            <span>Not Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-rose-50 relative">
              1
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </Badge>
            <span>Marked for review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {assessment.sections[currentSection].questions.map((question, index) => (
          <Button
            key={question.questionId}
            variant="outline"
            className={getQuestionStyle(question.questionId)}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
            {questionStates[question.questionId]?.markedForReview && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

const AssessmentFooter: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  const { currentQuestion, currentSection } = useAssessmentStore();
  const totalQuestions = assessment.sections[currentSection].questions.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => useAssessmentStore.getState().setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <QuestionNavigation assessment={assessment} />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => useAssessmentStore.getState().setCurrentQuestion(currentQuestion + 1)}
          disabled={currentQuestion === totalQuestions - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const QuestionDisplay: React.FC<{ question: QuestionType }> = ({ question }) => {
  const { markQuestion } = useAssessmentStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {question.questionId}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6">{question.questionName}</p>
        <RadioGroup
          onValueChange={() => 
            markQuestion(question.questionId, { answered: true, visited: true })
          }
        >
          {question.options.map((option) => (
            <div key={option.optionId} className="flex items-center space-x-2">
              <RadioGroupItem value={option.optionId} id={option.optionId} />
              <Label htmlFor={option.optionId}>{option.optionName}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export const Assessment: React.FC = () => {
  const { currentQuestion, currentSection, isSidebarOpen } = useAssessmentStore();
  
  const { data: assessment } = useQuery<Assessment>({
    queryKey: ['assessment'],
    queryFn: () => Promise.resolve({
      assessmentId: "A001",
      title: "The Human Eye and The Colourful World",
      mode: "Online",
      status: "Active",
      startDate: "13/10/2024, 11:15 AM",
      endDate: "15/10/2024, 08:30 PM",
      assessmentDuration: "20 min",
      subject: "Physics",
      assessmentInstruction: "...",
      assessmentPreview: "5 min",
      canSwitchSections: true,
      sections: [
        {
          assesmentDuration: "20 min",
          subject: "Biology",
          sectionDesc: "...",
          sectionDuration: "NA",
          negativeMarking: { checked: true, value: "1" },
          partialMarking: true,
          cutoffMarking: { checked: true, value: "08" },
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
            // Add more questions as needed
          ],
        },
      ],
    }),
  });

  if (!assessment) return null;

  const currentQuestionData = assessment.sections[currentSection].questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className={`p-6 ${isSidebarOpen ? 'ml-80' : 'ml-0'} transition-all duration-300`}>
        {currentQuestionData && (
          <QuestionDisplay question={currentQuestionData} />
        )}
      </div>
      <AssessmentFooter assessment={assessment} />
    </div>
  );
};

export default Assessment;