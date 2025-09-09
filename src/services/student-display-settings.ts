import authenticatedAxiosInstance from "@/lib/auth/axiosInstance";
import { BASE_URL } from "@/constants/urls";
import { getInstituteId } from "@/constants/helper";
import {
  STUDENT_DISPLAY_SETTINGS_KEY,
  type StudentDisplaySettingsData,
  type StudentSidebarTabConfig,
  type StudentDashboardWidgetConfig,
} from "@/types/student-display-settings";
import { DEFAULT_STUDENT_DISPLAY_SETTINGS } from "@/constants/display-settings/student-defaults";

const LS_KEY = `${STUDENT_DISPLAY_SETTINGS_KEY}_CACHE_V1`;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function mergeArrayById<T extends { id: string }>(
  incoming: Array<Partial<T>> | undefined,
  defaults: Array<T>
): Array<T> {
  const byId = new Map<string, T>();
  defaults.forEach((d) => byId.set(d.id, { ...d }));
  (incoming || []).forEach((i) => {
    if (!i?.id) return;
    const def = byId.get(i.id);
    byId.set(i.id, def ? ({ ...def, ...i } as T) : (i as T));
  });
  return Array.from(byId.values());
}

function mergeWithDefaults(
  incoming?: Partial<StudentDisplaySettingsData> | null
): StudentDisplaySettingsData {
  const d = DEFAULT_STUDENT_DISPLAY_SETTINGS;
  const out: StudentDisplaySettingsData = {
    sidebar: {
      visible: incoming?.sidebar?.visible ?? d.sidebar.visible,
      tabs: mergeArrayById<StudentSidebarTabConfig>(
        incoming?.sidebar?.tabs,
        d.sidebar.tabs
      ).map((t) => ({
        id: t.id,
        label: t.label ?? d.sidebar.tabs.find((x) => x.id === t.id)?.label,
        route: t.route ?? d.sidebar.tabs.find((x) => x.id === t.id)?.route,
        order: t.order ?? d.sidebar.tabs.find((x) => x.id === t.id)?.order ?? 0,
        visible:
          t.visible ??
          d.sidebar.tabs.find((x) => x.id === t.id)?.visible ??
          true,
        isCustom: t.isCustom ?? false,
        subTabs: mergeArrayById(
          incoming?.sidebar?.tabs?.find((x) => x?.id === t.id)?.subTabs,
          d.sidebar.tabs.find((x) => x.id === t.id)?.subTabs || []
        ).map((s) => ({
          id: s.id,
          label:
            s.label ??
            d.sidebar.tabs
              .find((x) => x.id === t.id)
              ?.subTabs?.find((y) => y.id === s.id)?.label,
          route:
            s.route ??
            d.sidebar.tabs
              .find((x) => x.id === t.id)
              ?.subTabs?.find((y) => y.id === s.id)?.route ??
            "/",
          order:
            s.order ??
            d.sidebar.tabs
              .find((x) => x.id === t.id)
              ?.subTabs?.find((y) => y.id === s.id)?.order ??
            0,
          visible:
            s.visible ??
            d.sidebar.tabs
              .find((x) => x.id === t.id)
              ?.subTabs?.find((y) => y.id === s.id)?.visible ??
            true,
        })),
      })),
    },
    dashboard: {
      widgets: mergeArrayById<StudentDashboardWidgetConfig>(
        incoming?.dashboard?.widgets,
        d.dashboard.widgets
      ).map((w) => ({
        id: w.id,
        order:
          w.order ?? d.dashboard.widgets.find((x) => x.id === w.id)?.order ?? 0,
        visible:
          w.visible ??
          d.dashboard.widgets.find((x) => x.id === w.id)?.visible ??
          true,
        isCustom: w.isCustom ?? false,
        title: w.title ?? d.dashboard.widgets.find((x) => x.id === w.id)?.title,
        subTitle:
          w.subTitle ??
          d.dashboard.widgets.find((x) => x.id === w.id)?.subTitle,
        link: w.link ?? d.dashboard.widgets.find((x) => x.id === w.id)?.link,
      })),
    },
    signup: {
      providers: {
        google:
          incoming?.signup?.providers?.google ?? d.signup.providers.google,
        github:
          incoming?.signup?.providers?.github ?? d.signup.providers.github,
        usernamePassword:
          incoming?.signup?.providers?.usernamePassword ??
          d.signup.providers.usernamePassword,
        emailOtp:
          incoming?.signup?.providers?.emailOtp ?? d.signup.providers.emailOtp,
        defaultProvider:
          incoming?.signup?.providers?.defaultProvider ??
          d.signup.providers.defaultProvider,
      },
      usernameStrategy:
        incoming?.signup?.usernameStrategy ?? d.signup.usernameStrategy,
      passwordStrategy:
        incoming?.signup?.passwordStrategy ?? d.signup.passwordStrategy,
      passwordDelivery:
        incoming?.signup?.passwordDelivery ?? d.signup.passwordDelivery,
    },
    permissions: {
      canViewProfile:
        incoming?.permissions?.canViewProfile ?? d.permissions.canViewProfile,
      canEditProfile:
        incoming?.permissions?.canEditProfile ?? d.permissions.canEditProfile,
      canDeleteProfile:
        incoming?.permissions?.canDeleteProfile ??
        d.permissions.canDeleteProfile,
    },
    courseDetails: {
      tabs: mergeArrayById(
        incoming?.courseDetails?.tabs,
        d.courseDetails.tabs
      ).map((t) => ({
        id: t.id,
        label:
          t.label ?? d.courseDetails.tabs.find((x) => x.id === t.id)?.label,
        order:
          t.order ??
          d.courseDetails.tabs.find((x) => x.id === t.id)?.order ??
          0,
        visible:
          t.visible ??
          d.courseDetails.tabs.find((x) => x.id === t.id)?.visible ??
          true,
      })),
      defaultTab:
        incoming?.courseDetails?.defaultTab ?? d.courseDetails.defaultTab,
      outlineMode:
        incoming?.courseDetails?.outlineMode ?? d.courseDetails.outlineMode,
      ratingsAndReviewsVisible:
        incoming?.courseDetails?.ratingsAndReviewsVisible ??
        d.courseDetails.ratingsAndReviewsVisible,
      // New flags with defaults
      showCourseConfiguration:
        incoming?.courseDetails?.showCourseConfiguration ??
        d.courseDetails.showCourseConfiguration,
      showCourseContentPrefixes:
        incoming?.courseDetails?.showCourseContentPrefixes ??
        d.courseDetails.showCourseContentPrefixes,
      courseOverview: {
        visible:
          incoming?.courseDetails?.courseOverview?.visible ??
          d.courseDetails.courseOverview.visible,
        showSlidesData:
          incoming?.courseDetails?.courseOverview?.showSlidesData ??
          d.courseDetails.courseOverview.showSlidesData,
      },
      slidesView: {
        showLearningPath:
          incoming?.courseDetails?.slidesView?.showLearningPath ??
          d.courseDetails.slidesView.showLearningPath,
        feedbackVisible:
          incoming?.courseDetails?.slidesView?.feedbackVisible ??
          d.courseDetails.slidesView.feedbackVisible,
        canAskDoubt:
          incoming?.courseDetails?.slidesView?.canAskDoubt ??
          d.courseDetails.slidesView.canAskDoubt,
      },
    },
    allCourses: {
      tabs: mergeArrayById(incoming?.allCourses?.tabs, d.allCourses.tabs).map(
        (t) => ({
          id: t.id,
          label: t.label ?? d.allCourses.tabs.find((x) => x.id === t.id)?.label,
          order:
            t.order ?? d.allCourses.tabs.find((x) => x.id === t.id)?.order ?? 0,
          visible:
            t.visible ??
            d.allCourses.tabs.find((x) => x.id === t.id)?.visible ??
            true,
        })
      ),
      defaultTab: incoming?.allCourses?.defaultTab ?? d.allCourses.defaultTab,
    },
    notifications: {
      allowSystemAlerts:
        incoming?.notifications?.allowSystemAlerts ??
        d.notifications.allowSystemAlerts,
      allowDashboardPins:
        incoming?.notifications?.allowDashboardPins ??
        d.notifications.allowDashboardPins,
      allowBatchStream:
        incoming?.notifications?.allowBatchStream ??
        d.notifications.allowBatchStream,
    },
    certificates: {
      enabled:
        incoming?.certificates?.enabled ??
        d.certificates.enabled,
      generationThresholdPercent:
        incoming?.certificates?.generationThresholdPercent ??
        d.certificates.generationThresholdPercent,
    },
    postLoginRedirectRoute:
      incoming?.postLoginRedirectRoute ?? d.postLoginRedirectRoute,
  };

  out.sidebar.tabs.sort((a, b) => (a.order || 0) - (b.order || 0));
  out.sidebar.tabs.forEach((t) =>
    t.subTabs?.sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  out.dashboard.widgets.sort((a, b) => (a.order || 0) - (b.order || 0));
  out.courseDetails.tabs.sort((a, b) => (a.order || 0) - (b.order || 0));
  out.allCourses.tabs.sort((a, b) => (a.order || 0) - (b.order || 0));
  return out;
}

function readCacheForInstitute(
  instituteId: string | null | undefined
): StudentDisplaySettingsData | null {
  if (!instituteId) return null;
  try {
    const cacheKey = `${LS_KEY}:${instituteId}`;
    const raw = localStorage.getItem(cacheKey);
    if (!raw) {
      console.log(`📦 [Settings Cache] No cache found for key: ${cacheKey}`);
      return null;
    }
    const parsed = JSON.parse(raw) as {
      ts: number;
      data: StudentDisplaySettingsData;
    };
    const isValid = parsed?.ts && Date.now() - parsed.ts <= ONE_DAY_MS;
    
    console.log(`📦 [Settings Cache] Cache read for ${instituteId}:`, {
      cacheKey,
      hasData: !!parsed?.data,
      timestamp: parsed?.ts,
      age: parsed?.ts ? Date.now() - parsed.ts : 'unknown',
      isValid,
      courseOverviewVisible: parsed?.data?.courseDetails?.courseOverview?.visible,
      ratingsVisible: parsed?.data?.courseDetails?.ratingsAndReviewsVisible,
      showCourseConfiguration: parsed?.data?.courseDetails?.showCourseConfiguration
    });
    
    return isValid ? parsed.data : null;
  } catch (error) {
    console.warn(`📦 [Settings Cache] Error reading cache for ${instituteId}:`, error);
    return null;
  }
}

async function writeCacheForInstitute(
  instituteId: string | null | undefined,
  data: StudentDisplaySettingsData
): Promise<void> {
  if (!instituteId) return;
  try {
    const cacheKey = `${LS_KEY}:${instituteId}`;
    const cacheData = { ts: Date.now(), data };
    
    console.log(`💾 [Settings Cache] Writing cache for ${instituteId}:`, {
      cacheKey,
      courseOverviewVisible: data?.courseDetails?.courseOverview?.visible,
      ratingsVisible: data?.courseDetails?.ratingsAndReviewsVisible,
      showCourseConfiguration: data?.courseDetails?.showCourseConfiguration,
      tabsCount: data?.courseDetails?.tabs?.length
    });
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`💾 [Settings Cache] Error writing cache for ${instituteId}:`, error);
  }
}

