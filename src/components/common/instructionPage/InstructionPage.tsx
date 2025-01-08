import React from "react";
import { AssessmentInstructions } from "@/components/common/instructionPage/AssessmentInstructions";
import { SectionDetails } from "@/components/common/instructionPage/SectionDetails";
import { Assessment } from "@/types/assessment";
import AssessmentStartModal from "./StartAssessment";
import Navbar from "@/components/common/instructionPage/AssessmentNavbar";

const InstructionPage: React.FC<{ assessment: Assessment; title: string }> = ({
  assessment,
  title, // Add title prop
}) => {
  return (
    <>
      <div className="">
        <Navbar title={assessment.title} />
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
          <AssessmentStartModal />
        </div>
      </div>
    </>
  );
};

export default InstructionPage;
