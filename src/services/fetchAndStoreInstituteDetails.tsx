import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner'; // Assuming you're using sonner for toasts

interface InstituteDetails {
  institute_name: string;
  id: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pin_code: string;
  phone: string;
  email: string;
  website_url: string;
  institute_logo_file_id: string | null;
  institute_theme_code: string;
  sub_modules: Array<{
    module: string;
    sub_module: string;
    sub_module_description: string;
  }>;
  batches_for_sessions: null;
  subjects: any[];
}

export const fetchAndStoreInstituteDetails = async (
  instituteId: string, 
  userId: string
) => {
  try {
    // Store the institute ID in storage
    await Preferences.set({
      key: 'InstituteId',
      value: instituteId
    });

    // Call API to get institute details
    const instituteDetailsResponse = await axios.get<InstituteDetails>(
      `/admin-core-service/learner/v1/details/${instituteId}`,
    //   GET_INIT_DETAIL
      {
        params: {
          instituteId,
          userId,
        },
      }
    );

    // Extract the data
    const instituteDetails = instituteDetailsResponse.data;

    // Store institute details in Capacitor Preferences
    await Preferences.set({
      key: 'InstituteDetails',
      value: JSON.stringify(instituteDetails)
    });


    return instituteDetails;

  } catch (error) {
    console.error("Failed to fetch institute details:", error);
    toast.error("Failed to fetch institute details. Please try again.");
    throw error;
  }
};

// Helper function to retrieve stored institute details
export const getStoredInstituteDetails = async (): Promise<InstituteDetails | null> => {
  const { value } = await Preferences.get({ key: 'InstituteDetails' });
  return value ? JSON.parse(value) : null;
};