export async function getStudentDisplaySettings(
  forceRefresh = false,
  instituteId?: string
): Promise<StudentDisplaySettingsData & { _source?: string }> {
  const id = await getInstituteId();
  if (!instituteId) instituteId = id ?? "";
  
  console.log(`🔧 [Settings Service] getStudentDisplaySettings called`, {
    forceRefresh,
    instituteId,
    timestamp: new Date().toISOString()
  });

  // Try institute-aware cache first
  if (!forceRefresh) {
    const cached = readCacheForInstitute(instituteId);
    if (cached) {
      console.log(`📦 [Settings Service] Using cached settings for institute: ${instituteId}`, {
        hasCourseDetails: !!cached.courseDetails,
        courseDetailsTabs: cached.courseDetails?.tabs?.length || 0,
        courseOverviewVisible: cached.courseDetails?.courseOverview?.visible,
        ratingsVisible: cached.courseDetails?.ratingsAndReviewsVisible,
        source: 'CACHE'
      });
      return { ...mergeWithDefaults(cached), _source: 'CACHE' };
    }
  }
  
  if (!instituteId) {
    console.log(`⚠️ [Settings Service] No institute ID, using defaults`, {
      source: 'DEFAULTS',
      courseDetailsTabs: DEFAULT_STUDENT_DISPLAY_SETTINGS.courseDetails.tabs.length,
      courseOverviewVisible: DEFAULT_STUDENT_DISPLAY_SETTINGS.courseDetails.courseOverview.visible
    });
    const defaults = DEFAULT_STUDENT_DISPLAY_SETTINGS;
    await writeCacheForInstitute(null, defaults);
    return { ...defaults, _source: 'DEFAULTS' };
  }

  try {
    const apiUrl = `${BASE_URL}/admin-core-service/institute/setting/v1/get`;
    console.log(`🌐 [Settings Service] Making API call to: ${apiUrl}`, {
      instituteId,
      settingKey: STUDENT_DISPLAY_SETTINGS_KEY,
      source: 'API'
    });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API call timeout after 15 seconds')), 15000);
    });

    const apiPromise = authenticatedAxiosInstance.get<{
      data: StudentDisplaySettingsData | null;
    }>(apiUrl, {
      params: { instituteId, settingKey: STUDENT_DISPLAY_SETTINGS_KEY },
      timeout: 10000, // 10 second timeout
    });

    const res = await Promise.race([apiPromise, timeoutPromise]) as any;
    
    console.log(`✅ [Settings Service] API response received`, {
      status: res.status,
      statusText: res.statusText,
      hasData: !!res.data?.data,
      dataKeys: res.data?.data ? Object.keys(res.data.data) : [],
      fullResponse: res.data,
      courseDetails: res.data?.data?.courseDetails ? {
        tabsCount: res.data.data.courseDetails.tabs?.length || 0,
        defaultTab: res.data.data.courseDetails.defaultTab,
        overviewVisible: res.data.data.courseDetails.courseOverview?.visible,
        ratingsVisible: res.data.data.courseDetails.ratingsAndReviewsVisible,
        showCourseConfiguration: res.data.data.courseDetails.showCourseConfiguration,
        showCourseContentPrefixes: res.data.data.courseDetails.showCourseContentPrefixes
      } : 'Not present',
      source: 'API'
    });

    const serverData = res.data?.data;
    const merged = mergeWithDefaults(
      serverData && Object.keys(serverData).length
        ? serverData
        : DEFAULT_STUDENT_DISPLAY_SETTINGS
    );
    
    console.log(`🔄 [Settings Service] Settings merged and cached`, {
      instituteId,
      finalCourseDetails: {
        tabsCount: merged.courseDetails.tabs.length,
        defaultTab: merged.courseDetails.defaultTab,
        overviewVisible: merged.courseDetails.courseOverview.visible,
        ratingsVisible: merged.courseDetails.ratingsAndReviewsVisible,
        showCourseConfiguration: merged.courseDetails.showCourseConfiguration,
        showCourseContentPrefixes: merged.courseDetails.showCourseContentPrefixes
      },
      source: 'API_MERGED'
    });

    await writeCacheForInstitute(instituteId, merged);
    return { ...merged, _source: 'API' };
  } catch (error) {
    console.error(`❌ [Settings Service] API call failed, using defaults`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      errorResponse: (error as any)?.response ? {
        status: (error as any).response.status,
        statusText: (error as any).response.statusText,
        data: (error as any).response.data
      } : undefined,
      instituteId,
      apiUrl,
      settingKey: STUDENT_DISPLAY_SETTINGS_KEY,
      source: 'DEFAULTS_FALLBACK'
    });
    const defaults = DEFAULT_STUDENT_DISPLAY_SETTINGS;
    await writeCacheForInstitute(instituteId, defaults);
    return { ...defaults, _source: 'DEFAULTS_FALLBACK' };
  }
}

