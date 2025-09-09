import { CourseStructureDetails } from "./course-structure-details";
import { CourseContentSections } from "./course-content-sections";
import { CourseDetailsFormValues } from "../../types/course-details-schema";

type CourseData = CourseDetailsFormValues['courseData'];

interface LevelOption {
    _id: string;
    value: string;
    label: string;
}

interface CourseContentProps {
    // Course Structure Props
    selectedSession: string;
    selectedLevel: string;
    courseStructure: number;
    courseData: CourseData;
    fullFormData: CourseDetailsFormValues; // Add this for CourseStructureDetails
    packageSessionId: string;
    selectedTab: string;
    showCourseContentPrefixes: boolean;
    filteredTabs: Array<{ label: string; value: string }>;
    onModulesLoadingChange: (loading: boolean) => void;
    // Authentication props
    isEnrolledInCourse: boolean;
    enrolledSessions: Array<any>;
    courseId: string;
}

export const CourseContent = ({
    selectedSession,
    selectedLevel,
    courseStructure,
    courseData,
    fullFormData,
    packageSessionId,
    selectedTab,
    showCourseContentPrefixes,
    filteredTabs,
    onModulesLoadingChange,
    isEnrolledInCourse,
    enrolledSessions,
    courseId,
}: CourseContentProps) => {
    return (
        <div className="space-y-6">
            {/* Course Structure */}
            <CourseStructureDetails
                selectedSession={selectedSession}
                selectedLevel={selectedLevel}
                courseStructure={courseStructure}
                courseData={fullFormData}
                packageSessionId={packageSessionId}
                selectedTab={selectedTab}
                showCourseContentPrefixes={showCourseContentPrefixes}
                filteredTabs={filteredTabs}
                onModulesLoadingChange={onModulesLoadingChange}
                isEnrolledInCourse={isEnrolledInCourse}
                enrolledSessions={enrolledSessions}
                courseId={courseId}
            />

            {/* Course Content Sections */}
            <CourseContentSections
                courseData={courseData}
            />

        </div>
    );
};
