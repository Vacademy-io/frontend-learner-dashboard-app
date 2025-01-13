

// export function Navbar() {
//   const { assessment } = useAssessmentStore()

//   if (!assessment) return null

//   return (
//     <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//       <div className="flex items-center gap-4">
//         <h2 className="text-lg font-semibold">{assessment.title}</h2>
//       </div>
//       <div className="flex items-center gap-4">
//         <SectionTimer />
//         <Button variant="default">Submit</Button>
//       </div>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SectionTimer } from './section-timer'
import { useAssessmentStore } from '@/stores/assessment-store'
import { SubmitModal } from '@/components/modals/submit-modal'
import { TimesUpModal } from '@/components/modals/times-up-modal'
import { useRouter } from '@tanstack/react-router'




export function Navbar() {
  const router = useRouter()
  const { 
    assessment,
    sectionTimers,
    submitAssessment
  } = useAssessmentStore()
  
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimesUpModal, setShowTimesUpModal] = useState(false)

  if (!assessment) return null

  const isAllTimeUp = Object.values(sectionTimers).every(timer => timer.timeLeft === 0)

  const handleSubmit = () => {
    submitAssessment()
    router.push('/assessment/completed') // Replace with your completion page route
  }

  // Show times up modal when all sections are complete
  if (isAllTimeUp && !showTimesUpModal) {
    setShowTimesUpModal(true)
  }

  return (
    <>
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{assessment.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <SectionTimer />
          <Button 
            variant="default"
            onClick={() => setShowSubmitModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Submit
          </Button>
        </div>
      </div>

      <SubmitModal 
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        onConfirm={handleSubmit}
      />

      <TimesUpModal
        open={showTimesUpModal}
        onOpenChange={setShowTimesUpModal}
        onFinish={handleSubmit}
      />
    </>
  )
}

