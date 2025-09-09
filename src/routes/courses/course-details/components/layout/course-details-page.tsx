import { useRouter } from "@tanstack/react-router";
import {
    Code,
    File,
    FilePdf,
    PlayCircle,
    Question,
    Presentation,
    GameController,
    Exam,
    Terminal,
    ClipboardText,
    FileDoc,
    Notebook,
} from "phosphor-react";
import { toTitleCase } from "@/lib/utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    CourseDetailsFormValues,
    courseDetailsSchema,
} from "../../types/course-details-schema";
import {
    VideoSlide,
    DocumentSlide,
    QuestionSlide,
    AssignmentSlide,
} from "../../-services/getAllSlides";
import { useQuery } from "@tanstack/react-query";
import {
    getIdByLevelAndSession,
    transformApiDataToCourseData,
} from "../../-utils/helper";
import { handleGetAllCourseDetails } from "../../-services/get-course-details";
import axios from "axios";
import { urlInstituteDetails } from "@/constants/urls";
import CourseListHeader from "../../../-component/CourseListHeader";
import { handleGetSlideCountDetails } from "../../-services/get-slides-count";
import {
    BatchForSessionType,
    InstituteDetailsType,
} from "@/types/institute-details/institute-details-interface";
import { CourseStructureResponse } from "@/types/institute-details/course-details-interface";
import { getTerminology } from "@/components/common/layout-container/sidebar/utils";
import { ContentTerms, SystemTerms } from "@/types/naming-settings";
import { getTokenFromStorage } from "@/lib/auth/sessionUtility";
import { TokenKey } from "@/constants/auth/tokens";
import { Preferences } from "@capacitor/preferences";
import { getSubdomain } from "@/helpers/helper";
import { handleGetInstituteIdWithLocalStorageCheck } from "../../../-services/courses-services";
import { DashboardLoader } from "@/components/core/dashboard-loader";
import { getStudentDisplaySettings, inspectStudentDisplaySettingsCache, clearStudentDisplaySettingsCache } from "@/services/student-display-settings";
import { getPublicCourseDetailsSettings } from "../../-services/get-public-institute-settings";
import { useEnrollmentStatus } from "@/hooks/use-enrollment-status";
import { CourseHeader } from "./course-header";
import { CourseOverview } from "./course-overview";
import { CourseContent } from "../content/course-content";
import { CourseSidebar } from "./course-sidebar";
import { CourseEnrollment } from "./course-enrollment";
import { CourseContentSections } from "../content/course-content-sections";
import { VideoPlayer } from "../media/course-details-video-player";
import { CourseDetailsRatingsComponent } from "../ratings/course-details-ratings-page";

type SlideType = {
    id: string;
    name: string;
    type: string;
    description: string;
    status: string;
    order: number;
    videoSlide?: VideoSlide;
    documentSlide?: DocumentSlide;
    questionSlide?: QuestionSlide;
    assignmentSlide?: AssignmentSlide;
};

export type ChapterType = {
    id: string;
    name: string;
    status: string;
    file_id: string;
    description: string;
    chapter_order: number;
    slides: SlideType[];
    isOpen?: boolean;
};

export type ModuleType = {
    id: string;
    name: string;
    description: string;
    status: string;
    thumbnail_id: string;
    chapters: ChapterType[];
    isOpen?: boolean;
};

export type SubjectType = {
    id: string;
    subject_name: string;
    subject_code: string;
    credit: number;
    thumbnail_id: string | null;
    created_at: string | null;
    updated_at: string | null;
    modules: ModuleType[];
};

type Course = {
    id: string;
    title: string;
    level: 1 | 2 | 3 | 4 | 5;
    structure: {
        courseName: string;
        items: SubjectType[] | ModuleType[] | ChapterType[] | SlideType[];
    };
};

type SlideCountType = {
    slide_count: number;
    source_type: string;
};

