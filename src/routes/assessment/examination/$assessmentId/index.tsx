import { createFileRoute } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'

import InstructionPage from '@/components/common/instructionPage/InstructionPage'
import AssessmentInterface from '@/components/common/section/test'
import dummyAssessment from '../-utils.ts/dummyData'
import AssessmentWrapper from '@/components/common/section/test'
import Page from '@/components/common/Questions/page'

export const Route = createFileRoute('/assessment/examination/$assessmentId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InstructionPage assessment={dummyAssessment[0]} />
  // return <AssessmentInterface assessmentData={assessments[0]} />
  // return <dummyAssessment />
  // return <AssessmentWrapper/>
  // return <Page />
}
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
