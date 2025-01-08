import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Assessment } from '@/types/assessment';
import { AssessmentHeader } from './AssessmentHeader';
import { AssessmentInstructions } from './AssessmentInstructions';
import { SectionDetails } from './SectionDetails';

interface AssessmentPageProps {
  assessment: Assessment;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ assessment }) => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate({
      to: '/assessment/examination/$assessmentId/questions',
      params: { assessmentId: assessment.assessmentId }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <AssessmentHeader
        title={assessment.title}
        subject={assessment.subject}
        duration={assessment.assessmentDuration}
      />
      
      <AssessmentInstructions
        instructions={assessment.assessmentInstruction}
        preview={assessment.assessmentPreview}
        canSwitchSections={assessment.canSwitchSections}
      />

      {assessment.sections.map((section, index) => (
        <SectionDetails key={index} section={section} />
      ))}

      <Button 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        onClick={handleStartAssessment}
      >
        Start Assessment
      </Button>
    </div>
  );
};