const mockCourses: Course[] = [
    {
        id: "1",
        title: `2-Level ${getTerminology(
            ContentTerms.Course,
            SystemTerms.Course
        )} Structure`,
        level: 2,
        structure: {
            courseName: "Introduction to Web Development",
            items: [] as SlideType[],
        },
    },
    {
        id: "2",
        title: `3-Level ${getTerminology(
            ContentTerms.Course,
            SystemTerms.Course
        )} Structure`,
        level: 3,
        structure: {
            courseName: "Frontend Fundamentals",
            items: [] as SlideType[],
        },
    },
    {
        id: "3",
        title: `4-Level ${getTerminology(
            ContentTerms.Course,
            SystemTerms.Course
        )} Structure`,
        level: 4,
        structure: {
            courseName: "Full-Stack JavaScript Development Mastery",
            items: [] as ModuleType[],
        },
    },
    {
        id: "4",
        title: `5-Level ${getTerminology(
            ContentTerms.Course,
            SystemTerms.Course
        )} Structure`,
        level: 5,
        structure: {
            courseName: "Advanced Software Engineering Principles",
            items: [] as SubjectType[],
        },
    },
];

export const CourseDetailsPage = () => {
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const router = useRouter();
    const searchParams = router.state.location.search;
    const subdomain = getSubdomain(window.location.hostname);
    
    // Authentication state management
    const [instituteId, setInstituteId] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState<string>("");
    
    // Use enrollment status hook for authentication state
    const {
        enrolledSessions,
        addEnrolledSession,
        isEnrolledInCourse,
    } = useEnrollmentStatus(instituteId);


    // Loading state management
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState({
        instituteDetails: false,
        courseDetails: false,
        slideCount: false,
        modulesData: false,
        ratingsData: false,
        userData: false,
        settings: false,
    });

    // Student display settings flags
    const [overviewVisible, setOverviewVisible] = useState<boolean>(true);
    const [showCourseContentPrefixes, setShowCourseContentPrefixes] = useState<boolean>(true);
    const [courseOverviewShowSlidesData, setCourseOverviewShowSlidesData] = useState<boolean>(true);
    const [ratingsAndReviewsVisible, setRatingsAndReviewsVisible] = useState<boolean>(true);
    const [showCourseConfiguration, setShowCourseConfiguration] = useState<boolean>(true);
    
    const [filteredTabs, setFilteredTabs] = useState<Array<{label: string; value: string}>>([]);
    const [selectedTab, setSelectedTab] = useState<string>("OUTLINE");
    
    // Additional state for course enrollment
    const [hasRightSidebar, setHasRightSidebar] = useState<boolean>(true);
    
    // Make sidebar responsive - hidden on mobile, visible on desktop
    useEffect(() => {
        const checkScreenSize = () => {
            setHasRightSidebar(window.innerWidth >= 1024); // lg breakpoint
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    const [paymentType, setPaymentType] = useState<string | null>(null);
    const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
    const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState<boolean>(false);

    // Function to update loading states
    const updateLoadingState = useCallback(
        (key: keyof typeof loadingStates, value: boolean) => {
            setLoadingStates((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    // Check if all loading states are complete
    const isAllLoadingComplete = useMemo(() => {
        return Object.values(loadingStates).every((state) => !state);
    }, [loadingStates]);

    // Update main loading state when all individual states are complete
    useEffect(() => {
        if (isAllLoadingComplete) {
            setIsLoading(false);
        }
    }, [isAllLoadingComplete]);

    // Initialize authentication state
    useEffect(() => {
        const fetchInstituteAndUserId = async () => {
            updateLoadingState("userData", true);
            try {
                const instituteResult = await Preferences.get({
                    key: "InstituteId",
                });
                setInstituteId(instituteResult.value || null);

                // Fetch authentication token
                const token = await getTokenFromStorage(TokenKey.accessToken);
                if (token) {
                    setAuthToken(token);
                }
            } catch (error) {
                console.error("Error fetching authentication data:", error);
            } finally {
                updateLoadingState("userData", false);
            }
        };

        fetchInstituteAndUserId();
    }, [updateLoadingState]);




    // Memoized callback functions for child components
    const handleModulesLoadingChange = useCallback(
        (loading: boolean) => {
            updateLoadingState("modulesData", loading);
        },
        [updateLoadingState]
    );

    const handleRatingsLoadingChange = useCallback(
        (loading: boolean) => {
            updateLoadingState("ratingsData", loading);
        },
        [updateLoadingState]
    );

    // Get instituteId from API using subdomain - Changed from useSuspenseQuery to useQuery to prevent infinite re-renders
    const { data: instituteIdFromApi, isLoading: isLoadingInstituteId } =
        useQuery(
            handleGetInstituteIdWithLocalStorageCheck({
                subdomain: subdomain || "",
            })
        );


    // Update institute ID loading state
    useEffect(() => {
        updateLoadingState("userData", isLoadingInstituteId);
    }, [isLoadingInstituteId, updateLoadingState]);

    // Update instituteId state when data is available
    useEffect(() => {
        if (instituteIdFromApi) {
            setInstituteId(instituteIdFromApi);
        }
    }, [instituteIdFromApi]);

    // Fetch settings when institute ID becomes available
    useEffect(() => {
        // Also try to get institute ID from Capacitor storage as fallback
        const fetchSettingsWithFallback = async () => {
            let effectiveInstituteId = instituteId;
            
            if (!effectiveInstituteId) {
                try {
                    const { Preferences } = await import('@capacitor/preferences');
                    const instituteResult = await Preferences.get({ key: 'InstituteId' });
                    effectiveInstituteId = instituteResult.value;
                    
                    if (effectiveInstituteId) {
                    }
                } catch (error) {
                    console.warn(`⚠️ [Course Details - Logout State] Failed to get institute ID from Capacitor:`, error);
                }
            }

            if (!effectiveInstituteId) {
                // Set defaults when no institute ID is available
                setOverviewVisible(true);
                setShowCourseContentPrefixes(true);
                setCourseOverviewShowSlidesData(true);
                setRatingsAndReviewsVisible(true);
                setFilteredTabs([
                    { label: "Outline", value: "OUTLINE" },
                    { label: "Content Structure", value: "CONTENT_STRUCTURE" },
                    { label: "Teachers", value: "TEACHERS" },
                    { label: "Assessment", value: "ASSESSMENTS" },
                ]);
                setSelectedTab("OUTLINE");
                return;
            }


            // Debug: Inspect current cache
            inspectStudentDisplaySettingsCache(effectiveInstituteId);

            // Check if user is authenticated (has token)
            const hasAuthToken = authToken && authToken.trim() !== "";
            
            if (hasAuthToken) {
                // User is authenticated, use the authenticated API

            // Track settings source by checking cache first - use the specific institute cache key
            const hasCachedSettings = localStorage.getItem(`STUDENT_DISPLAY_SETTINGS_CACHE_V1:${effectiveInstituteId}`) !== null;
            
            getStudentDisplaySettings(true, effectiveInstituteId) // Force refresh to get backend settings
            .then((settings) => {
                // Use the actual source from the service
                const settingsSource = settings._source || 'UNKNOWN';
                
                

                const cd = settings?.courseDetails;
                if (cd) {
                        // Match study-library pattern: overviewVisible only controls sidebar
                    const resolvedOverviewVisible = cd.courseOverview?.visible ?? true;
                    const resolvedShowCourseContentPrefixes = cd.showCourseContentPrefixes ?? true;
                    const resolvedCourseOverviewShowSlidesData = cd.courseOverview?.showSlidesData ?? true;
                    const resolvedRatingsAndReviewsVisible = cd.ratingsAndReviewsVisible ?? true;
                        const resolvedShowCourseConfiguration = cd.showCourseConfiguration ?? true;
                    
                    setOverviewVisible(resolvedOverviewVisible);
                    setShowCourseContentPrefixes(resolvedShowCourseContentPrefixes);
                    setCourseOverviewShowSlidesData(resolvedCourseOverviewShowSlidesData);
                    setRatingsAndReviewsVisible(resolvedRatingsAndReviewsVisible);
                    setShowCourseConfiguration(resolvedShowCourseConfiguration);

                    // Handle tabs configuration - match study-library logic
                    const tabsSetting = cd.tabs || [];
                    const ordered = tabsSetting
                        .filter((t) => t.visible !== false)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((t) => ({
                            label: t.label || t.id,
                            value: t.id,
                        }));

                    if (ordered.length) {
                        setFilteredTabs(ordered);
                        const defaultTabId = cd.defaultTab || "OUTLINE";
                        const isDefaultVisible = ordered.some((t) => t.value === defaultTabId);
                        const firstVisible = ordered[0]?.value || "OUTLINE";
                        const resolvedDefault = isDefaultVisible ? defaultTabId : firstVisible;
                        setSelectedTab(resolvedDefault);
                    }

                } else {
                        // Set defaults
                        setOverviewVisible(true);
                        setShowCourseContentPrefixes(true);
                        setCourseOverviewShowSlidesData(true);
                        setRatingsAndReviewsVisible(true);
                        setShowCourseConfiguration(true);
                        setFilteredTabs([
                            { label: "Outline", value: "OUTLINE" },
                            { label: "Content Structure", value: "CONTENT_STRUCTURE" },
                            { label: "Teachers", value: "TEACHERS" },
                            { label: "Assessment", value: "ASSESSMENT" },
                        ]);
                        setSelectedTab("OUTLINE");
                }
            })
            .catch((error) => {
                console.warn(`❌ [Course Details - Logout State] Settings fetch failed, using defaults`, {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    effectiveInstituteId,
                    source: 'DEFAULTS_FALLBACK',
                    timestamp: new Date().toISOString()
                });
                setOverviewVisible(true);
                setShowCourseContentPrefixes(true);
                setCourseOverviewShowSlidesData(true);
                setRatingsAndReviewsVisible(true);
                setFilteredTabs([
                    { label: "Outline", value: "OUTLINE" },
                    { label: "Content Structure", value: "CONTENT_STRUCTURE" },
                    { label: "Teachers", value: "TEACHERS" },
                    { label: "Assessment", value: "ASSESSMENTS" },
                ]);
                setSelectedTab("OUTLINE");
            });
            } else {
                // User is not authenticated, use the public API
                
                try {
                    const settings = await getPublicCourseDetailsSettings(effectiveInstituteId);
                    

                const cd = settings?.courseDetails;
                if (cd) {
                        // Match study-library pattern: overviewVisible only controls sidebar
                    const resolvedOverviewVisible = cd.courseOverview?.visible ?? true;
                    const resolvedShowCourseContentPrefixes = cd.showCourseContentPrefixes ?? true;
                    const resolvedCourseOverviewShowSlidesData = cd.courseOverview?.showSlidesData ?? true;
                    const resolvedRatingsAndReviewsVisible = cd.ratingsAndReviewsVisible ?? true;
                        const resolvedShowCourseConfiguration = cd.showCourseConfiguration ?? true;
                    
                    setOverviewVisible(resolvedOverviewVisible);
                    setShowCourseContentPrefixes(resolvedShowCourseContentPrefixes);
                    setCourseOverviewShowSlidesData(resolvedCourseOverviewShowSlidesData);
                    setRatingsAndReviewsVisible(resolvedRatingsAndReviewsVisible);
                        setShowCourseConfiguration(resolvedShowCourseConfiguration);

                    // Handle tabs configuration - match study-library logic
                    const tabsSetting = cd.tabs || [];
                    const ordered = tabsSetting
                        .filter((t) => t.visible !== false)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((t) => ({
                            label: t.label || t.id,
                            value: t.id,
                        }));

                    if (ordered.length) {
                        setFilteredTabs(ordered);
                        const defaultTabId = cd.defaultTab || "OUTLINE";
                        const isDefaultVisible = ordered.some((t) => t.value === defaultTabId);
                        const firstVisible = ordered[0]?.value || "OUTLINE";
                        const resolvedDefault = isDefaultVisible ? defaultTabId : firstVisible;
                        setSelectedTab(resolvedDefault);
                    }

                } else {
                        // Set defaults
                        setOverviewVisible(true);
                        setShowCourseContentPrefixes(true);
                        setCourseOverviewShowSlidesData(true);
                        setRatingsAndReviewsVisible(true);
                        setShowCourseConfiguration(true);
                        setFilteredTabs([
                            { label: "Outline", value: "OUTLINE" },
                            { label: "Content Structure", value: "CONTENT_STRUCTURE" },
                            { label: "Teachers", value: "TEACHERS" },
                            { label: "Assessment", value: "ASSESSMENT" },
                        ]);
                        setSelectedTab("OUTLINE");
                    }
                } catch (error) {
                    console.warn(`❌ [Course Details - Logout State] Public settings fetch failed, using defaults`, {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    effectiveInstituteId,
                    source: 'DEFAULTS_FALLBACK',
                    timestamp: new Date().toISOString()
                });
                setOverviewVisible(true);
                setShowCourseContentPrefixes(true);
                setCourseOverviewShowSlidesData(true);
                setRatingsAndReviewsVisible(true);
                setFilteredTabs([
                    { label: "Outline", value: "OUTLINE" },
                    { label: "Content Structure", value: "CONTENT_STRUCTURE" },
                    { label: "Teachers", value: "TEACHERS" },
                    { label: "Assessment", value: "ASSESSMENTS" },
                ]);
                setSelectedTab("OUTLINE");
                }
            }
        };

        fetchSettingsWithFallback();
    }, [instituteId, authToken]);

    const [
        packageSessionIdForCurrentLevel,
        setPackageSessionIdForCurrentLevel,
    ] = useState<string | null>(null);

    const findIdByPackageId = (data: BatchForSessionType[]) => {
        const result = data?.find(
            (item) => item.package_dto?.id === searchParams.courseId
        );
        return result?.id || "";
    };

    const [packageSessionIds, setPackageSessionIds] = useState<string | null>(
        null
    );

    const [instituteDetails, setInstituteDetails] =
        useState<InstituteDetailsType | null>(null);

    // ✅ Fetch institute details
    useEffect(() => {
        if (!instituteId) return; // Don't fetch if instituteId is not available

        const fetchInstituteDetails = async () => {
            updateLoadingState("instituteDetails", true);
            try {
                const response = await axios.get(
                    `${urlInstituteDetails}/${instituteId}`
                );
                setPackageSessionIds(
                    findIdByPackageId(response.data.batches_for_sessions)
                );
                setInstituteDetails(response?.data);
                setPackageSessionIdForCurrentLevel(
                    getIdByLevelAndSession(
                        response?.data?.batches_for_sessions,
                        selectedSession,
                        selectedLevel,
                        searchParams?.courseId || ""
                    )
                );
            } catch (error) {
            } finally {
                updateLoadingState("instituteDetails", false);
            }
        };

        fetchInstituteDetails();
    }, [instituteId, selectedSession, selectedLevel, updateLoadingState]);

    // Only run the query if instituteId is available
    const { data: studyLibraryData, isLoading: isCourseDetailsLoading } =
        useQuery({
            ...handleGetAllCourseDetails({
                instituteId: instituteId || "",
            }),
            enabled: !!instituteId, // Only run query when instituteId is available
        });

    // Update course details loading state
    useEffect(() => {
        updateLoadingState("courseDetails", isCourseDetailsLoading);
    }, [isCourseDetailsLoading, updateLoadingState]);

    const courseDetailsData = useMemo(() => {
        return studyLibraryData?.find(
            (item: CourseStructureResponse) =>
                item.course.id === searchParams.courseId
        );
    }, [studyLibraryData]);

    const form = useForm<CourseDetailsFormValues>({
        resolver: zodResolver(courseDetailsSchema),
        defaultValues: {
            courseData: {
                id: "",
                title: "",
                description: "",
                tags: [],
                imageUrl: "",
                courseStructure: 1,
                whatYoullLearn: "",
                whyLearn: "",
                whoShouldLearn: "",
                aboutTheCourse: "",
                packageName: "",
                status: "",
                isCoursePublishedToCatalaouge: false,
                coursePreviewImageMediaId: "",
                courseBannerMediaId: "",
                courseMediaId: "",
                courseHtmlDescription: "",
                instructors: [],
                sessions: [],
            },
            mockCourses: [],
        },
        mode: "onChange",
    });


    const [levelOptions, setLevelOptions] = useState<
        { _id: string; value: string; label: string }[]
    >([]);

    // Convert sessions to select options format
    const sessionOptions = useMemo(() => {
        const sessions = form.getValues("courseData")?.sessions || [];
        return sessions.map((session) => ({
            _id: session.sessionDetails.id,
            value: session.sessionDetails.id,
            label: toTitleCase(session.sessionDetails.session_name),
        }));
    }, [form.watch("courseData.sessions")]);

    // Update level options when session changes
    const handleSessionChange = (sessionId: string) => {
        setSelectedSession(sessionId);
        const sessions = form.getValues("courseData")?.sessions || [];
        const selectedSessionData = sessions.find(
            (session) => session.sessionDetails.id === sessionId
        );

        if (selectedSessionData) {
            const newLevelOptions = selectedSessionData.levelDetails.map(
                (level) => ({
                    _id: level.id,
                    value: level.id,
                    label: level.name,
                })
            );
            setLevelOptions(newLevelOptions);

            // Select the first level when session changes
            if (newLevelOptions.length > 0 && newLevelOptions[0]?.value) {
                setSelectedLevel(newLevelOptions[0].value);
            } else {
                setSelectedLevel("");
            }
        }
    };

    // Handle level change - clear expanded items and reset state
    const handleLevelChange = (levelId: string) => {
        setSelectedLevel(levelId);
    };

    // Set initial session and its levels
    useEffect(() => {
        if (
            sessionOptions.length > 0 &&
            !selectedSession &&
            sessionOptions[0]?.value
        ) {
            const initialSessionId = sessionOptions[0].value;
            handleSessionChange(initialSessionId);
        }
    }, [sessionOptions]);

    useEffect(() => {
        const loadCourseData = async () => {
            if (courseDetailsData?.course) {
                try {
                    const transformedData =
                        await transformApiDataToCourseData(courseDetailsData);
                    if (transformedData) {
                        form.reset({
                            courseData: transformedData,
                            mockCourses: mockCourses,
                        });
                    }
                } catch (error) {
                    console.error("Error transforming course data:", error);
                }
            }
        };

        loadCourseData();
    }, [courseDetailsData]);

    // Add this with other queries at the top level of the component
    const slideCountQuery = useQuery({
        ...handleGetSlideCountDetails(packageSessionIds || ""),
        enabled: !!packageSessionIds,
    });

    // Update slide count loading state
    useEffect(() => {
        updateLoadingState("slideCount", slideCountQuery.isLoading);
    }, [slideCountQuery.isLoading, updateLoadingState]);

    // Custom slide count calculation to handle special document types
    const processedSlideCounts = useMemo(() => {
        if (!slideCountQuery.data) return [];

        const counts = slideCountQuery.data as SlideCountType[];

        const processedCounts: {
            source_type: string;
            slide_count: number;
            display_name: string;
        }[] = [];

        // Create a map to track counts for different types
        const typeCounts: { [key: string]: number } = {};

        // Track if we have specific document types to avoid duplicates
        const hasSpecificDocumentTypes = counts.some(
            (count) =>
                count.source_type === "JUPYTER_NOTEBOOK" ||
                count.source_type === "CODE_EDITOR" ||
                count.source_type === "PRESENTATION" ||
                count.source_type === "SCRATCH_PROJECT"
        );

        counts.forEach((count) => {
            let canonicalType = count.source_type;
            if (canonicalType === "JUPYTER") canonicalType = "JUPYTER_NOTEBOOK";
            if (canonicalType === "SCRATCH") canonicalType = "SCRATCH_PROJECT";
            if (canonicalType === "DOCUMENT") {
                // Only add DOCUMENT count if we don't have specific document types
                // This prevents duplicates when we have JUPYTER_NOTEBOOK, CODE_EDITOR, etc.
                if (!hasSpecificDocumentTypes) {
                    typeCounts["DOCUMENT"] =
                        (typeCounts["DOCUMENT"] || 0) + count.slide_count;
                }
            } else {
                typeCounts[canonicalType] =
                    (typeCounts[canonicalType] || 0) + count.slide_count;
            }
        });

        // Convert the map to the required format
        Object.entries(typeCounts).forEach(([sourceType, slideCount]) => {
            let displayName = "";
            switch (sourceType) {
                case "VIDEO":
                    displayName = "Video slides";
                    break;
                case "CODE":
                    displayName = "Code slides";
                    break;
                case "PDF":
                    displayName = "PDF slides";
                    break;
                case "DOCUMENT":
                    displayName = "DOC slides";
                    break;
                case "QUESTION":
                    displayName = "Question slides";
                    break;
                case "ASSIGNMENT":
                    displayName = "Assignment slides";
                    break;
                case "PRESENTATION":
                    displayName = "Presentation slides";
                    break;
                case "JUPYTER_NOTEBOOK":
                case "JUPYTER":
                    displayName = "Jupyter Notebook slides";
                    break;
                case "SCRATCH_PROJECT":
                case "SCRATCH":
                    displayName = "Scratch Project slides";
                    break;
                case "QUIZ":
                    displayName = "Quiz slides";
                    break;
                case "CODE_EDITOR":
                    displayName = "Code Editor slides";
                    break;
                default:
                    displayName = `${sourceType} slides`;
            }

            processedCounts.push({
                source_type: sourceType,
                slide_count: slideCount,
                display_name: displayName,
            });
        });

        return processedCounts;
    }, [slideCountQuery.data]);

    const getSlideTypeIcon = (type: string) => {
        switch (type) {
            case "VIDEO":
                return (
                    <PlayCircle
                        size={16}
                        className="text-blue-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "CODE":
                return (
                    <Code
                        size={16}
                        className="text-green-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "PDF":
                return (
                    <FilePdf
                        size={16}
                        className="text-red-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "DOCUMENT":
                return (
                    <FileDoc
                        size={16}
                        className="text-purple-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "QUESTION":
                return (
                    <Question
                        size={16}
                        className="text-orange-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "ASSIGNMENT":
                return (
                    <ClipboardText
                        size={16}
                        className="text-indigo-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "PRESENTATION":
                return (
                    <Presentation
                        size={16}
                        className="text-cyan-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "JUPYTER_NOTEBOOK":
            case "JUPYTER":
                return (
                    <Notebook
                        size={16}
                        className="text-yellow-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "SCRATCH_PROJECT":
            case "SCRATCH":
                return (
                    <GameController
                        size={16}
                        className="text-pink-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "QUIZ":
                return (
                    <Exam
                        size={16}
                        className="text-teal-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            case "CODE_EDITOR":
                return (
                    <Terminal
                        size={16}
                        className="text-gray-600 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
            default:
                return (
                    <File
                        size={16}
                        className="text-gray-500 group-hover/item:scale-110 transition-transform duration-300"
                        weight="duotone"
                    />
                );
        }
    };

    // Temporarily disabled automatic redirect to prevent redirect loops
    // useEffect(() => {
    //     const redirectToDashboardIfAuthenticated = async () => {
    //         const token = await getTokenFromStorage(TokenKey.accessToken);
    //         const studentDetails = await Preferences.get({
    //             key: "StudentDetails",
    //         });
    //         const instituteDetails = await Preferences.get({
    //             key: "InstituteDetails",
    //         });

    //         // Only redirect if the user is authenticated and we're not already on a course details page
    //         // This prevents redirect loops and allows users to stay on the public course details page
    //         if (
    //             !isNullOrEmptyOrUndefined(token) &&
    //             !isNullOrEmptyOrUndefined(studentDetails) &&
    //             !isNullOrEmptyOrUndefined(instituteDetails) &&
    //             !window.location.pathname.includes('/study-library/') &&
    //             !window.location.pathname.includes('/course-details')
    //         ) {
    //             // Only redirect if we're coming from a different page, not if we're already on course details
    //             const referrer = document.referrer;
    //             const isComingFromCoursesPage = referrer.includes('/courses') && !referrer.includes('/course-details');
                
    //             if (isComingFromCoursesPage) {
    //             navigate({
    //                 to: "/study-library/courses/course-details",
    //                 search: {
    //                     courseId: searchParams.courseId || "",
    //                 },
    //                 replace: true,
    //             });
    //         }
    //     }
    //     };

    //     redirectToDashboardIfAuthenticated();
    // }, [navigate]);



    // Show loading until essential APIs are complete
    // Note: packageSessionIdForCurrentLevel is not required for initial render
    if (isLoading || isLoadingInstituteId || !instituteId || !studyLibraryData) {
        return <DashboardLoader />;
    }

    // Check if user is enrolled in the current course
    const isUserEnrolledInCourse = isEnrolledInCourse(searchParams.courseId || "");

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-white to-primary-50/20 relative overflow-hidden w-full max-w-full">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-gradient-to-br from-primary-100/20 to-transparent rounded-full blur-3xl animate-gentle-pulse"></div>
                    <div
                        className="absolute bottom-1/3 right-1/3 w-40 md:w-80 h-40 md:h-80 bg-gradient-to-br from-primary-50/30 to-transparent rounded-full blur-3xl animate-gentle-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>

                <CourseListHeader
                    fileId={instituteDetails?.institute_logo_file_id || ""}
                    instituteId={instituteDetails?.id}
                    type="courseDetailsPage"
                    courseId={searchParams.courseId || ""}
                />
                {/* Course Header */}
                <CourseHeader courseData={form.getValues("courseData")} />
                {/* Main Content Container */}
                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-4">
                    <div
                        className={`grid grid-cols-1 ${hasRightSidebar ? "lg:grid-cols-3" : ""} gap-3 lg:gap-4`}
                    >
                        {/* Left Column - Course Content (3/4) */}
                        <div
                            className={`${hasRightSidebar ? "lg:col-span-2" : ""} space-y-4 sm:space-y-5 lg:space-y-4`}
                        >
                            {/* Mobile Video Player - Always show on small screens when course has media */}
                            {form.getValues("courseData")?.courseMediaId && (
                                <div className="mb-6 lg:hidden">
                                    <VideoPlayer
                                        src={form.getValues("courseData").courseMediaId}
                                        className="!w-full"
                                    />
                                </div>
                            )}

                            {/* Course Enrollment Configuration */}
                            <CourseEnrollment
                                showCourseConfiguration={showCourseConfiguration}
                                selectedTab={selectedTab}
                                sessionOptions={sessionOptions || []}
                                levelOptions={levelOptions || []}
                                selectedSession={selectedSession}
                                selectedLevel={selectedLevel}
                                enrolledSessions={enrolledSessions || []}
                                courseId={searchParams.courseId || ""}
                                hasRightSidebar={hasRightSidebar}
                                paymentType={paymentType}
                                certificateUrl={certificateUrl}
                                courseData={form.getValues("courseData")}
                                onSessionChange={handleSessionChange}
                                onLevelChange={handleLevelChange}
                                onEnrollmentClick={() => {
                                    // Always open enrollment dialog - it will determine the correct payment type from API data
                                    setEnrollmentDialogOpen(true);
                                }}
                            />
                            
                            {/* Course Structure (always rendered; internal logic will adapt to enrollment/public) */}
                            <div
                                className="animate-fade-in-up"
                                style={{ animationDelay: "0.2s" }}
                            >
                            <CourseContent
                                selectedSession={selectedSession}
                                selectedLevel={selectedLevel}
                                courseStructure={form.getValues("courseData.courseStructure")}
                                courseData={form.getValues("courseData")}
                                fullFormData={form.getValues()}
                                packageSessionId={packageSessionIdForCurrentLevel || ""}
                                selectedTab={selectedTab}
                                showCourseContentPrefixes={showCourseContentPrefixes}
                                filteredTabs={filteredTabs}
                                onModulesLoadingChange={handleModulesLoadingChange}
                                    isEnrolledInCourse={isUserEnrolledInCourse}
                                    enrolledSessions={enrolledSessions || []}
                                    courseId={searchParams.courseId || ""}
                                />
                            </div>

                            {/* Content Sections */}
                            <CourseContentSections 
                                courseData={form.getValues("courseData")} 
                            />

                                                    </div>

                        {/* Right Column - Course Stats Sidebar (1/4) */}
                        <div className="hidden lg:block lg:col-span-1">
                            <CourseSidebar
                            hasRightSidebar={hasRightSidebar}
                            levelOptions={levelOptions}
                            selectedLevel={selectedLevel}
                            slideCountQuery={slideCountQuery}
                            overviewVisible={overviewVisible}
                            courseOverviewShowSlidesData={courseOverviewShowSlidesData}
                            processedSlideCounts={processedSlideCounts}
                            getSlideTypeIcon={getSlideTypeIcon}
                            courseData={form.getValues("courseData")}
                            selectedSession={selectedSession}
                            onEnrollmentClick={() => {
                                setEnrollmentDialogOpen(true);
                            }}
                                        courseId={searchParams.courseId}
                            ratingsAndReviewsVisible={ratingsAndReviewsVisible}
                            packageSessionId={packageSessionIdForCurrentLevel || ""}
                        onRatingsLoadingChange={handleRatingsLoadingChange}
                            isEnrolledInCourse={isUserEnrolledInCourse}
                            enrolledSessions={enrolledSessions || []}
                                        />
                                    </div>
                                </div>

                        {/* Mobile Course Overview - Only on mobile when no sidebar */}
                        <div className="lg:hidden mt-4 mb-4">
                            <CourseOverview
                                courseOverviewShowSlidesData={courseOverviewShowSlidesData}
                                levelOptions={levelOptions}
                                selectedLevel={selectedLevel}
                                slideCountQuery={slideCountQuery}
                                processedSlideCounts={processedSlideCounts}
                                getSlideTypeIcon={getSlideTypeIcon}
                                courseId={searchParams.courseId}
                                variant="mobile"
                            />
                        </div>

                    {/* Ratings Component - Only on mobile when no sidebar */}
                    <div className="lg:hidden mt-4 mb-4">
                        {ratingsAndReviewsVisible && packageSessionIdForCurrentLevel && (
                        <div
                            className="animate-fade-in-up"
                            style={{ animationDelay: "0.8s" }}
                        >
                            <CourseDetailsRatingsComponent
                                packageSessionId={packageSessionIdForCurrentLevel}
                                onRatingsLoadingChange={handleRatingsLoadingChange}
                            />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
