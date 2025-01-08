// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from '@tanstack/react-router';
// import { Assessment } from '@/types/assessment';
// import { AssessmentHeader } from './AssessmentHeader';
// import { AssessmentInstructions } from './AssessmentInstructions';
// import { SectionDetails } from './SectionDetails';

// interface InstructionPageProps {
//   assessment: Assessment;
// }

// const InstructionPage: React.FC<InstructionPageProps> = ({ assessment }) => {
//   const navigate = useNavigate();

//   const handleStartAssessment = () => {
//     navigate({
//       to: `/assessment/examination/${assessment.assessmentId}/questions`,
//       params: { assessmentId: assessment.assessmentId },
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       {/* Assessment Header */}
//       <AssessmentHeader
//         title={assessment.title}
//         subject={assessment.subject}
//         duration={assessment.assessmentDuration}
//       />

//       {/* Instructions */}
//       <AssessmentInstructions
//         instructions={assessment.assessmentInstruction}
//         preview={assessment.assessmentPreview}
//         canSwitchSections={assessment.canSwitchSections}
//       />

//       {/* Section Details */}
//       <div className="space-y-6">
//         {assessment.sections.map((section, index) => (
//           <SectionDetails key={index} section={section} />
//         ))}
//       </div>

//       {/* Start Assessment Button */}
//       <Button
//         className="w-full bg-orange-500 hover:bg-orange-600 text-white"
//         onClick={handleStartAssessment}
//       >
//         Start Assessment
//       </Button>
//     </div>
//   );
// };

// export default InstructionPage;
