// import React, { useState } from 'react';
// import { Flag, Grid, MessageSquare, X } from 'lucide-react';

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

// interface QuestionNavigationProps {
//   totalQuestions: number;
//   onQuestionSelect: (questionNumber: number) => void;
//   currentSection: number;
//   sections: string[];
//   onSectionChange: (section: number) => void;
// }

// const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
//   totalQuestions,
//   onQuestionSelect,
//   currentSection,
//   sections,
//   onSectionChange
// }) => {
//   const [questionStates, setQuestionStates] = useState<{ [key: number]: QuestionState }>(
//     Array.from({ length: totalQuestions }, (_, i) => i + 1).reduce((acc, curr) => ({
//       ...acc,
//       [curr]: {
//         answered: false,
//         markedForReview: false,
//         visited: false
//       }
//     }), {})
//   );

//   const getQuestionStyle = (questionNumber: number) => {
//     const state = questionStates[questionNumber];
//     const baseStyle = "w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium relative";
    
//     if (state.answered && state.markedForReview) {
//       return `${baseStyle} bg-green-100 border border-green-500 text-green-700`;
//     } else if (state.answered) {
//       return `${baseStyle} bg-green-100 border border-green-500 text-green-700`;
//     } else if (state.markedForReview) {
//       return `${baseStyle} bg-rose-50 border border-rose-200 text-rose-500`;
//     } else if (!state.visited) {
//       return `${baseStyle} bg-gray-50 border border-gray-200 text-gray-700`;
//     }
//     return `${baseStyle} bg-white border border-gray-200 text-gray-700`;
//   };

//   const handleQuestionClick = (questionNumber: number) => {
//     setQuestionStates(prev => ({
//       ...prev,
//       [questionNumber]: {
//         ...prev[questionNumber],
//         visited: true
//       }
//     }));
//     onQuestionSelect(questionNumber);
//   };

//   return (
//     <div className="w-72 bg-white p-4 shadow-lg h-full">
//       {/* Section Tabs */}
//       <div className="flex gap-2 mb-4">
//         <button className="p-2 hover:bg-gray-100 rounded">
//           <Grid size={20} />
//         </button>
//         <button className="p-2 hover:bg-gray-100 rounded">
//           <MessageSquare size={20} />
//         </button>
//         <button className="ml-auto p-2 hover:bg-gray-100 rounded">
//           <X size={20} />
//         </button>
//       </div>

//       {/* Sections */}
//       <div className="flex gap-2 mb-4">
//         {sections.map((section, index) => (
//           <button
//             key={index}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${
//               currentSection === index
//                 ? 'bg-orange-500 text-white'
//                 : 'bg-gray-100 text-gray-700'
//             }`}
//             onClick={() => onSectionChange(index)}
//           >
//             Section {index + 1}
//           </button>
//         ))}
//       </div>

//       {/* Legend */}
//       <div className="mb-4 space-y-2">
//         <h3 className="text-sm font-medium text-gray-700 mb-2">Legend:</h3>
//         <div className="flex items-center gap-2 text-sm">
//           <div className="w-6 h-6 rounded-md bg-green-100 border border-green-500" />
//           <span className="text-gray-600">Answered</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm">
//           <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200" />
//           <span className="text-gray-600">Not Answered</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm">
//           <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-200" />
//           <span className="text-gray-600">Not Visited</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm">
//           <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200 relative">
//             <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//           </div>
//           <span className="text-gray-600">Marked for review</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm">
//           <div className="w-6 h-6 rounded-md bg-green-100 border border-green-500 relative">
//             <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//           </div>
//           <span className="text-gray-600">Answered & Marked for review</span>
//           <span className="text-xs text-gray-500">(will be considered for evaluation)</span>
//         </div>
//       </div>

//       {/* Question Grid */}
//       <div className="grid grid-cols-5 gap-2">
//         {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
//           <button
//             key={num}
//             className={getQuestionStyle(num)}
//             onClick={() => handleQuestionClick(num)}
//           >
//             {num}
//             {questionStates[num].markedForReview && (
//               <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Example Question Display Component
// const QuestionDisplay: React.FC<{ question: Question }> = ({ question }) => {
//   return (
//     <div className="p-6 bg-white rounded-lg shadow">
//       <h2 className="text-lg font-medium mb-4">Question {question.id}</h2>
//       <p className="mb-4">{question.text}</p>
//       <div className="space-y-2">
//         {question.options.map((option) => (
//           <label key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
//             <input type="radio" name={`question-${question.id}`} value={option.id} />
//             <span>{option.text}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main Assessment Component
// export const Assessment: React.FC = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [currentSection, setCurrentSection] = useState(0);

