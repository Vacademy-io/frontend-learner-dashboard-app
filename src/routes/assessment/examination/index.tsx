import { LayoutContainer } from '@/components/common/layout-container/layout-container'
import { createFileRoute } from '@tanstack/react-router'
import { ScheduleTestMainComponent } from './-components/ScheduleTestMainComponent'
import { ScrollRestoration } from '@tanstack/react-router'

export const Route = createFileRoute('/assessment/examination/')({
  component: () => (
    <LayoutContainer>
      <ScrollRestoration />
      <ScheduleTestMainComponent />
    </LayoutContainer>
  ),
})

// export const LiveTestsRoute = createFileRoute('/assessment/examination/')({
//   component: () => (
//     <LayoutContainer>
//       <ScrollRestoration />
//       <LiveAssessmentList />
//     </LayoutContainer>
//   ),
// })

// import { LayoutContainer } from '@/components/common/layout-container/layout-container'
// import { createFileRoute } from '@tanstack/react-router'
// import { ScheduleTestMainComponent } from './-components/ScheduleTestMainComponent'
// import { LiveAssessmentList } from './-components/LiveAssessmentList' // Import Live Tests component
// import { ScrollRestoration } from '@tanstack/react-router'

// // Main Examination Route
// export const ExaminationRoute = createFileRoute('/assessment/examination/')({
//   component: () => (
//     <LayoutContainer>
//       <ScrollRestoration />
//       <ScheduleTestMainComponent />
//     </LayoutContainer>
//   ),
// })

// Live Tests Route
// export const LiveTestsRoute = createFileRoute('/assessment/examination/')({
//   component: () => (
//     <LayoutContainer>
//       <ScrollRestoration />
//       <LiveAssessmentList />
//     </LayoutContainer>
//   ),
// })
