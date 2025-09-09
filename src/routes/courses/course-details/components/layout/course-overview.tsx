import { Steps } from "@phosphor-icons/react";
import { getTerminology } from "@/components/common/layout-container/sidebar/utils";
import { ContentTerms, SystemTerms } from "@/types/naming-settings";
import { MyButton } from "@/components/design-system/button";
import { AuthModal } from "@/components/common/auth/modal/AuthModal";

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

interface CourseOverviewProps {
    courseOverviewShowSlidesData: boolean;
    levelOptions: LevelOption[];
    selectedLevel: string;
    slideCountQuery: {
        isLoading: boolean;
        error: any;
    };
    processedSlideCounts: SlideCount[];
    getSlideTypeIcon: (sourceType: string) => JSX.Element;
    courseId?: string;
    variant?: 'mobile' | 'desktop' | 'both';
    overviewVisible?: boolean;
}

export const CourseOverview = ({
    courseOverviewShowSlidesData,
    levelOptions,
    selectedLevel,
    slideCountQuery,
    processedSlideCounts,
    getSlideTypeIcon,
    courseId,
    variant = 'both',
    overviewVisible = true,
}: CourseOverviewProps) => {
    return (
        <>
            {/* Mobile Overview Card */}
            {(variant === 'mobile' || variant === 'both') && (
            <div className="mb-6">
                <div className="w-full rounded-lg border bg-white p-4 sm:p-6 shadow-lg">
                    <div className="relative">
                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                            <div className="p-1.5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg shadow-sm">
                                <Steps
                                    size={16}
                                    className="text-primary-600"
                                    weight="duotone"
                                />
                            </div>
                            <h2 className="text-sm sm:text-base font-bold text-gray-900">
                                Course Overview
                            </h2>
                        </div>

                        {/* Course Stats */}
                        <div className="space-y-2 sm:space-y-3">
                            {/* Level Badge */}
                            {levelOptions.length > 0 &&
                                selectedLevel &&
                                levelOptions.find(
                                    (option) => option.value === selectedLevel
                                )?.label !== "default" && (
                                    <div className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                                        <div className="flex items-center space-x-2">
                                            <Steps
                                                size={14}
                                                className="text-primary-600"
                                                weight="duotone"
                                            />
                                            <span className="text-xs font-medium text-primary-700">
                                                {getTerminology(
                                                    ContentTerms.Level,
                                                    SystemTerms.Level
                                                ).toLocaleLowerCase()}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-primary-800">
                                            {
                                                levelOptions.find(
                                                    (option) =>
                                                        option.value === selectedLevel
                                                )?.label
                                            }
                                        </span>
                                    </div>
                                )}

                            {/* Slide Counts */}
                            {overviewVisible && (
                                <>
                                    {slideCountQuery.isLoading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg animate-pulse"
                                                >
                                                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                                    <div className="h-3 w-6 bg-gray-200 rounded"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : slideCountQuery.error ? (
                                        <div className="p-2 sm:p-2.5 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-xs text-red-600 font-medium">
                                                Error loading{" "}
                                                {getTerminology(
                                                    ContentTerms.Slides,
                                                    SystemTerms.Slides
                                                ).toLocaleLowerCase()}
                                                counts
                                            </p>
                                        </div>
                                    ) : courseOverviewShowSlidesData ? (
                                        <div className="space-y-2">
                                            {processedSlideCounts.map((count) => (
                                                <div
                                                    key={count.source_type}
                                                    className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-all duration-300 group/item"
                                                >
                                                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                        {getSlideTypeIcon(count.source_type)}
                                                        <span className="text-xs font-medium text-gray-700 truncate">
                                                            {count.display_name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900 ml-2">
                                                        {count.slide_count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <AuthModal
                            type="courseDetailsPage"
                            courseId={courseId}
                            trigger={
                                <MyButton
                                    type="button"
                                    scale="large"
                                    buttonType="primary"
                                    layoutVariant="default"
                                    className="mt-3 sm:mt-4 !min-w-full !w-full"
                                >
                                    Enroll
                                </MyButton>
                            }
                        />
                    </div>
                </div>
            </div>
            )}

            {/* Desktop Overview Card */}
            {(variant === 'desktop' || variant === 'both') && (
            <div className="hidden lg:block">
                <div className="relative bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 group animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>

                    {/* Floating orb effect */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-primary-100/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1 translate-x-3"></div>
                    <div className="relative">
                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="p-1.5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg shadow-sm">
                                <Steps
                                    size={18}
                                    className="text-primary-600"
                                    weight="duotone"
                                />
                            </div>
                            <h2 className="text-base font-bold text-gray-900">
                                Course Overview
                            </h2>
                        </div>

                        {/* Course Stats */}
                        <div className="space-y-2 sm:space-y-3">
                            {/* Level Badge */}
                            {levelOptions.length > 0 &&
                                selectedLevel &&
                                levelOptions.find(
                                    (option) => option.value === selectedLevel
                                )?.label !== "default" && (
                                    <div className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                                        <div className="flex items-center space-x-2">
                                            <Steps
                                                size={14}
                                                className="text-primary-600"
                                                weight="duotone"
                                            />
                                            <span className="text-xs font-medium text-primary-700">
                                                {getTerminology(
                                                    ContentTerms.Level,
                                                    SystemTerms.Level
                                                ).toLocaleLowerCase()}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-primary-800">
                                            {
                                                levelOptions.find(
                                                    (option) =>
                                                        option.value === selectedLevel
                                                )?.label
                                            }
                                        </span>
                                    </div>
                                )}

                            {/* Slide Counts */}
                            {overviewVisible && (
                                <>
                                    {slideCountQuery.isLoading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50 rounded-lg animate-pulse"
                                                >
                                                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                                    <div className="h-3 w-6 bg-gray-200 rounded"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : slideCountQuery.error ? (
                                        <div className="p-2 sm:p-2.5 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-xs text-red-600 font-medium">
                                                Error loading{" "}
                                                {getTerminology(
                                                    ContentTerms.Slides,
                                                    SystemTerms.Slides
                                                ).toLocaleLowerCase()}
                                                counts
                                            </p>
                                        </div>
                                    ) : courseOverviewShowSlidesData ? (
                                        <div className="space-y-2">
                                            {processedSlideCounts.map((count) => (
                                                <div
                                                    key={count.source_type}
                                                    className="flex items-center justify-between p-2 sm:p-2.5 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-all duration-300 group/item"
                                                >
                                                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                        {getSlideTypeIcon(count.source_type)}
                                                        <span className="text-xs font-medium text-gray-700 truncate">
                                                            {count.display_name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900 ml-2">
                                                        {count.slide_count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <AuthModal
                            type="courseDetailsPage"
                            courseId={courseId}
                            trigger={
                                <MyButton
                                    type="button"
                                    scale="large"
                                    buttonType="primary"
                                    layoutVariant="default"
                                    className="mt-3 sm:mt-4 !min-w-full !w-full"
                                >
                                    Enroll
                                </MyButton>
                            }
                        />
                    </div>
                </div>
            </div>
            )}
        </>
    );
};
