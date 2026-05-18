import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeDocument, TemplateId } from "@/types/resume-builder";
import { createEmptyResume, DEMO_RESUME } from "@/features/resume-builder/default-resume";
import { calculateCompletion } from "@/features/resume-builder/utils/completion";

const MAX_HISTORY = 30;

export type AutosaveStatus = "idle" | "saving" | "saved";

interface ResumeStore {
  resume: ResumeDocument;
  savedResumes: ResumeDocument[];
  history: ResumeDocument[];
  future: ResumeDocument[];
  autosaveStatus: AutosaveStatus;
  aiSidebarOpen: boolean;
  expandedSections: Record<string, boolean>;

  setResume: (resume: ResumeDocument, pushHistory?: boolean) => void;
  updateResume: (patch: Partial<ResumeDocument>) => void;
  setTemplate: (templateId: TemplateId) => void;
  setTheme: (theme: ResumeDocument["theme"]) => void;
  loadDemo: () => void;
  resetResume: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  markSaving: () => void;
  markSaved: () => void;
  toggleSection: (key: string) => void;
  setAiSidebarOpen: (open: boolean) => void;
  saveToLibrary: () => void;
  duplicateResume: (id: string) => ResumeDocument | null;
  deleteResume: (id: string) => void;
  loadResume: (id: string) => void;
  getCompletion: () => number;
}

function addToHistory(state: ResumeStore, snapshot: ResumeDocument) {
  const history = [...state.history, snapshot].slice(-MAX_HISTORY);
  return { history, future: [] as ResumeDocument[] };
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: DEMO_RESUME,
      savedResumes: [DEMO_RESUME],
      history: [],
      future: [],
      autosaveStatus: "saved",
      aiSidebarOpen: true,
      expandedSections: {
        personal: true,
        summary: true,
        skills: true,
        experience: true,
        education: false,
        projects: false,
        certifications: false,
        languages: false,
        social: false,
      },

      setResume: (resume, pushHistory = true) =>
        set((state) => ({
          resume: { ...resume, updatedAt: new Date().toISOString() },
          ...(pushHistory ? addToHistory(state, state.resume) : {}),
          autosaveStatus: "saving",
        })),

      updateResume: (patch) => {
        const state = get();
        const next = {
          ...state.resume,
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        set({
          ...addToHistory(state, state.resume),
          resume: next,
          autosaveStatus: "saving",
        });
        setTimeout(() => get().markSaved(), 800);
      },

      setTemplate: (templateId) => get().updateResume({ templateId }),
      setTheme: (theme) => get().updateResume({ theme }),

      loadDemo: () => get().setResume({ ...DEMO_RESUME, id: crypto.randomUUID() }),
      resetResume: () => get().setResume(createEmptyResume()),

      undo: () => {
        const { history, resume, future } = get();
        if (!history.length) return;
        const prev = history[history.length - 1];
        set({
          resume: prev,
          history: history.slice(0, -1),
          future: [resume, ...future],
          autosaveStatus: "saved",
        });
      },

      redo: () => {
        const { future, resume, history } = get();
        if (!future.length) return;
        const next = future[0];
        set({
          resume: next,
          future: future.slice(1),
          history: [...history, resume],
          autosaveStatus: "saved",
        });
      },

      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,

      markSaving: () => set({ autosaveStatus: "saving" }),
      markSaved: () => set({ autosaveStatus: "saved" }),

      toggleSection: (key) =>
        set((s) => ({
          expandedSections: { ...s.expandedSections, [key]: !s.expandedSections[key] },
        })),

      setAiSidebarOpen: (open) => set({ aiSidebarOpen: open }),

      saveToLibrary: () => {
        const { resume, savedResumes } = get();
        const exists = savedResumes.findIndex((r) => r.id === resume.id);
        const next = [...savedResumes];
        if (exists >= 0) next[exists] = resume;
        else next.unshift(resume);
        set({ savedResumes: next, autosaveStatus: "saved" });
      },

      duplicateResume: (id) => {
        const original = get().savedResumes.find((r) => r.id === id);
        if (!original) return null;
        const copy: ResumeDocument = {
          ...structuredClone(original),
          id: crypto.randomUUID(),
          title: `${original.title} (Copy)`,
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ savedResumes: [copy, ...s.savedResumes] }));
        return copy;
      },

      deleteResume: (id) =>
        set((s) => ({
          savedResumes: s.savedResumes.filter((r) => r.id !== id),
        })),

      loadResume: (id) => {
        const found = get().savedResumes.find((r) => r.id === id);
        if (found) get().setResume(found);
      },

      getCompletion: () => calculateCompletion(get().resume),
    }),
    {
      name: "resumeai-resumes",
      version: 1,
      partialize: (s) => ({
        resume: s.resume,
        savedResumes: s.savedResumes,
        expandedSections: s.expandedSections,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<ResumeStore> | undefined;
        if (!p?.resume) return current;
        return {
          ...current,
          ...p,
          resume: {
            ...DEMO_RESUME,
            ...p.resume,
            personal: { ...DEMO_RESUME.personal, ...p.resume.personal },
          },
          savedResumes:
            p.savedResumes?.length ? p.savedResumes : current.savedResumes,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const empty =
          !state.resume.personal?.firstName &&
          !state.resume.personal?.lastName &&
          !state.resume.summary;
        if (empty) {
          state.resume = { ...DEMO_RESUME, id: state.resume.id || crypto.randomUUID() };
        }
      },
    }
  )
);
