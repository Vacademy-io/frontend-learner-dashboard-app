
  // components/AssessmentFooter.tsx
  import React from 'react';
  import { Button } from "@/components/ui/button";
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
  import { Assessment } from '@types/assessment';
  import { useAssessmentStore } from './assessment-store';
  import { QuestionNavigation } from './QuestionNavigation';
  
  interface AssessmentFooterProps {
    assessment: Assessment;
  }
  
  export const AssessmentFooter: React.FC<AssessmentFooterProps> = ({ assessment }) => {
    const { currentQuestion, currentSection } = useAssessmentStore();
    const currentSectionQuestions = assessment.sections[currentSection].questions;
    const currentQuestionIndex = currentSectionQuestions.findIndex(
      q => q.questionId === currentQuestion
    );
  
    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        useAssessmentStore.getState().setCurrentQuestion(
          currentSectionQuestions[currentQuestionIndex - 1].questionId
        );
      }
    };
  
    const handleNext = () => {
      if (currentQuestionIndex < currentSectionQuestions.length - 1) {
        useAssessmentStore.getState().setCurrentQuestion(
          currentSectionQuestions[currentQuestionIndex + 1].questionId
        );
      }
    };
  
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
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
            onClick={handleNext}
            disabled={currentQuestionIndex === currentSectionQuestions.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  