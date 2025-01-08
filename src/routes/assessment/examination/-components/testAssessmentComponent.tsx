import React from 'react';
import { Clock, SwitchCamera, XCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssessmentPreviewProps {
  assessment: {
    assessmentDuration: string;
    assessmentPreview: string;
    canSwitchSections: boolean;
    sections: Array<{
      subject: string;
      sectionDesc: string;
      sectionDuration: string;
      negativeMarking: {
        checked: boolean;
        value: string;
      };
      partialMarking: boolean;
      cutoffMarking: {
        checked: boolean;
        value: string;
      };
      totalMark: string;
    }>;
  };
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment }) => {
  const section = assessment.sections[0]; // Using first section for preview

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Assessment Instructions:</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ol className="list-decimal pl-4 space-y-2">
            <li>Attempt All Questions: Answer all questions. Ensure accuracy and completeness in each response.</li>
            <li>Objective Format: All questions are multiple-choice. Select the best answer for each question.</li>
            <li>Single Submit Only: This Assessment allows for one submission. Once you submit, you cannot change your answers.</li>
            <li>Negative Marking: Incorrect answers may result in a deduction of points.</li>
            <li>Submission Guidelines: Double-check all answers before submitting. Click Submit only when you are ready.</li>
            <li>Use of Materials: During this Assessment, using textbooks, notes, or assistance from others is not permitted.</li>
            <li>Stay Focused: Avoid switching tabs or leaving the exam screen, as it may be flagged as suspicious activity.</li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Assessment Duration:</span>
          </div>
          <span className="text-sm">{assessment.assessmentDuration}</span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Assessment Preview:</span>
          </div>
          <span className="text-sm">{assessment.assessmentPreview}</span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <SwitchCamera className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Switch between sections</span>
          </div>
          {assessment.canSwitchSections ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">{section.subject}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-4">Section Description:</p>
              <p>{section.sectionDesc}</p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Section Duration:</span>
                <span className="text-sm">{section.sectionDuration}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Negative Marking:</span>
                <span className="text-sm">{section.negativeMarking.value}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Partial Marking:</span>
                {section.partialMarking ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cut off marks:</span>
                <span className="text-sm">{section.cutoffMarking.value}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Marks:</span>
                <span className="text-sm">{section.totalMark}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <button className="w-full mt-4 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
        Start Assessment
      </button>
    </div>
  );
};

export default AssessmentPreview;