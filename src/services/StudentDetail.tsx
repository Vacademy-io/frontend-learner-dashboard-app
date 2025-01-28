// import { useQuery } from "@tanstack/react-query";
// import { Storage } from "@capacitor/storage";

// export const fetchStudentDetails = async ({ instituteId, userId }) => {
//   const response = await fetch(
//     `https://backend-stage.vacademy.io/admin-core-service/learner/info/v1/details?instituteId=${instituteId}&userId=${userId}`
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch student details");
//   }

//   return response.json();
// };

// const storeDataInCapacitor = async (key, value) => {
//   await Storage.set({
//     key,
//     value: JSON.stringify(value),
//   });
// };




// import { useMutation } from "@tanstack/react-query";
// import { Storage } from "@capacitor/storage";

// // API function to fetch student details
// export const fetchStudentDetails = async ({ instituteId, userId }) => {
//   const response = await fetch(
//     `https://backend-stage.vacademy.io/admin-core-service/learner/info/v1/details?instituteId=${instituteId}&userId=${userId}`
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch student details");
//   }

//   return response.json();
// };

// // Helper function to store data in Capacitor Storage
// const storeDataInCapacitor = async (key, value) => {
//   await Storage.set({
//     key,
//     value: JSON.stringify(value),
//   });
// };




import { useMutation } from '@tanstack/react-query';
import { Storage } from '@capacitor/storage';
import axios from 'axios';

interface StudentDetails {
  // Add your student details interface here based on API response
  id: string;
  name: string;
  // ... other fields
}

interface FetchStudentParams {
  instituteId: string;
  userId: string;
}

const STORAGE_KEY = 'student_details';

export const useStudentDetails = () => {
  const fetchAndStoreStudent = async ({ instituteId, userId }: FetchStudentParams) => {
    try {
      const response = await axios.get<StudentDetails>(
        `https://backend-stage.vacademy.io/admin-core-service/learner/info/v1/details`,
        {
          params: {
            instituteId,
            userId,
          },
        }
      );

      // Store the data in Capacitor Storage
      await Storage.set({
        key: STORAGE_KEY,
        value: JSON.stringify(response.data),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  };

  const getStoredStudentDetails = async (): Promise<StudentDetails | null> => {
    try {
      const { value } = await Storage.get({ key: STORAGE_KEY });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving stored student details:', error);
      return null;
    }
  };

  const clearStoredStudentDetails = async () => {
    try {
      await Storage.remove({ key: STORAGE_KEY });
    } catch (error) {
      console.error('Error clearing stored student details:', error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: fetchAndStoreStudent,
    onError: (error) => {
      console.error('Mutation error:', error);
      // Handle error appropriately (e.g., show toast notification)
    },
  });

  return {
    fetchAndStoreStudent: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    getStoredStudentDetails,
    clearStoredStudentDetails,
  };
};