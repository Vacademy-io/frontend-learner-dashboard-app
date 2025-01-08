import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface AssessmentHeaderProps {
  title: string;
  subject: string;
  duration: string;
}

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  title,
  subject,
  duration
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      <div className="text-sm text-gray-600">
        <p>Subject: {subject}</p>
        <p>Duration: {duration}</p>
      </div>
    </CardHeader>
  </Card>
);