export async function saveStudentDisplaySettings(
  settings: StudentDisplaySettingsData
): Promise<void> {
  const instituteId = await getInstituteId();
  if (!instituteId) return;
  const requestData = {
    setting_name: "Student Display Settings",
    setting_data: settings,
  };
  await authenticatedAxiosInstance.post(
    `${BASE_URL}/admin-core-service/institute/setting/v1/save-setting`,
    requestData,
    {
      params: { instituteId, settingKey: STUDENT_DISPLAY_SETTINGS_KEY },
      headers: { "Content-Type": "application/json" },
    }
  );
  // Immediately refresh to ensure cache reflects any backend-side transformations
  try {
    const res = await authenticatedAxiosInstance.get<{
      data: StudentDisplaySettingsData | null;
    }>(`${BASE_URL}/admin-core-service/institute/setting/v1/get`, {
      params: { instituteId, settingKey: STUDENT_DISPLAY_SETTINGS_KEY },
    });
    const merged = mergeWithDefaults(res.data?.data || settings);
    await writeCacheForInstitute(instituteId, merged);
  } catch {
    await writeCacheForInstitute(instituteId, settings);
  }
}

export function clearStudentDisplaySettingsCache(): void {
  try {
    // Clear all institute-specific keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${LS_KEY}:`)) keysToRemove.push(key);
    }
    
    console.log(`🗑️ [Settings Cache] Clearing cache keys:`, keysToRemove);
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    console.log(`🗑️ [Settings Cache] Cache cleared successfully`);
  } catch (error) {
    console.error("Error clearing student display settings cache:", error);
  }
}

