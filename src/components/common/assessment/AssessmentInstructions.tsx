import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AssessmentInstructionsProps {
  instructions: string;
  preview: string;
  canSwitchSections: boolean;
}

export const AssessmentInstructions: React.FC<AssessmentInstructionsProps> = ({
  instructions,
  preview,
  canSwitchSections,
}) => (
  <Card className="mb-6">
    <CardContent className="pt-6">
      <h3 className="text-lg font-semibold mb-4">Instructions</h3>
      <div className="space-y-4">
        {instructions.split('\n').map((instruction, index) => (
          instruction.trim() && (
            <p key={index} className="text-gray-700">{instruction.trim()}</p>
          )
        ))}
      </div>
      <div className="mt-6 space-y-2 text-sm">
        <p>Assessment Preview: {preview}</p>
        <p>Section Switching: {canSwitchSections ? 'Allowed' : 'Not Allowed'}</p>
      </div>
    </CardContent>
  </Card>
);
