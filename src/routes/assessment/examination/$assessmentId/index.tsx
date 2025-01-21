import { createFileRoute } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'

import InstructionPage from '@/components/common/instructionPage/InstructionPage'
import AssessmentInterface from '@/components/common/section/test'
import dummyAssessment from '../-utils.ts/dummyData'
import AssessmentWrapper from '@/components/common/section/test'
import Page from '@/components/common/questionLiveTest/page'
import { AssessmentPreview } from '@/components/common/questionLiveTest/assessment-preview'
// import { AssessmentPreview } from '@/components/common/questionLiveTest/assessment-preview'

export const Route = createFileRoute('/assessment/examination/$assessmentId/')({
  component: RouteComponent,
})
const assessmentPreview  = true
function RouteComponent() {
  return <AssessmentPreview />
  // return <InstructionPage assessment={dummyAssessment[0]} />
  // return <AssessmentInterface assessmentData={assessments[0]} />
  // return <dummyAssessment />
  // return <AssessmentWrapper/>
  // return <Page />
}

// function RouteComponent() {
//   // Function to handle the completion of the preview
//   const handlePreviewComplete = () => {
//     console.log("Preview complete. Redirecting to the main test page...")
//     // Implement navigation to the test interface or the desired page here
//   }

//   // Render the appropriate component based on `assessmentPreview`
//   return assessmentPreview ? (
//     <AssessmentPreview onPreviewComplete={handlePreviewComplete} />
//   ) : (
//     <Page />
//   )

// }
// import { createFileRoute } from '@tanstack/react-router'
// import { useParams, useLocation } from '@tanstack/react-router';
// import InstructionPage from '@/components/common/instructionPage/InstructionPage';
// import dummyAssessment from '../-utils.ts/dummyData';

// export const Route = createFileRoute('/assessment/examination/$assessmentId/')({
//   component: RouteComponent,
// });

// function RouteComponent() {
//   const { assessmentId } = useParams(); // Get the dynamic ID
//   const location = useLocation(); // Access the passed state
//   const { index } = location.state || {}; // Retrieve the passed index

//   // Use the index to fetch the corresponding assessment
//   const selectedAssessment = index !== undefined ? dummyAssessment[index] : dummyAssessment[0]; // Fallback to the first assessment

//   return <InstructionPage assessment={selectedAssessment} />;
// }
