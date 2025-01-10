import { createFileRoute } from '@tanstack/react-router'
import InstructionPage from '@/components/common/instructionPage/InstructionPage';
import AssessmentInterface from '@/components/common/section/test';
import assessments from '../-utils.ts/dummyData';
import Assessment from '@/components/common/section/test2';
import AssessmentWrapper from '@/components/common/section/test';
import Page from '@/components/common/Questions/page';


export const Route = createFileRoute('/assessment/examination/$assessment/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <InstructionPage assessment={assessments[0]} />
    // return <AssessmentInterface assessmentData={assessments[0]} />
    // return <Assessment />
    // return <AssessmentWrapper/>
    // return <Page />
}