import React from 'react';
import { AssessmentInstructions } from '@/components/common/instructionPage/AssessmentInstructions';
import { SectionDetails } from '@/components/common/instructionPage/SectionDetails';
import { StartButton } from '@/components/common/instructionPage/StartButton';
import { Assessment } from '@/types/assessment';

const InstructionPage: React.FC<{ assessment: Assessment }> = ({ assessment }) => {
  return (
    <div className="container mx-auto p-4">
      <AssessmentInstructions 
        instructions={assessment.assessmentInstruction} 
        duration={assessment.assessmentDuration} 
        preview={assessment.assessmentPreview} 
        canSwitchSections={assessment.canSwitchSections} 
      />
      {assessment.sections.map((section, index) => (
        <SectionDetails key={index} section={section} />
      ))}
      <StartButton />
    </div>
  );
};

export default InstructionPage;
