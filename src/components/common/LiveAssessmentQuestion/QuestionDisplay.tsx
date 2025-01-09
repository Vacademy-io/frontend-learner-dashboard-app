
  // components/QuestionDisplay.tsx
  import React from 'react';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Label } from "@/components/ui/label";
  import { Question } from '../types';
  import { useAssessmentStore } from '../store/assessment-store';
  
  interface QuestionDisplayProps {
    question: Question;
  }
  
  export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
    const { markQuestion } = useAssessmentStore();
  
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Question {question.questionId.replace('Q', '')}</span>
            <span>Marks: {question.questionMark}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{question.questionName}</p>
          <RadioGroup
            onValueChange={() => 
              markQuestion(question.questionId, { answered: true, visited: true })
            }
          >
            {question.options.map((option) => (
              <div key={option.optionId} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option.optionId} id={option.optionId} />
                <Label htmlFor={option.optionId}>{option.optionName}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };
  