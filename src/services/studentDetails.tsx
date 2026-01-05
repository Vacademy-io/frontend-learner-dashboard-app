import { Preferences } from "@capacitor/preferences";
import authenticatedAxiosInstance from "@/lib/auth/axiosInstance";
import { STUDENT_DETAIL } from "@/constants/urls";
import { Batch, Institute, Student } from "@/types/user/user-detail";

// 🔍 API call to fetch student details
export const fetchStudentDetails = async (
  instituteId: string,
  userId: string
) => {
  const response = await authenticatedAxiosInstance({
    method: "GET",
    url: STUDENT_DETAIL,
    params: { instituteId, userId },
  });

  return response;
};

// ⚙️ React Query config
export const getStudentDetails = (instituteId?: string, userId?: string) => {
  return {
    queryKey: ["STUDENT_DETAILS", instituteId, userId],
    queryFn: async () => {
      if (!instituteId || !userId) {
        console.warn("⚠️ Institute ID or User ID missing");
        throw new Error("Institute ID and User ID are required");
      }

      const data = await fetchStudentDetails(instituteId, userId);
      return data;
    },
    staleTime: 1000,
    refetchInterval: 1000,
  };
};

// 🔐 Fetch and store student details + sessions
export const fetchAndStoreStudentDetails = async (
  instituteId: string,
  userId: string,
  fallbackUser?: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    roles: string[];
  }
) => {
  try {
    const { queryFn } = getStudentDetails(instituteId, userId);
    let response;

    try {
      response = await queryFn();
    } catch (apiError) {
      console.warn("API call for student details failed, attempting fallback...", apiError);
      if (!fallbackUser) throw apiError;
      // If API fails completely, simulate a partial "fail" state to trigger fallback logic below
      response = { status: 404, data: [] };
    }

    if (response.status === 200) {
      const students: Student[] = response.data;

      // Handle empty list from API (common race condition for new users)
      if (students.length === 0 && fallbackUser) {
        console.warn("Student details API returned empty list. Using fallback user data.");
        const fallbackStudent: any = {
          id: userId,
          user_id: userId,
          username: fallbackUser.username,
          email: fallbackUser.email,
          full_name: fallbackUser.full_name,
          institute_id: instituteId,
          package_session_id: "",
          status: "ACTIVE",
          // Defaults for required fields to avoid crashes
          address_line: "",
          region: "",
          city: "",
          pin_code: "",
          mobile_number: "",
          date_of_birth: "",
          gender: "",
          linked_institute_name: "",
          institute_enrollment_id: "",
          session_expiry_days: "",
          face_file_id: "",
          expiry_date: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          country: "",
          mother_name: "",
          father_name: "",
          parents_mobile_number: "",
          parents_email: ""
        };

        await Preferences.set({
          key: "students",
          value: JSON.stringify([fallbackStudent]),
        });

        await Preferences.set({
          key: "StudentDetails",
          value: JSON.stringify(fallbackStudent),
        });

        // Skip session mapping for fallback as we don't have package_session_id
        return 201;
      }

      await Preferences.set({
        key: "students",
        value: JSON.stringify(students),
      });

      if (students.length > 0) {
        // Ensure the stored student data has the correct institute_id
        const studentData = {
          ...students[0],
          institute_id: instituteId, // Override with the selected institute ID
        };

        await Preferences.set({
          key: "StudentDetails",
          value: JSON.stringify(studentData),
        });
      }

      const instituteData = await Preferences.get({
        key: "InstituteDetails",
      });

      if (!instituteData.value) {
        console.warn("No institute data found, skipping session mapping");
        return response.status;
      }

      const institute: Institute = JSON.parse(instituteData.value);

      if (!institute.batches_for_sessions) {
        console.warn("No batches found in institute details, skipping session mapping");
        return response.status;
      }

      const packageSessionIds = students.map((s) => s.package_session_id);

      const matchedSessions = institute.batches_for_sessions.filter(
        (batch: Batch) => packageSessionIds.includes(batch.id)
      );

      // Store the matched sessions
      await Preferences.set({
        key: "sessionList",
        value: JSON.stringify(matchedSessions),
      });

      // Also store the institute batches for sessions as a fallback
      // This ensures the profile page can still display basic institute information
      await Preferences.set({
        key: "instituteBatchesForSessions",
        value: JSON.stringify(institute.batches_for_sessions),
      });

      await storeMappedSessions();
    } else if (response.status === 201) {
      const student: Student = response.data[0];

      // Ensure the stored student data has the correct institute_id
      const studentData = {
        ...student,
        institute_id: instituteId, // Override with the selected institute ID
      };

      await Preferences.set({
        key: "StudentDetails",
        value: JSON.stringify(studentData),
      });
      await Preferences.set({
        key: "students",
        value: JSON.stringify([studentData]),
      });
    } else if (fallbackUser) {
      // Handle non-200/201 status codes (e.g. 404) with fallback
      console.warn(`Student details API returned status ${response.status}. Using fallback user data.`);
      const fallbackStudent: any = {
        id: userId,
        user_id: userId,
        username: fallbackUser.username,
        email: fallbackUser.email,
        full_name: fallbackUser.full_name,
        institute_id: instituteId,
        package_session_id: "",
        status: "ACTIVE",
        // Defaults
        address_line: "",
        region: "",
        city: "",
        pin_code: "",
        mobile_number: "",
        date_of_birth: "",
        gender: "",
        linked_institute_name: "",
        institute_enrollment_id: "",
        session_expiry_days: "",
        face_file_id: "",
        expiry_date: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        country: "",
        mother_name: "",
        father_name: "",
        parents_mobile_number: "",
        parents_email: ""
      };

      await Preferences.set({
        key: "students",
        value: JSON.stringify([fallbackStudent]),
      });

      await Preferences.set({
        key: "StudentDetails",
        value: JSON.stringify(fallbackStudent),
      });
    }

    return response.status;
  } catch (error) {
    console.error("Failed to fetch and store student details:", error);
    // Do not throw if we have fallback data? Too risky to swallow all errors.
    // If we are here, it means even the refined try-catch above failed or fallbackUser was undefined.
    throw error;
  }
};

