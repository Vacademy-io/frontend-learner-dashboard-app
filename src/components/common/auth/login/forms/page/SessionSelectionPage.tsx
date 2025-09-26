import { useEffect, useState, useRef } from "react";
import { Preferences } from "@capacitor/preferences";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DashboardLoader } from "@/components/core/dashboard-loader";
import { getPublicUrl } from "@/services/upload_file";
import { Session } from "@/types/user/user-detail";
import { ContentTerms, SystemTerms } from "@/types/naming-settings";
import { getTerminology } from "@/components/common/layout-container/sidebar/utils";
import { toTitleCase } from "@/lib/utils";

const SessionSelectionPage = () => {
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { redirect } = useSearch<any>({ from: "/SessionSelectionPage/" });
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const checkAndFetch = async () => {

      try {
        const selectedInstitute = await Preferences.get({
          key: "selectedInstituteId",
        });
        const studentData = await Preferences.get({ key: "students" });


        if (!selectedInstitute.value || !studentData.value) {
          console.warn("⚠️ Institute or student data missing.");
          toast.error("Missing institute or student data. Please reselect.");
          return;
        }

        const sessionListRaw = await Preferences.get({ key: "sessionList" });

        if (!sessionListRaw.value) {
          console.warn("⚠️ No sessionList found in Preferences.");
          toast.error("No sessions found.");
          return;
        }

        const parsed = JSON.parse(sessionListRaw.value) as Session[];

        if (!Array.isArray(parsed) || parsed.length === 0) {
          console.warn("⚠️ Parsed session list is empty or invalid.");
        } else {
        }

        setSessionList(parsed);
      } catch (error) {
        toast.error("Failed to load session list.");
      } finally {
        setLoading(false);
      }
    };

    checkAndFetch();
  }, []);

  useEffect(() => {

    if (sessionList.length === 1) {
      handleSessionSelect(sessionList[0]);
    } else if (sessionList.length > 0) {
      fetchImageUrls();
    }
  }, [sessionList]);

  const fetchImageUrls = async () => {

    const urls: Record<string, string> = {};

    for (const session of sessionList) {
      const thumbnailId = session.package_dto?.thumbnail_file_id;

      if (thumbnailId) {
        try {
          const url = await getPublicUrl(thumbnailId);
          urls[session.id] = url;
        } catch (error) {
        }
      } else {
        console.warn(`⚠️ No thumbnail_file_id found for session ${session.id}`);
      }
    }

    setImageUrls(urls);
  };

  const handleSessionSelect = async (selectedSession: Session) => {
    setSubmitting(true);

    try {
      const studentData = await Preferences.get({ key: "students" });

      if (!studentData.value) {
        throw new Error("No student data found!");
      }

      const studentList = JSON.parse(studentData.value);
      const selectedStudent = studentList.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (student: any) => student.package_session_id === selectedSession.id
      );

      if (!selectedStudent) {
        console.warn("⚠️ No matching student found for selected session.");
        throw new Error("No matching student found!");
      }

      await Preferences.set({
        key: "StudentDetails",
        value: JSON.stringify(selectedStudent),
      });


      navigate({ to: redirect });
    } catch (error) {
      toast.error("Something went wrong while selecting session.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <DashboardLoader />
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="w-full px-4">
        <div className="text-center space-y-4 mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md mx-auto flex items-center justify-center shadow-md">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13..."
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Your{" "}
            {getTerminology(ContentTerms.Course, SystemTerms.Course)}
          </h1>
          <p className="text-gray-600">
            Select a{" "}
            {getTerminology(
              ContentTerms.Course,
              SystemTerms.Course
            ).toLocaleLowerCase()}{" "}
            to begin your learning journey
          </p>
        </div>

        {sessionList.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="bg-white rounded-md p-6 shadow-lg border border-gray-200 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13..."
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {getTerminology(ContentTerms.Course, SystemTerms.Course)}s
                Available
              </h3>
              <p className="text-gray-600">
                You are not currently enrolled in any{" "}
                {getTerminology(
                  ContentTerms.Course,
                  SystemTerms.Course
                ).toLowerCase()}
                s. Please contact your administrator.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {sessionList.map((session) => (
                <div
                  key={session.id}
                  className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => handleSessionSelect(session)}
                >
                  <Card className="border shadow-sm hover:shadow-md border-gray-200 hover:border-emerald-300 rounded-md">
                    <div className="relative h-36 overflow-hidden rounded-t-lg">
                      {imageUrls[session.id] ? (
                        <img
                          src={imageUrls[session.id]}
                          alt={toTitleCase(session.package_dto.package_name)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex w-full h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                          <svg
                            className="w-12 h-12 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13..."
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 truncate">
                        {toTitleCase(session.package_dto.package_name)}
                      </h3>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          {getTerminology(
                            ContentTerms.Session,
                            SystemTerms.Session
                          )}
                          :
                        </span>
                        <span className="truncate">
                          {toTitleCase(session.session.session_name)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          {getTerminology(
                            ContentTerms.Level,
                            SystemTerms.Level
                          )}
                          :
                        </span>
                        <span>{toTitleCase(session.level.level_name)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Start:</span>
                        <span>
                          {new Date(session.start_time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pt-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Ready to start</span>
                          <span>100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSelectionPage;
