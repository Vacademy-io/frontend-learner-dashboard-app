import React from "react";
import { AssessmentInstructions } from "@/components/common/instructionPage/AssessmentInstructions";
import { SectionDetails } from "@/components/common/instructionPage/SectionDetails";
import { Assessment } from "@/types/previewInstructionAssessment";
import AssessmentStartModal from "./StartAssessment";
import Navbar from "@/components/common/instructionPage/AssessmentNavbar";
import { Separator } from "@/components/ui/separator";

const InstructionPage: React.FC<{ assessment: Assessment; title: string }> = ({
  assessment,
  title, // Add title prop
}) => {
  return (
    <>
      <div className="">
        <Navbar title={assessment.title} />
        <div className="p-4 lg:p-8">
          <AssessmentInstructions
            instructions={assessment.assessmentInstruction}
            duration={assessment.assessmentDuration}
            preview={assessment.assessmentPreview}
            canSwitchSections={assessment.canSwitchSections}
          />
          {/* <div className="border-b-2 border-gray-300 my-4"></div> */}
          <Separator orientation="horizontal" className="my-4 " />
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