// 🗂️ Store mapped sessions
const storeMappedSessions = async () => {
  try {
    const studentData = await Preferences.get({ key: "students" });

    const students: Student[] = studentData.value
      ? JSON.parse(studentData.value)
      : [];

    const instituteData = await Preferences.get({
      key: "InstituteDetails",
    });

    if (!instituteData.value) throw new Error("No institute data found!");

    const institute: Institute = JSON.parse(instituteData.value);
    const sessionIds = students.map((s) => s.package_session_id);

    const matchedSessions =
      institute.batches_for_sessions?.filter((batch: Batch) =>
        sessionIds.includes(batch.id)
      ) || [];

    await Preferences.set({
      key: "sessionList",
      value: JSON.stringify(matchedSessions),
    });
  } catch (error) {
    console.error("❌ Error in storeMappedSessions:", error);
  }
};

// 🧠 Get stored students
export const getStoredStudentDetails = async (): Promise<Student[] | null> => {
  try {
    const { value } = await Preferences.get({ key: "students" });
    return value ? (JSON.parse(value) as Student[]) : null;
  } catch (error) {
    console.error("❌ Error parsing stored student details:", error);
    return null;
  }
};

// 📚 Get matched sessions from Preferences
export const getMappedSessions = async (): Promise<Batch[] | null> => {
  try {
    let studentData = await Preferences.get({ key: "students" });

    if (!studentData.value) {
      studentData = await Preferences.get({ key: "StudentDetails" });

      if (!studentData.value) {
        return null;
      }
    }

    const student: Student = JSON.parse(studentData.value);

    const instituteData = await Preferences.get({
      key: "InstituteDetails",
    });

    if (!instituteData.value) {
      return null;
    }

    const institute: Institute = JSON.parse(instituteData.value);

    if (
      !institute.batches_for_sessions ||
      institute.batches_for_sessions.length === 0
    ) {
      return null;
    }

    const matchedSessions = institute.batches_for_sessions.filter(
      (batch: Batch) => batch.id === student.package_session_id
    );

    if (matchedSessions.length === 0) {
      return null;
    }

    return matchedSessions;
  } catch (error) {
    console.error("❌ Error mapping sessions:", error);
    return null;
  }
};

export const getAllSessionListFromStorage = async (): Promise<
  Batch[] | null
> => {
  try {
    const sessionData = await Preferences.get({ key: "sessionList" });

    if (!sessionData.value) {
      return null;
    }

    const sessions: Batch[] = JSON.parse(sessionData.value);
    return sessions;
  } catch (error) {
    console.error("❌ Error retrieving session list from storage:", error);
    return null;
  }
};
