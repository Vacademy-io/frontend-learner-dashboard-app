// import React from 'react';
// import { Clock, SwitchCamera, XCircle, Check } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// interface AssessmentPreviewProps {
//   assessment: {
//     assessmentDuration: string;
//     assessmentPreview: string;
//     canSwitchSections: boolean;
//     sections: Array<{
//       subject: string;
//       sectionDesc: string;
//       sectionDuration: string;
//       negativeMarking: {
//         checked: boolean;
//         value: string;
//       };
//       partialMarking: boolean;
//       cutoffMarking: {
//         checked: boolean;
//         value: string;
//       };
//       totalMark: string;
//     }>;
//   };
// }

// const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment }) => {
//   const section = assessment.sections[0]; // Using first section for preview

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <Card className="mb-4">
//         <CardHeader className="border-b">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg font-semibold">Assessment Instructions:</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent className="pt-4">
//           <ol className="list-decimal pl-4 space-y-2">
//             <li>Attempt All Questions: Answer all questions. Ensure accuracy and completeness in each response.</li>
//             <li>Objective Format: All questions are multiple-choice. Select the best answer for each question.</li>
//             <li>Single Submit Only: This Assessment allows for one submission. Once you submit, you cannot change your answers.</li>
//             <li>Negative Marking: Incorrect answers may result in a deduction of points.</li>
//             <li>Submission Guidelines: Double-check all answers before submitting. Click Submit only when you are ready.</li>
//             <li>Use of Materials: During this Assessment, using textbooks, notes, or assistance from others is not permitted.</li>
//             <li>Stay Focused: Avoid switching tabs or leaving the exam screen, as it may be flagged as suspicious activity.</li>
//           </ol>
//         </CardContent>
//       </Card>

//       <div className="grid gap-4">
//         <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
//           <div className="flex items-center gap-2">
//             <Clock className="w-5 h-5 text-gray-600" />
//             <span className="text-sm font-medium">Assessment Duration:</span>
//           </div>
//           <span className="text-sm">{assessment.assessmentDuration}</span>
//         </div>

//         <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
//           <div className="flex items-center gap-2">
//             <Clock className="w-5 h-5 text-gray-600" />
//             <span className="text-sm font-medium">Assessment Preview:</span>
//           </div>
//           <span className="text-sm">{assessment.assessmentPreview}</span>
//         </div>

//         <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
//           <div className="flex items-center gap-2">
//             <SwitchCamera className="w-5 h-5 text-gray-600" />
//             <span className="text-sm font-medium">Switch between sections</span>
//           </div>
//           {assessment.canSwitchSections ? (
//             <Check className="w-5 h-5 text-green-500" />
//           ) : (
//             <XCircle className="w-5 h-5 text-red-500" />
//           )}
//         </div>
//       </div>

//       <Card className="mt-4">
//         <CardHeader className="border-b">
//           <CardTitle className="text-lg font-semibold">{section.subject}</CardTitle>
//         </CardHeader>
//         <CardContent className="pt-4">
//           <div className="space-y-4">
//             <div className="text-sm text-gray-600">
//               <p className="mb-4">Section Description:</p>
//               <p>{section.sectionDesc}</p>
//             </div>

//             <div className="grid gap-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Section Duration:</span>
//                 <span className="text-sm">{section.sectionDuration}</span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Negative Marking:</span>
//                 <span className="text-sm">{section.negativeMarking.value}</span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Partial Marking:</span>
//                 {section.partialMarking ? (
//                   <Check className="w-5 h-5 text-green-500" />
//                 ) : (
//                   <XCircle className="w-5 h-5 text-red-500" />
//                 )}
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Cut off marks:</span>
//                 <span className="text-sm">{section.cutoffMarking.value}</span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Total Marks:</span>
//                 <span className="text-sm">{section.totalMark}</span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <button className="w-full mt-4 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
//         Start Assessment
//       </button>
//     </div>
//   );
// };

// export default AssessmentPreview;




import React from 'react';
import { Clock, SwitchCamera, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssessmentPreviewProps {
  assessment?: {
    assessmentDuration: string,
    assessmentPreview: string,
    canSwitchSections: boolean,
    sections: {
      subject: string,
      sectionDesc: string,
      sectionDuration: string,
      negativeMarking: {
        checked: boolean,
        value: string
      },
      partialMarking: boolean,
      cutoffMarking: {
        checked: boolean,
        value: string
      },
      totalMark: string
    }[]
  }
}

const defaultAssessment = {
  assessmentDuration: "20 min",
  assessmentPreview: "5 min",
  canSwitchSections: true,
  sections: [{
    subject: "Biology",
    sectionDesc: "Challenge your understanding of the chapter  with this test. Dive into topics such as the structure of the eye, vision mechanisms, common visual defects, and their corrections. Sharpen your knowledge and prepare effectively!",
    sectionDuration: "N/A",
    negativeMarking: {
      checked: true,
      value: "0.1"
    },
    partialMarking: true,
    cutoffMarking: {
      checked: true,
      value: "08"
    },
    totalMark: "20"
  }]
};

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment = defaultAssessment }) => {
  const section = assessment.sections[0];

  return (
    <div className="max-w-md mx-auto bg-white">
      <Card className="shadow-none border-0">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-base font-medium">Assessment Instructions:</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ol className="list-decimal pl-4 space-y-1 text-sm">
            <li>Attempt All Questions: Answer all questions. Ensure accuracy and completeness in each response.</li>
            <li>Objective Format: All questions are multiple-choice. Select the best answer for each question.</li>
            <li>Single Attempt Only: This Assessment allows for one submission, you cannot change your answers.</li>
            <li>Negative Marking: Incorrect answers may result in a deduction of points.</li>
            <li>Submission Guidelines: Double-check all answers before submitting. Click Submit only when you are ready.</li>
            <li>No External Help: This is an individual Assessment. Using textbooks, notes, or assistance from others is not permitted.</li>
            <li>Stay Focused: Avoid switching tabs or leaving the exam screen, as it may be flagged as suspicious behavior.</li>
          </ol>
        </CardContent>
      </Card>

      <div className="px-4 py-2 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Entire Assessment duration</span>
          </div>
          <span>{assessment.assessmentDuration}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Assessment Preview</span>
          </div>
          <span>{assessment.assessmentPreview}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <SwitchCamera className="w-4 h-4" />
            <span>Switch between sections</span>
          </div>
          <Check className="w-4 h-4 text-green-500" />
        </div>
      </div>

      <div className="mt-2">
        <div className="px-4 py-2 bg-gray-50">
          <span className="text-sm font-medium">{section.subject}</span>
        </div>
        
        <div className="p-4 space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">Section Description:</p>
            <p className="text-gray-600">{section.sectionDesc}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Section Duration:</span>
              <span>{section.sectionDuration}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Negative Marking:</span>
              <div className="flex items-center gap-1">
                {section.negativeMarking.checked && <Check className="w-4 h-4 text-green-500" />}
                <span>{section.negativeMarking.value}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Partial Marking</span>
              {section.partialMarking && <Check className="w-4 h-4 text-green-500" />}
            </div>
              
            <div className="flex items-center justify-between">
              <span>Cut off marks:</span>
              <div className="flex items-center gap-1">
                {section.cutoffMarking.checked && <Check className="w-4 h-4 text-green-500" />}
                <span>{section.cutoffMarking.value}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Total Marks:</span>
              <span>{section.totalMark}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default AssessmentPreview;