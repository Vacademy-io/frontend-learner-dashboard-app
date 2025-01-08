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
import UpcomingAssessmentList from "./upcomingAssessments";

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
                <UpcomingAssessmentList />
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
