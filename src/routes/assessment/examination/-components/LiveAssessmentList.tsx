import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, CheckCircle2, PauseCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { MyButton } from "@/components/design-system/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Assessment,
  AssessmentCardProps,
  AssessmentListProps,
} from "@/types/assessment";
import assessments from "../-utils.ts/dummyData";

// Helper functions
const getStatusColor = (mode: string, status: string): string => {
  if (status.toLowerCase() !== "active") {
    return "text-orange-600 bg-orange-50";
  }
  return mode.toLowerCase() === "online"
    ? "text-green-600 bg-green-50"
    : "text-gray-600 bg-gray-50";
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status.toLowerCase()) {
    case "active":
      return <CheckCircle2 className="w-4 h-4" />;
    case "paused":
      return <PauseCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

// Card Component
const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  const navigate = useNavigate();
  const {
    assessmentId,
    title,
    mode,
    status,
    startDate,
    endDate,
    subject,
    assessmentDuration,
  } = assessment;

  const handleJoinAssessment = () => {
    navigate({ to: `/assessment/examination/${assessmentId}` });
  };

  return (
    <Card className="w-full p-6 space-y-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex gap-3">
      <div
        className={`flex items-center gap-1.5 text-sm ${getStatusColor(
        mode,
        status
        )} px-3 py-1 rounded-full`}
      >
        <Circle
        className={`w-4 h-4 ${
          mode.toLowerCase() === "online" ? "fill-current" : ""
        }`}
        />
        <span>{mode}</span>
      </div>
      <div
        className={`flex items-center gap-1.5 text-sm ${getStatusColor(
        mode,
        status
        )} px-3 py-1 rounded-full`}
      >
        {getStatusIcon(status)}
        <span>{status}</span>
      </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
      <div>
        <div>Start Date and Time: {startDate}</div>
        <div>End Date and Time: {endDate}</div>
      </div>
      <div>Subject: {subject}</div>
      <div>Duration: {assessmentDuration}</div>
      </div>
      <MyButton
      buttonType="secondary"
      className="w-full"
      disabled={status.toLowerCase() !== "active"}
      onClick={handleJoinAssessment}
      >
      Join Assessment
      </MyButton>
    </Card>
  );
};

// List Component with Pagination
const AssessmentList: React.FC<AssessmentListProps> = ({ assessments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Paginated assessments
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssessments = assessments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(assessments.length / itemsPerPage);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentAssessments.map((assessment) => (
          <AssessmentCard
            key={assessment.assessmentId}
            assessment={assessment}
          />
        ))}
      </div>
      <Pagination>
        <PaginationPrevious
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        />
        <PaginationContent>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index} isCurrent={index + 1 === currentPage}>
              <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && <PaginationEllipsis />}
        </PaginationContent>
        <PaginationNext
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      </Pagination>
    </div>
  );
};

const LiveAssessmentList: React.FC = () => {
  return <AssessmentList assessments={assessments} />;
};
export default LiveAssessmentList;