export async function getAuthSettings({ details }: { details: string }) {
  const studentDisplaySettings = getStudentDisplaySettingsFromInsitituteDetails(
    details || "{}"
  );
  if (!studentDisplaySettings) return { google: false, github: false };
  const providers = studentDisplaySettings.signup.providers;
  return providers;
}

function getStudentDisplaySettingsFromInsitituteDetails(
  settings: string
  /* eslint-disable-next-line */
): any | null {
  try {
    const data = JSON.parse(settings);

    // Access STUDENT_DISPLAY_SETTINGS safely with optional chaining
    return data?.setting?.STUDENT_DISPLAY_SETTINGS.data ?? null;
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
}

export { mergeWithDefaults };

// Debug function to inspect cache state
export function inspectStudentDisplaySettingsCache(instituteId?: string): void {
  try {
    const id = instituteId || 'current';
    const cacheKey = `${LS_KEY}:${id}`;
    const raw = localStorage.getItem(cacheKey);
    
    console.log(`🔍 [Settings Cache Debug] Inspecting cache for ${id}:`, {
      cacheKey,
      exists: !!raw,
      rawData: raw ? JSON.parse(raw) : null
    });
    
    // Also check all cache keys
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith(LS_KEY));
    console.log(`🔍 [Settings Cache Debug] All cache keys:`, allKeys);
    
    allKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          console.log(`🔍 [Settings Cache Debug] Key ${key}:`, {
            timestamp: parsed.ts,
            age: Date.now() - parsed.ts,
            courseOverviewVisible: parsed.data?.courseDetails?.courseOverview?.visible,
            ratingsVisible: parsed.data?.courseDetails?.ratingsAndReviewsVisible
          });
        } catch (e) {
          console.log(`🔍 [Settings Cache Debug] Key ${key}: Invalid JSON`);
        }
      }
    });
  } catch (error) {
    console.error(`🔍 [Settings Cache Debug] Error inspecting cache:`, error);
  }
}
