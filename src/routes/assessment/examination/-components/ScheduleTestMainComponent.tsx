import { Helmet } from "react-helmet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EmptyScheduleTest } from "@/svgs";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useInstituteQuery } from "@/services/student-list-section/getInstituteDetails";
import { ScheduleTestFilters } from "./ScheduleTestFilters";
import { useFilterDataForAssesment } from "../../examination/-utils.ts/useFiltersData";
import { ScheduleTestSearchComponent } from "./ScheduleTestSearchComponent";
import { MyFilterOption } from "@/types/my-filter";
import { ScheduleTestHeaderDescription } from "./ScheduleTestHeaderDescription";
import ScheduleTestTabList from "./ScheduleTestTabList";
import ScheduleTestFilterButtons from "./ScheduleTestFilterButtons";
import { scheduleTestTabsData } from "@/constants/dummy-data";
import { useNavHeadingStore } from "@/stores/layout-container/useNavHeadingStore";
import LiveAssessmentList from "./LiveAssessmentList";
import AssessmentList from "./upcomingAssessments";

export const ScheduleTestMainComponent = () => {
  const { setNavHeading } = useNavHeadingStore();
  const [selectedTab, setSelectedTab] = useState("liveTests");
  const { data: initData } = useSuspenseQuery(useInstituteQuery());
  const { ModeFilterData, SubjectFilterData, StatusData } =
    useFilterDataForAssesment(initData);
  const [selectedQuestionPaperFilters, setSelectedQuestionPaperFilters] =
    useState<Record<string, MyFilterOption[]>>({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setNavHeading("Assessment");
  }, []);

  const handleFilterChange = (
    filterKey: string,
    selectedItems: MyFilterOption[]
  ) => {
    setSelectedQuestionPaperFilters((prev) => {
      const updatedFilters = { ...prev, [filterKey]: selectedItems };
      if (selectedItems.length === 0) {
        delete updatedFilters[filterKey]; // Remove empty filters
      }
      return updatedFilters;
    });
  };

  const clearSearch = () => {
    setSearchText("");
    delete selectedQuestionPaperFilters["name"];
  };

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue);
    setSelectedQuestionPaperFilters((prev) => {
      const updatedFilters = {
        ...prev,
        name: [{ id: searchValue, name: searchValue }],
      };
      return updatedFilters;
    });
  };

  const handleResetFilters = () => {
    setSelectedQuestionPaperFilters({});
    setSearchText("");
  };

  const handleSubmitFilters = () => {
    console.log("Filter Clicked!");
  };

  return (
    <>
      <ScheduleTestHeaderDescription />
      <div className="items-center gap-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="items-center justify-center gap-5 pb-5">
            <div className="flex flex-wrap gap-5 pb-5">
              <ScheduleTestTabList selectedTab={selectedTab} />
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full justify-between">
                <div className="flex flex-wrap gap-4">
                  <ScheduleTestFilters
                    label="Subjects"
                    data={SubjectFilterData}
                    selectedItems={
                      selectedQuestionPaperFilters["subject_ids"] || []
                    }
                    onSelectionChange={(items) =>
                      handleFilterChange("subject_ids", items)
                    }
                  />
                  <ScheduleTestFilters
                    label="Status"
                    data={StatusData}
                    selectedItems={
                      selectedQuestionPaperFilters["statuses"] || []
                    }
                    onSelectionChange={(items) =>
                      handleFilterChange("statuses", items)
                    }
                  />
                  <ScheduleTestFilters
                    label="Mode"
                    data={ModeFilterData}
                    selectedItems={
                      selectedQuestionPaperFilters["package_session_ids"] || []
                    }
                    onSelectionChange={(items) =>
                      handleFilterChange("package_session_ids", items)
                    }
                  />
                  <ScheduleTestFilterButtons
                    selectedQuestionPaperFilters={selectedQuestionPaperFilters}
                    handleSubmitFilters={handleSubmitFilters}
                    handleResetFilters={handleResetFilters}
                  />
                </div>

                <div className="w-full sm:w-72 sm:ml-auto p-5 sm:p-0">
                  <ScheduleTestSearchComponent
                    onSearch={handleSearch}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    clearSearch={clearSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          {scheduleTestTabsData.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="my-4 rounded-xl bg-neutral-50"
            >
              {tab.value === "liveTests" ? (
                // Render Live Tests data
                <LiveAssessmentList />
              ) : tab.value === "upcomingTests" ? (
                // Render Upcoming Tests data
                // <UpcomingAssessmentList />
                <AssessmentList />
              ) : (
                // Render empty state for other tabs or when no data is available
                <div className="flex h-screen flex-col items-center justify-center">
                  <img src={EmptyScheduleTest} alt="No Tests Available" />
                  <span className="text-neutral-600">{tab.message}</span>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

// import { useNavigate } from '@tanstack/react-router';

// const ScheduleTestMainComponent = () => {
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState("liveTests");

//   const handleTabClick = (tab: string) => {
//     setSelectedTab(tab);

//     // Navigate based on the selected tab
//     if (tab === "liveTests") {
//       navigate({ to: "/assessment/examination/live-tests" });
//     } else if (tab === "upcomingTests") {
//       navigate({ to: "/assessment/examination" });
//     }
//   };

//   return (
//     <>
//       <ScheduleTestHeaderDescription />
//       <div className="items-center gap-4">
//         <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//           <div className="items-center justify-center gap-5 pb-5">
//             <div className="flex flex-wrap gap-5 pb-5">
//               <TabsList className="inline-flex h-auto justify-start gap-4 rounded-none border-b !bg-transparent p-0">
//                 <TabsTrigger
//                   value="liveTests"
//                   onClick={() => handleTabClick("liveTests")}
//                   className={`flex gap-1.5 rounded-none px-12 py-2 !shadow-none ${
//                     selectedTab === "liveTests"
//                       ? "rounded-t-sm border !border-b-0 border-primary-200 !bg-primary-50"
//                       : "border-none bg-transparent"
//                   }`}
//                 >
//                   <span
//                     className={`${
//                       selectedTab === "liveTests" ? "text-primary-500" : ""
//                     }`}
//                   >
//                     Live
//                   </span>
//                   <Badge
//                     className="rounded-[10px] bg-primary-500 p-0 px-2 text-[9px] text-white"
//                     variant="outline"
//                   >
//                     {0}
//                   </Badge>
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="upcomingTests"
//                   onClick={() => handleTabClick("upcomingTests")}
//                   className={`flex gap-1.5 rounded-none px-12 py-2 !shadow-none ${
//                     selectedTab === "upcomingTests"
//                       ? "rounded-t-sm border !border-b-0 border-primary-200 !bg-primary-50"
//                       : "border-none bg-transparent"
//                   }`}
//                 >
//                   <span
//                     className={`${
//                       selectedTab === "upcomingTests" ? "text-primary-500" : ""
//                     }`}
//                   >
//                     Upcoming
//                   </span>
//                   <Badge
//                     className="rounded-[10px] bg-primary-500 p-0 px-2 text-[9px] text-white"
//                     variant="outline"
//                   >
//                     {0}
//                   </Badge>
//                 </TabsTrigger>
//               </TabsList>
//             </div>
//             {/* Filters and Search Components */}
//             {/* ... (Remaining JSX) */}
//           </div>
//         </Tabs>
//       </div>
//     </>
//   );
// };

// export default ScheduleTestMainComponent;
