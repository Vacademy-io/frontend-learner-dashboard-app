import React from "react";
import { InstructionsProps } from "@/types/assessment";
import { Check } from "lucide-react";

export const AssessmentInstructions: React.FC<InstructionsProps> = ({
  instructions,
  duration,
  preview,
  canSwitchSections,
}) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2">Assessment Instructions</h2>
      <p className="text-gray-700 whitespace-pre-line text-sm">{instructions}</p>
      <div className="mt-4 text-sm">
        <p>
          <span className="font-semibold">Assessment Duration:</span>
          <div className="flex items-center gap-2">
            <p>Entire Assessment Duration</p>
            {duration}
          </div>
        </p>
        <p>
          <span className="font-semibold">Assessment Preview:</span> {preview}
        </p>
        <div className="flex items-center justify-between text-gray-600">
          <span>
            <span className="font-semibold">Switch between sections:</span>{" "}
            {canSwitchSections ? "Yes" : "No"}
          </span>
          {canSwitchSections && (
            <Check className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
    </div>
  );
};
