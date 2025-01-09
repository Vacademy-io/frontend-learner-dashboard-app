
  // components/QuestionNavigation.tsx
  import React from 'react';
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Assessment } from '../types';
  import { useAssessmentStore } from '../store/assessment-store';
  
  interface QuestionNavigationProps {
    assessment: Assessment;
  }
  
  export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({ assessment }) => {
    const {
      currentSection,
      currentQuestion,
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
  
      const baseStyle = "w-full h-full";
  
      if (state.answered && state.markedForReview) {
        return `${baseStyle} bg-green-100 text-green-700`;
      } else if (state.answered) {
        return `${baseStyle} bg-green-100 text-green-700`;
      } else if (state.markedForReview) {
        return `${baseStyle} bg-rose-50 text-rose-500`;
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
              className="flex-1"
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
  
        <div className="space-y-4">
          {assessment.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`${currentSection === sectionIndex ? "block" : "hidden"}`}
            >
              <h3 className="font-medium mb-2">{section.subject}</h3>
              <p className="text-sm text-gray-600 mb-4">{section.sectionDesc}</p>
              <div className="grid grid-cols-5 gap-2">
                {section.questions.map((question) => (
                  <Button
                    key={question.questionId}
                    variant="outline"
                    className={getQuestionStyle(question.questionId)}
                    onClick={() => setCurrentQuestion(question.questionId)}
                  >
                    {question.questionId.replace('Q', '')}
                    {questionStates[question.questionId]?.markedForReview && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  