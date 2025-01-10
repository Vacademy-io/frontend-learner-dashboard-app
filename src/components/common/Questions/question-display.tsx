// import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Flag, X } from 'lucide-react'
import { useAssessmentStore } from '@/stores/assessment-store'

export function QuestionDisplay() {
  const { 
    currentQuestion, 
    answers, 
    setAnswer, 
    markForReview,
    clearResponse,
    questionStates 
  } = useAssessmentStore()

  if (!currentQuestion) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Select a question to begin</p>
        </CardContent>
      </Card>
    )
  }

  const currentAnswer = answers[currentQuestion.questionId]
  const isMarkedForReview = questionStates[currentQuestion.questionId]?.isMarkedForReview

  return (
    <div className="space-y-6">
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
          <h1>img</h1>
        </div>
      )}

      <RadioGroup
        value={currentAnswer || ""}
        onValueChange={(value) => setAnswer(currentQuestion.questionId, value)}
        className="space-y-4"
      >
        {currentQuestion.options.map((option) => (
          <div
            key={option.optionId}
            className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent"
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