//   // Example questions data
//   const questions: Question[] = [
//     {
//       id: 1,
//       text: "What is the primary function of the human eye?",
//       options: [
//         { id: "a", text: "To detect sound" },
//         { id: "b", text: "To detect light" },
//         { id: "c", text: "To pump blood" },
//         { id: "d", text: "To support breathing" },
//       ]
//     }
    
//     // Add more questions as needed
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <QuestionNavigation
//         totalQuestions={30}
//         onQuestionSelect={setCurrentQuestion}
//         currentSection={currentSection}
//         sections={["Section 1", "Section 2"]}
//         onSectionChange={setCurrentSection}
//       />
//       <div className="flex-1 p-6">
//         <QuestionDisplay question={questions[currentQuestion - 1]} />
//       </div>
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

// Types
interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
}

interface QuestionState {
  answered: boolean;
  markedForReview: boolean;
  visited: boolean;
}

// Zustand Store
interface AssessmentStore {
  currentQuestion: number;
  currentSection: number;
  isSidebarOpen: boolean;
  questionStates: { [key: number]: QuestionState };
  setCurrentQuestion: (questionNumber: number) => void;
  setCurrentSection: (section: number) => void;
  toggleSidebar: () => void;
  markQuestion: (questionNumber: number, state: Partial<QuestionState>) => void;
}

