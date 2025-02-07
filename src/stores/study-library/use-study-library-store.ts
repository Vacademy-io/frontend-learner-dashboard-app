// stores/study-library/useStudyLibraryStore.ts
import { create } from "zustand";

export interface CourseType {
    id: string;
    package_name: string;
    thumbnail_file_id: string;
    status: string;
}

export interface StudyLibrarySessionType {
    id: string;
    session_name: string;
    status: string;
}

export interface SubjectType {
    id: string;
    subject_name: string;
    subject_code: string;
    credit: number;
    thumbnail_id: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface LevelWithDetailsType {
    id: string;
    name: string;
    duration_in_days: number;
    subjects: SubjectType[];
}

export interface SessionWithLevelsType {
    session_dto: StudyLibrarySessionType;
    level_with_details: LevelWithDetailsType[];
}

export interface CourseWithSessionsType {
    course: CourseType;
    sessions: SessionWithLevelsType[];
}

interface StudyLibraryStore {
    studyLibraryData: CourseWithSessionsType[] | null;
    setStudyLibraryData: (data: CourseWithSessionsType[]) => void;
}

export const useStudyLibraryStore = create<StudyLibraryStore>((set) => ({
    studyLibraryData: null,
    setStudyLibraryData: (data) => set({ studyLibraryData: data }),
}));
