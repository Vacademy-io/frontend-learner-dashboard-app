import React from "react";
import { AssessmentInstructions } from "@/components/common/instructionPage/AssessmentInstructions";
import { SectionDetails } from "@/components/common/instructionPage/SectionDetails";
import { Assessment } from "@/types/assessment";
import { MyButton } from "@/components/design-system/button";

const InstructionPage: React.FC<{ assessment: Assessment }> = ({
  assessment,
}) => {
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
      <div className="flex justify-center pt-4">
        <MyButton buttonType="primary" scale="large" layoutVariant="default">
          Start Assessment
        </MyButton>
      </div>
    </div>
  );
};

export default InstructionPage;
