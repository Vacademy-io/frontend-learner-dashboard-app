
  // pages/Assessment.tsx
  import React from 'react';
  import { QuestionNavigation } from './QuestionNavigation';
  import { QuestionDisplay } from './QuestionDisplay';
  import { AssessmentFooter } from './AssessmentFooter';
  import { useAssessmentStore } from './assessment-store';
  import { assessments } from '../../../types/question'; // Your assessment data
  
  export const Assessment: React.FC = () => {
    const { currentQuestion, currentSection } = useAssessmentStore();
    const assessment = assessments[0]; // Using the first assessment
  
    const currentSectionQuestions = assessment.sections[currentSection].questions;
    const currentQuestionData = currentSectionQuestions.find(
      q => q.questionId === currentQuestion
    );
  
    return (
      <div className="min-h-screen bg-gray-100 pb-16">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 lg:col-span-3">
              <QuestionNavigation assessment={assessment} />
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              {currentQuestionData ? (
                <QuestionDisplay question={currentQuestionData} />
              ) : (
                <div className="text-center text-gray-500">
                  Select a question to begin
                </div>
              )}
            </div>
          </div>
        </div>
        <AssessmentFooter assessment={assessment} />
      </div>
    );
  };
  
  export default Assessment;