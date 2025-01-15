'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Flag, X, AlertCircle } from 'lucide-react'
import { useAssessmentStore } from '@/stores/assessment-store'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { disableBackButton, saveResponse, getResponse } from '@/routes/assessment/examination/-utils.ts/capacitor'



export function QuestionDisplay() {
  const { 
    assessment,
    currentQuestion,
    currentSection,
    responses,
    setAnswer,
    markForReview,
    clearResponse,
    questionStates,
    sectionTimers,
    questionTimers,
    setQuestionTimer,
    updateTimeTaken
  } = useAssessmentStore()

  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    disableBackButton()
  }, [])

  useEffect(() => {
    if (currentQuestion) {
      getResponse(currentQuestion.questionId).then((savedResponse) => {
        if (savedResponse) {
          setAnswer(currentQuestion.questionId, savedResponse[0])
        }
      })
    }
  }, [currentQuestion, setAnswer])

  useEffect(() => {
    if (currentQuestion && assessment?.testDuration.questionWiseDuration?.checked) {
      setTimeLeft(questionTimers[currentQuestion.questionId] || null)
    } else {
      setTimeLeft(null)
    }
  }, [currentQuestion, questionTimers, assessment])

  useEffect(() => {
    if (timeLeft === null || !assessment?.testDuration.questionWiseDuration?.checked) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        updateTimeTaken(currentQuestion!.questionId)
        setQuestionTimer(currentQuestion!.questionId, prev - 1)
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, currentQuestion, setQuestionTimer, updateTimeTaken, assessment])

  const isTimeUp = assessment?.testDuration.sectionWiseDuration?.checked && sectionTimers[currentSection]?.timeLeft === 0

  if (!currentQuestion) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Select a question to begin</p>
        </CardContent>
      </Card>
    )
  }

  if (isTimeUp) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Time is up for this section. Please move to the next available section.
        </AlertDescription>
      </Alert>
    )
  }

  const currentAnswer = responses[currentQuestion.questionId]?.answerId?.[0]
  const isMarkedForReview = questionStates[currentQuestion.questionId]?.isMarkedForReview

  const handleAnswerChange = (value: string) => {
    setAnswer(currentQuestion.questionId, value)
  }

  return (
    <div className="space-y-6 max-w-full">
      {assessment?.testDuration.questionWiseDuration?.checked && timeLeft !== null && (
        <div className="text-lg font-bold">
          Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Question {currentQuestion.questionId.slice(1)} 
            <span className="ml-2 text-sm text-muted-foreground">
              {currentQuestion.questionMark} Marks
            </span>
          </h3>
          <p className="mt-2">{currentQuestion.questionName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={isMarkedForReview ? "text-orange-500" : ""}
            onClick={() => markForReview(currentQuestion.questionId)}
          >
            <Flag className="mr-2 h-4 w-4" />
            Review Later
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearResponse(currentQuestion.questionId)}
            disabled={!currentAnswer}
          >
            <X className="mr-2 h-4 w-4" />
            Clear Response
          </Button>
        </div>
      </div>

      {currentQuestion.imageDetails && currentQuestion.imageDetails.length > 0 && (
        <div className="relative h-64 w-full">
          {/* <Image
            src="/placeholder.svg"
            alt="Question diagram"
            fill
            className="object-contain"
          /> */}
        </div>
      )}

      <RadioGroup
        value={currentAnswer || ""}
        onValueChange={handleAnswerChange}
        className="space-y-4"
      >
        {currentQuestion.options.map((option) => (
          <div
            key={option.optionId}
            className={`flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent ${
              currentAnswer === option.optionId ? 'bg-accent' : ''
            }`}
          >
            <RadioGroupItem value={option.optionId} id={option.optionId} />
            <Label htmlFor={option.optionId} className="flex-grow cursor-pointer">
              {option.optionName}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

