import { CourseOverview } from "./course-overview";
import { CourseDetailsRatingsComponent } from "./course-details-ratings-page";
import { CourseDetailsFormValues } from "./course-details-schema";

type CourseData = CourseDetailsFormValues['courseData'];

interface LevelOption {
    _id: string;
    value: string;
    label: string;
}

interface SlideCount {
    source_type: string;
    slide_count: number;
    display_name: string;
}

interface CourseSidebarProps {
    // Overview Props
    overviewVisible: boolean;
    courseOverviewShowSlidesData: boolean;
    levelOptions: LevelOption[];
    selectedLevel: string;
    slideCountQuery: {
        isLoading: boolean;
        error: any;
    };
    processedSlideCounts: SlideCount[];
    getSlideTypeIcon: (sourceType: string) => JSX.Element;

    // Enrollment Props
    courseData: CourseData;
    selectedSession: string;
    onEnrollmentClick: () => void;
    courseId?: string;

    // Ratings Props
    ratingsAndReviewsVisible: boolean;
    packageSessionId: string;
    onRatingsLoadingChange: (loading: boolean) => void;
}

export const CourseSidebar = ({
    overviewVisible,
    courseOverviewShowSlidesData,
    levelOptions,
    selectedLevel,
    slideCountQuery,
    processedSlideCounts,
    getSlideTypeIcon,
    courseData,
    selectedSession,
    onEnrollmentClick,
    courseId,
    ratingsAndReviewsVisible,
    packageSessionId,
    onRatingsLoadingChange,
}: CourseSidebarProps) => {
    return (
        <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
                {/* Course Overview */}
                <CourseOverview
                    overviewVisible={overviewVisible}
                    courseOverviewShowSlidesData={courseOverviewShowSlidesData}
                    levelOptions={levelOptions}
                    selectedLevel={selectedLevel}
                    slideCountQuery={slideCountQuery}
                    processedSlideCounts={processedSlideCounts}
                    getSlideTypeIcon={getSlideTypeIcon}
                    courseId={courseId}
                    variant="desktop"
                />


                {/* Ratings & Reviews */}
                {ratingsAndReviewsVisible && packageSessionId && (
                    <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: "1.0s" }}
                    >
                        <CourseDetailsRatingsComponent
                            packageSessionId={packageSessionId}
                            onLoadingChange={onRatingsLoadingChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
