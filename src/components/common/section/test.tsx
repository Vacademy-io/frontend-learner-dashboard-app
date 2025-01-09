// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Clock, CheckCircle, Circle, Flag } from 'lucide-react';
// import { Assessment, Section } from '@/types/assessment';


// // Timer Component
// const Timer: React.FC<{ duration: string }> = ({ duration }) => {
//   const [time, setTime] = useState<number>(
//     parseInt(duration) * 60 // Convert minutes to seconds
//   );

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTime((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (seconds: number) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   return (
//     <div className="flex items-center gap-2 text-lg font-medium">
//       <Clock className="w-5 h-5" />
//       {formatTime(time)}
//     </div>
//   );
// };

// // Navigation Bar
// const Navbar: React.FC<{ title: string; duration: string; onSubmit: () => void }> = ({
//   title,
//   duration,
//   onSubmit,
// }) => {
//   return (
//     <div className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-2 flex justify-between items-center z-50">
//       <h1 className="text-lg font-semibold truncate flex-1">{title}</h1>
//       <div className="flex items-center gap-4">
//         <Timer duration={duration} />
//         <button
//           onClick={onSubmit}
//           className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// // Question Navigation Sidebar
// const QuestionSidebar: React.FC<{
//   sections: Section[];
//   currentSection: number;
//   currentQuestion: string;
//   answeredQuestions: Set<string>;
//   markedQuestions: Set<string>;
//   onQuestionClick: (questionId: string) => void;
//   onSectionChange: (index: number) => void;
// }> = ({
//   sections,
//   currentSection,
//   currentQuestion,
//   answeredQuestions,
//   markedQuestions,
//   onQuestionClick,
//   onSectionChange,
// }) => {
//   return (
//     <div className="fixed left-0 top-14 bottom-0 w-64 bg-gray-50 overflow-y-auto p-4">
//       <div className="space-y-4">
//         <div className="flex space-x-2 mb-4">
//           {sections.map((_, index) => (
//             <button
//               key={index}
//               className={`px-4 py-2 rounded ${
//                 currentSection === index
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-200 text-gray-700'
//               }`}
//               onClick={() => onSectionChange(index)}
//             >
//               Section {index + 1}
//             </button>
//           ))}
//         </div>

//         <div className="space-y-2">
//           <div className="text-sm text-gray-600 mb-2">
//             <div className="flex items-center gap-2 mb-1">
//               <CheckCircle className="w-4 h-4 text-green-500" /> Answered
//             </div>
//             <div className="flex items-center gap-2 mb-1">
//               <Circle className="w-4 h-4 text-gray-400" /> Not Answered
//             </div>
//             <div className="flex items-center gap-2">
//               <Flag className="w-4 h-4 text-orange-500" /> Marked for Review
//             </div>
//           </div>

//           <div className="grid grid-cols-5 gap-2">
//             {sections[currentSection].questions.map((question, index) => (
//               <button
//                 key={question.questionId}
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
//                   ${
//                     currentQuestion === question.questionId
//                       ? 'ring-2 ring-orange-500'
//                       : ''
//                   }
//                   ${
//                     answeredQuestions.has(question.questionId)
//                       ? 'bg-green-500 text-white'
//                       : markedQuestions.has(question.questionId)
//                       ? 'bg-orange-100 text-orange-500'
//                       : 'bg-gray-200'
//                   }`}
//                 onClick={() => onQuestionClick(question.questionId)}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Assessment Component
// const AssessmentInterface: React.FC<{ assessmentData: Assessment }> = ({
//   assessmentData,
// }) => {
//   const [currentSection, setCurrentSection] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState(
//     assessmentData.sections[0].questions[0].questionId
//   );
//   const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
//   const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());

//   const handleQuestionClick = (questionId: string) => {
//     setCurrentQuestion(questionId);
//   };

//   const handleSectionChange = (index: number) => {
//     setCurrentSection(index);
//     setCurrentQuestion(assessmentData.sections[index].questions[0].questionId);
//   };

//   const handleSubmit = () => {
//     // Implement submission logic
//     console.log('Assessment submitted');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar
//         title={assessmentData.title}
//         duration={assessmentData.assessmentDuration}
//         onSubmit={handleSubmit}
//       />
      
//       <QuestionSidebar
//         sections={assessmentData.sections}
//         currentSection={currentSection}
//         currentQuestion={currentQuestion}
//         answeredQuestions={answeredQuestions}
//         markedQuestions={markedQuestions}
//         onQuestionClick={handleQuestionClick}
//         onSectionChange={handleSectionChange}
//       />

//       <div className="ml-64 pt-14 p-6">
//         {/* Question Content Area */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           {assessmentData.sections[currentSection].questions.map((question) => (
//             question.questionId === currentQuestion && (
//               <div key={question.questionId} className="space-y-4">
//                 <h2 className="text-lg font-medium">{question.questionName}</h2>
//                 <div className="space-y-2">
//                   {question.options.map((option) => (
//                     <label
//                       key={option.optionId}
//                       className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name={question.questionId}
//                         value={option.optionId}
//                         onChange={() => {
//                           setAnsweredQuestions(new Set([...answeredQuestions, question.questionId]));
//                         }}
//                       />
//                       <span>{option.optionName}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssessmentInterface;





import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, Clock } from 'lucide-react';
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
import { data } from '@/routes/assessment/examination/-utils.ts/dummyData';

// Types
interface QuestionState {
  answered: boolean;
  markedForReview: boolean;
  visited: boolean;
  selectedOption?: string;
}
interface AssessmentContextType {
  currentQuestion: number;
  currentSection: number;
  sectionTimers: { [key: number]: number };
  questionStates: { [key: string]: QuestionState };
  setCurrentQuestion: (questionNumber: number) => void;
  setCurrentSection: (section: number) => void;
  markQuestion: (sectionIndex: number, questionIndex: number, state: Partial<QuestionState>) => void;
  updateTimer: (sectionIndex: number) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionTimers, setSectionTimers] = useState<{ [key: number]: number }>({});
  const [questionStates, setQuestionStates] = useState<{ [key: string]: QuestionState }>({});

  const markQuestion = (sectionIndex: number, questionIndex: number, state: Partial<QuestionState>) => {
    setQuestionStates(prev => ({
      ...prev,
      [`${sectionIndex}-${questionIndex}`]: {
        ...prev[`${sectionIndex}-${questionIndex}`],
        ...state,
      },
    }));
  };

  const updateTimer = (sectionIndex: number) => {
    setSectionTimers(prev => ({
      ...prev,
      [sectionIndex]: (prev[sectionIndex] || 0) - 1,
    }));
  };

  const value = {
    currentQuestion,
    currentSection,
    sectionTimers,
    questionStates,
    setCurrentQuestion,
    setCurrentSection,
    markQuestion,
    updateTimer,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

const QuestionNavigation: React.FC<{ data: any }> = ({ data }) => {
  const {
    currentSection,
    currentQuestion,
    questionStates,
    setCurrentQuestion,
    setCurrentSection,
    sectionTimers,
  } = useAssessment();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionStyle = (sectionIndex: number, questionIndex: number) => {
    const state = questionStates[`${sectionIndex}-${questionIndex}`] || {
      answered: false,
      markedForReview: false,
      visited: false,
    };

    if (state.answered && state.markedForReview) {
      return 'bg-green-100 border-green-500 text-green-700';
    } else if (state.answered) {
      return 'bg-green-100 border-green-500 text-green-700';
    } else if (state.markedForReview) {
      return 'bg-rose-50 border-rose-200 text-rose-500';
    }
    return 'bg-gray-50 hover:bg-gray-100';
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-2">
        {data.sections.map((section: any, index: number) => (
          <div key={index} className="space-y-2">
            <Button
              variant={currentSection === index ? "default" : "outline"}
              onClick={() => setCurrentSection(index)}
              className="w-full"
            >
              {section.subject}
            </Button>
            {sectionTimers[index] !== undefined && (
              <div className="flex items-center justify-center text-sm gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(sectionTimers[index])}
              </div>
            )}
          </div>
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
        {data.sections[currentSection].questions.map((_, index: number) => (
          <Button
            key={index}
            variant="outline"
            className={getQuestionStyle(currentSection, index)}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
            {questionStates[`${currentSection}-${index}`]?.markedForReview && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

const QuestionDisplay: React.FC<{ question: any }> = ({ question }) => {
  const { currentSection, currentQuestion, markQuestion, questionStates } = useAssessment();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6">{question.questionName}</p>
        <RadioGroup
          onValueChange={(value) => {
            markQuestion(currentSection, currentQuestion, {
              answered: true,
              visited: true,
              selectedOption: value
            });
          }}
        >
          {question.options.map((option: any) => (
            <div key={option.optionId} className="flex items-center space-x-2">
              <RadioGroupItem value={option.optionId} id={option.optionId} />
              <Label htmlFor={option.optionId}>{option.optionName}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              const currentState = questionStates[`${currentSection}-${currentQuestion}`];
              markQuestion(currentSection, currentQuestion, {
                markedForReview: !(currentState?.markedForReview ?? false)
              });
            }}
          >
            Mark for Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AssessmentFooter: React.FC<{ data: any }> = ({ data }) => {
  const { currentQuestion, currentSection, setCurrentQuestion } = useAssessment();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
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
            <QuestionNavigation data={data} />
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentQuestion(currentQuestion + 1)}
          disabled={currentQuestion === data.sections[currentSection].questions.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Assessment: React.FC = () => {
  const { currentSection, currentQuestion, updateTimer } = useAssessment();

  useEffect(() => {
    // Initialize section timers
    const timers: { [key: number]: number } = {};
    data.sections.forEach((section: any, index: number) => {
      if (section.assesmentDuration && section.assesmentDuration !== "NA") {
        const [minutes] = section.assesmentDuration.split(' ');
        timers[index] = parseInt(minutes) * 60;
      }
    });
    // Update the context with initial timers
    const contextValue = useContext(AssessmentContext);
    if (contextValue) {
      contextValue.sectionTimers = timers;
    }

    // Start timer
    const interval = setInterval(() => {
      updateTimer(currentSection);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSection]);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="p-6">
        {data.sections[currentSection]?.questions[currentQuestion] && (
          <QuestionDisplay question={data.sections[currentSection].questions[currentQuestion]} />
        )}
      </div>
      <AssessmentFooter data={data} />
    </div>
  );
};

const AssessmentWrapper: React.FC = () => {
  return (
    <AssessmentProvider>
      <Assessment />
    </AssessmentProvider>
  );
};

export default AssessmentWrapper;