import React from "react";
import { InstructionsProps } from "@/types/previewInstructionAssessment";
import { Check } from "lucide-react";

export const AssessmentInstructions: React.FC<InstructionsProps> = ({
  instructions,
  duration,
  preview,
  canSwitchSections,
}) => {
  return (
    <>
      <div className="mb-2 font-semibold">Assessment Instructions</div>
      <div className="text-gray-700 whitespace-pre-line text-sm">
        {instructions}
      </div>
      <div className="mt-4 text-sm">
        <div>
          Assessment Duration:
          <div className="flex items-center gap-2">
            <div>Entire Assessment Duration</div>
            {duration}
          </div>
        </div>
        <div>Assessment Preview: {preview}</div>
        <div className="flex items-center justify-between text-gray-600">
          <div>Switch between sections: {canSwitchSections ? "Yes" : "No"}</div>
          {canSwitchSections && <Check className="w-5 h-5 text-green-500" />}
        </div>
      </div>
    </>
  );
};
