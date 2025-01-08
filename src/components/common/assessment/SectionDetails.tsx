import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/types/assessment';

interface SectionDetailsProps {
  section: Section;
}

export const SectionDetails: React.FC<SectionDetailsProps> = ({ section }) => (
  <Card className="mb-6">
    <CardContent className="pt-6">
      <h3 className="text-lg font-semibold mb-2">{section.subject}</h3>
      <p className="text-gray-700 mb-4">{section.sectionDesc}</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-2 border-b">
          <span>Duration:</span>
          <span>{section.assesmentDuration}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Total Marks:</span>
          <span>{section.totalMark}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Negative Marking:</span>
          <span>{section.negativeMarking.checked ? `-${section.negativeMarking.value}` : 'No'}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Partial Marking:</span>
          <span>{section.partialMarking ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span>Cut-off Marks:</span>
          <span>{section.cutoffMarking.checked ? section.cutoffMarking.value : 'No'}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
