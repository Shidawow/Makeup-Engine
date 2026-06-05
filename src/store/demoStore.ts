import { create } from 'zustand';
import { runDemoPipeline } from '../examples/demoPipeline';
import type { DemoPipelineResult } from '../examples/demoPipeline';
import type { MockPhotoInput } from '../intelligence/analysis';
import { devLogger } from '../utils/devLogger';
import type { DevLogEntry } from '../utils/devLogger';

export interface DemoPhotoState extends MockPhotoInput {
  previewUrl: string;
}

export interface DemoStore {
  photo: DemoPhotoState | null;
  result: DemoPipelineResult | null;
  logs: DevLogEntry[];
  loading: boolean;
  error: string | null;
  setPhoto: (photo: DemoPhotoState) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}

const fallbackPhoto: DemoPhotoState = {
  fileName: 'warm-round-hooded-full-demo.jpg',
  size: 0,
  type: 'image/mock',
  previewUrl: '',
};

export const useDemoStore = create<DemoStore>((set, get) => ({
  photo: null,
  result: null,
  logs: [],
  loading: false,
  error: null,

  setPhoto: (photo) =>
    set((state) => ({
      photo,
      result: null,
      error: null,
      logs: [...state.logs, devLogger.info(`已选择照片：${photo.fileName}`)],
    })),

  analyze: async () => {
    const photo = get().photo ?? fallbackPhoto;

    set((state) => ({
      loading: true,
      error: null,
      logs: [...state.logs, devLogger.info('正在启动本地妆容分析流水线。')],
    }));

    try {
      const result = await runDemoPipeline(photo);

      set((state) => ({
        loading: false,
        result,
        logs: [
          ...state.logs,
          ...result.logs.map((entry) => devLogger.info(entry.message)),
        ],
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '本地分析失败，原因未知。';

      set((state) => ({
        loading: false,
        error: message,
        logs: [...state.logs, devLogger.error(message)],
      }));
    }
  },

  reset: () =>
    set({
      photo: null,
      result: null,
      logs: [],
      loading: false,
      error: null,
    }),
}));