const useAssessmentStore = create<AssessmentStore>((set) => ({
  currentQuestion: 1,
  currentSection: 0,
  isSidebarOpen: true,
  questionStates: {},
  setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
  setCurrentSection: (section) => set({ currentSection: section }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  markQuestion: (questionNumber, state) =>
    set((prev) => ({
      questionStates: {
        ...prev.questionStates,
        [questionNumber]: {
          ...prev.questionStates[questionNumber],
          ...state,
        },
      },
    })),
}));

// Question Navigation Component
const QuestionNavigation: React.FC = () => {
  const {
    currentQuestion,
    currentSection,
    questionStates,
    setCurrentQuestion,
    setCurrentSection,
    markQuestion,
  } = useAssessmentStore();

  const getQuestionStyle = (questionNumber: number) => {
    const state = questionStates[questionNumber] || {
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
        {["Section 1", "Section 2"].map((section, index) => (
          <Button
            key={index}
            variant={currentSection === index ? "default" : "outline"}
            onClick={() => setCurrentSection(index)}
          >
            {section}
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
        {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            variant="outline"
            className={getQuestionStyle(num)}
            onClick={() => setCurrentQuestion(num)}
          >
            {num}
            {questionStates[num]?.markedForReview && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Footer Navigation
const AssessmentFooter: React.FC = () => {
  const { currentQuestion, isSidebarOpen, toggleSidebar } = useAssessmentStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => useAssessmentStore.getState().setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 1}
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
            <QuestionNavigation />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => useAssessmentStore.getState().setCurrentQuestion(currentQuestion + 1)}
          disabled={currentQuestion === 30}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Main Question Display
const QuestionDisplay: React.FC<{ question: Question }> = ({ question }) => {
  const { markQuestion } = useAssessmentStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {question.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6">{question.text}</p>
        <RadioGroup
          onValueChange={() => 
            markQuestion(question.id, { answered: true, visited: true })
          }
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

// Mock API call
const fetchQuestions = async () => {
  // Simulating API call
  return [
    {
      id: 1,
      text: "What is the primary function of the human eye?",
      options: [
        { id: "a", text: "To detect sound" },
        { id: "b", text: "To detect light" },
        { id: "c", text: "To pump blood" },
        { id: "d", text: "To support breathing" },
      ]
    },
    {
        id: 2,
        text: "What is the primary function of the human eye?",
        options: [
          { id: "a", text: "To detect sound" },
          { id: "b", text: "To detect light" },
          { id: "c", text: "To pump blood" },
          { id: "d", text: "To support breathing" },
        ]
      },
      {
        id: 3,
        text: "Whaklsnfof the human eye?",
        options: [
          { id: "a", text: "To detesl" },
          { id: "c", text: "To pump blood" },
          { id: "d", text: "To support breathing" },
        ]
      },
      {
        id: 1,
        text: "What is the primary function of the human eye?",
        options: [
          { id: "a", text: "To detect sound" },
          { id: "b", text: "To detect light" },
          { id: "c", text: "To pump blood" },
          { id: "d", text: "To support breathing" },
        ]
      },

  ];
};

// Main Assessment Component
export const Assessment: React.FC = () => {
  const { currentQuestion, isSidebarOpen } = useAssessmentStore();
  
  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className={`p-6 ${isSidebarOpen ? 'ml-80' : 'ml-0'} transition-all duration-300`}>
        {questions[currentQuestion - 1] && (
          <QuestionDisplay question={questions[currentQuestion - 1]} />
        )}
      </div>
      <AssessmentFooter />
    </div>
  );
};

export default Assessment;





// import React, { useState, useEffect } from 'react';
// import { Menu, Clock, X } from 'lucide-react';

// const AssessmentInterface = () => {
//   const [currentSection, setCurrentSection] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sectionTimers, setSectionTimers] = useState({});
//   const [visitedQuestions, setVisitedQuestions] = useState(new Set());
//   const [selectedAnswers, setSelectedAnswers] = useState({});

//   const data = {
//     sections: [{
//       assesmentDuration: "20 min",
//       subject: "Biology",
//       questions: [
//         {
//           questionId: "Q001",
//           questionName: "What is the primary function of the human eye?",
//           questionMark: "2",
//           options: [
//             { optionId: "O001", optionName: "To detect sound" },
//             { optionId: "O002", optionName: "To detect light" },
//             { optionId: "O003", optionName: "To pump blood" },
//             { optionId: "O004", optionName: "To support breathing" },
//           ],
//         },
//         {
//           questionId: "Q002",
//           questionName: "Which part of the eye controls the amount of light entering it?",
//           questionMark: "2",
//           options: [
//             { optionId: "O001", optionName: "Cornea" },
//             { optionId: "O002", optionName: "Iris" },
//             { optionId: "O003", optionName: "Lens" },
//             { optionId: "O004", optionName: "Retina" },
//           ],
//         }
//       ]
//     }]
//   };

//   useEffect(() => {
//     // Initialize section timers
//     const timers = {};
//     data.sections.forEach((section, index) => {
//       if (section.assesmentDuration && section.assesmentDuration !== "NA") {
//         const duration = parseInt(section.assesmentDuration);
//         timers[index] = duration * 60; // Convert to seconds
//       }
//     });
//     setSectionTimers(timers);
//   }, []);

//   useEffect(() => {
//     // Timer countdown logic
//     const interval = setInterval(() => {
//       setSectionTimers(prev => {
//         const newTimers = { ...prev };
//         if (newTimers[currentSection] > 0) {
//           newTimers[currentSection]--;
//         }
//         return newTimers;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [currentSection]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const handleQuestionClick = (sectionIndex, questionIndex) => {
//     setCurrentSection(sectionIndex);
//     setCurrentQuestion(questionIndex);
//     setSidebarOpen(false);
//     setVisitedQuestions(prev => new Set([...prev, `${sectionIndex}-${questionIndex}`]));
//   };

//   const handleOptionSelect = (questionId, optionId) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionId
//     }));
//   };

//   const getQuestionStatus = (sectionIndex, questionIndex) => {
//     const questionId = data.sections[sectionIndex].questions[questionIndex].questionId;
//     const isVisited = visitedQuestions.has(`${sectionIndex}-${questionIndex}`);
//     const isAnswered = selectedAnswers[questionId];
    
//     if (isAnswered) return 'bg-green-500';
//     if (isVisited) return 'bg-yellow-500';
//     return 'bg-gray-200';
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out z-20 md:relative md:translate-x-0`}>
//         <div className="p-4">
//           <button 
//             onClick={() => setSidebarOpen(false)}
//             className="md:hidden absolute right-4 top-4"
//           >
//             <X className="h-6 w-6" />
//           </button>
          
//           {data.sections.map((section, sectionIndex) => (
//             <div key={sectionIndex} className="mb-6">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="font-semibold">{section.subject}</h3>
//                 {sectionTimers[sectionIndex] !== undefined && (
//                   <div className="flex items-center text-sm">
//                     <Clock className="h-4 w-4 mr-1" />
//                     {formatTime(sectionTimers[sectionIndex])}
//                   </div>
//                 )}
//               </div>
              
//               <div className="grid grid-cols-5 gap-2">
//                 {section.questions.map((_, questionIndex) => (
//                   <button
//                     key={questionIndex}
//                     onClick={() => handleQuestionClick(sectionIndex, questionIndex)}
//                     className={`w-8 h-8 rounded-full ${getQuestionStatus(sectionIndex, questionIndex)} 
//                       ${currentSection === sectionIndex && currentQuestion === questionIndex ? 'ring-2 ring-blue-500' : ''}`}
//                   >
//                     {questionIndex + 1}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 overflow-auto">
//         <div className="p-4">
//           <button 
//             onClick={() => setSidebarOpen(true)}
//             className="md:hidden mb-4"
//           >
//             <Menu className="h-6 w-6" />
//           </button>

//           {/* Current question */}
//           {data.sections[currentSection]?.questions[currentQuestion] && (
//             <div className="bg-white rounded-lg p-6 shadow">
//               <h2 className="text-xl font-semibold mb-4">
//                 Question {currentQuestion + 1}
//               </h2>
//               <p className="mb-4">
//                 {data.sections[currentSection].questions[currentQuestion].questionName}
//               </p>
//               <div className="space-y-2">
//                 {data.sections[currentSection].questions[currentQuestion].options.map((option) => (
//                   <button
//                     key={option.optionId}
//                     onClick={() => handleOptionSelect(
//                       data.sections[currentSection].questions[currentQuestion].questionId,
//                       option.optionId
//                     )}
//                     className={`w-full text-left p-3 rounded border 
//                       ${selectedAnswers[data.sections[currentSection].questions[currentQuestion].questionId] === option.optionId 
//                         ? 'bg-blue-100 border-blue-500' 
//                         : 'hover:bg-gray-50'}`}
//                   >
//                     {option.optionName}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssessmentInterface;
























// import React, { useEffect } from 'react';
// import { create } from 'zustand';
// import { ChevronLeft, ChevronRight, Menu, Clock } from 'lucide-react';
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
// interface QuestionState {
//   answered: boolean;
//   markedForReview: boolean;
//   visited: boolean;
//   selectedOption?: string;
// }

// // Zustand Store
// interface AssessmentStore {
//   currentQuestion: number;
//   currentSection: number;
//   sectionTimers: { [key: number]: number };
//   questionStates: { [key: string]: QuestionState };
//   setCurrentQuestion: (questionNumber: number) => void;
//   setCurrentSection: (section: number) => void;
//   markQuestion: (sectionIndex: number, questionIndex: number, state: Partial<QuestionState>) => void;
//   updateTimer: (sectionIndex: number) => void;
// }

// const useAssessmentStore = create<AssessmentStore>((set) => ({
//   currentQuestion: 0,
//   currentSection: 0,
//   sectionTimers: {},
//   questionStates: {},
//   setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
//   setCurrentSection: (section) => set({ currentSection: section }),
//   markQuestion: (sectionIndex, questionIndex, state) =>
//     set((prev) => ({
//       questionStates: {
//         ...prev.questionStates,
//         [`${sectionIndex}-${questionIndex}`]: {
//           ...prev.questionStates[`${sectionIndex}-${questionIndex}`],
//           ...state,
//         },
//       },
//     })),
//   updateTimer: (sectionIndex) =>
//     set((state) => ({
//       sectionTimers: {
//         ...state.sectionTimers,
//         [sectionIndex]: (state.sectionTimers[sectionIndex] || 0) - 1,
//       },
//     })),
// }));

// const QuestionNavigation: React.FC<{ data: any }> = ({ data }) => {
//   const {
//     currentSection,
//     currentQuestion,
//     questionStates,
//     setCurrentQuestion,
//     setCurrentSection,
//     sectionTimers,
//   } = useAssessmentStore();

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   const getQuestionStyle = (sectionIndex: number, questionIndex: number) => {
//     const state = questionStates[`${sectionIndex}-${questionIndex}`] || {
//       answered: false,
//       markedForReview: false,
//       visited: false,
//     };

//     if (state.answered && state.markedForReview) {
//       return 'bg-green-100 border-green-500 text-green-700';
//     } else if (state.answered) {
//       return 'bg-green-100 border-green-500 text-green-700';
//     } else if (state.markedForReview) {
//       return 'bg-rose-50 border-rose-200 text-rose-500';
//     }
//     return 'bg-gray-50 hover:bg-gray-100';
//   };

//   return (
//     <div className="p-4 space-y-6">
//       <div className="flex gap-2">
//         {data.sections.map((section: any, index: number) => (
//           <div key={index} className="space-y-2">
//             <Button
//               variant={currentSection === index ? "default" : "outline"}
//               onClick={() => setCurrentSection(index)}
//               className="w-full"
//             >
//               {section.subject}
//             </Button>
//             {sectionTimers[index] !== undefined && (
//               <div className="flex items-center justify-center text-sm gap-1">
//                 <Clock className="h-4 w-4" />
//                 {formatTime(sectionTimers[index])}
//               </div>
//             )}
//           </div>
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
//         {data.sections[currentSection].questions.map((_, index: number) => (
//           <Button
//             key={index}
//             variant="outline"
//             className={getQuestionStyle(currentSection, index)}
//             onClick={() => setCurrentQuestion(index)}
//           >
//             {index + 1}
//             {questionStates[`${currentSection}-${index}`]?.markedForReview && (
//               <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
//             )}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// };

// const QuestionDisplay: React.FC<{ question: any }> = ({ question }) => {
//   const { currentSection, currentQuestion, markQuestion } = useAssessmentStore();

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Question {currentQuestion + 1}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p className="mb-6">{question.questionName}</p>
//         <RadioGroup
//           onValueChange={(value) => {
//             markQuestion(currentSection, currentQuestion, {
//               answered: true,
//               visited: true,
//               selectedOption: value
//             });
//           }}
//         >
//           {question.options.map((option: any) => (
//             <div key={option.optionId} className="flex items-center space-x-2">
//               <RadioGroupItem value={option.optionId} id={option.optionId} />
//               <Label htmlFor={option.optionId}>{option.optionName}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//         <div className="mt-4">
//           <Button
//             variant="outline"
//             onClick={() => 
//               markQuestion(currentSection, currentQuestion, {
//                 markedForReview: !useAssessmentStore.getState().questionStates[`${currentSection}-${currentQuestion}`]?.markedForReview
//               })
//             }
//           >
//             Mark for Review
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const AssessmentFooter: React.FC = () => {
//   const { currentQuestion, currentSection, setCurrentQuestion } = useAssessmentStore();

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
//       <div className="max-w-screen-xl mx-auto flex justify-between items-center">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setCurrentQuestion(currentQuestion - 1)}
//           disabled={currentQuestion === 0}
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
//             <QuestionNavigation data={data} />
//           </SheetContent>
//         </Sheet>

//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setCurrentQuestion(currentQuestion + 1)}
//           disabled={currentQuestion === data.sections[currentSection].questions.length - 1}
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// const Assessment: React.FC = () => {
//   const { currentSection, currentQuestion, updateTimer } = useAssessmentStore();

//   useEffect(() => {
//     // Initialize section timers
//     const timers: { [key: number]: number } = {};
//     data.sections.forEach((section: any, index: number) => {
//       if (section.assesmentDuration && section.assesmentDuration !== "NA") {
//         const [minutes] = section.assesmentDuration.split(' ');
//         timers[index] = parseInt(minutes) * 60;
//       }
//     });
//     useAssessmentStore.setState({ sectionTimers: timers });

//     // Start timer
//     const interval = setInterval(() => {
//       updateTimer(currentSection);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [currentSection]);

//   return (
//     <div className="min-h-screen bg-gray-100 pb-16">
//       <div className="p-6">
//         {data.sections[currentSection]?.questions[currentQuestion] && (
//           <QuestionDisplay question={data.sections[currentSection].questions[currentQuestion]} />
//         )}
//       </div>
//       <AssessmentFooter />
//     </div>
//   );
// };

// export default Assessment;