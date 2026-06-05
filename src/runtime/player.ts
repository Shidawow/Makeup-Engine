import type { FaceRegion, MakeupLook, MakeupStep, ToolType } from '../schema/makeup.schema';

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface RuntimeToolTip {
  tool: ToolType;
  text: string;
}

export interface MakeupPlaybackState {
  status: PlaybackStatus;
  look: MakeupLook | null;
  currentStep: MakeupStep | null;
  currentStepIndex: number;
  highlightedRegion: FaceRegion | null;
  toolTip: RuntimeToolTip | null;
  progress: {
    current: number;
    total: number;
    percent: number;
  };
}

export interface PlayOptions {
  autoAdvance?: boolean;
}

type Listener = (state: MakeupPlaybackState) => void;

const emptyProgress = {
  current: 0,
  total: 0,
  percent: 0,
};

const initialState: MakeupPlaybackState = {
  status: 'idle',
  look: null,
  currentStep: null,
  currentStepIndex: -1,
  highlightedRegion: null,
  toolTip: null,
  progress: emptyProgress,
};

const toolTipCopy: Record<ToolType, string> = {
  brush: 'Use a brush for controlled placement and soft edge work.',
  finger: 'Use fingers to warm product into the skin and soften texture.',
  sponge: 'Use a sponge to press product in thin, even layers.',
};

const clampStepIndex = (look: MakeupLook, stepIndex: number) =>
  Math.min(Math.max(stepIndex, 0), Math.max(look.steps.length - 1, 0));

const calculateProgress = (look: MakeupLook, stepIndex: number) => {
  const total = look.steps.length;
  const current = total === 0 ? 0 : stepIndex + 1;

  return {
    current,
    total,
    percent: total === 0 ? 0 : Math.round((current / total) * 100),
  };
};

const createState = (
  look: MakeupLook,
  stepIndex: number,
  status: PlaybackStatus,
): MakeupPlaybackState => {
  const normalizedIndex = clampStepIndex(look, stepIndex);
  const currentStep = look.steps[normalizedIndex] ?? null;

  return {
    status,
    look,
    currentStep,
    currentStepIndex: currentStep ? normalizedIndex : -1,
    highlightedRegion: currentStep?.region ?? null,
    toolTip: currentStep
      ? {
          tool: currentStep.tool,
          text: toolTipCopy[currentStep.tool],
        }
      : null,
    progress: calculateProgress(look, normalizedIndex),
  };
};

export class MakeupEnginePlayer {
  private listeners = new Set<Listener>();

  private state: MakeupPlaybackState = initialState;

  private timer: ReturnType<typeof setTimeout> | null = null;

  private autoAdvance = true;

  getSnapshot = () => this.state;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  };

  play = (makeupLook: MakeupLook, options: PlayOptions = {}) => {
    this.clearTimer();
    this.autoAdvance = options.autoAdvance ?? true;
    this.state = createState(makeupLook, 0, 'playing');
    this.emit();
    this.scheduleNext();
    return this.state;
  };

  pause = () => {
    if (this.state.status !== 'playing') {
      return this.state;
    }

    this.clearTimer();
    this.state = {
      ...this.state,
      status: 'paused',
    };
    this.emit();
    return this.state;
  };

  resume = () => {
    if (!this.state.look || this.state.status !== 'paused') {
      return this.state;
    }

    this.state = {
      ...this.state,
      status: 'playing',
    };
    this.emit();
    this.scheduleNext();
    return this.state;
  };

  next = () => {
    if (!this.state.look) {
      return this.state;
    }

    this.clearTimer();

    if (this.state.currentStepIndex >= this.state.look.steps.length - 1) {
      this.state = {
        ...this.state,
        status: 'completed',
        progress: {
          current: this.state.look.steps.length,
          total: this.state.look.steps.length,
          percent: this.state.look.steps.length === 0 ? 0 : 100,
        },
      };
      this.emit();
      return this.state;
    }

    this.state = createState(
      this.state.look,
      this.state.currentStepIndex + 1,
      this.state.status === 'paused' ? 'paused' : 'playing',
    );
    this.emit();
    this.scheduleNext();
    return this.state;
  };

  previous = () => {
    if (!this.state.look) {
      return this.state;
    }

    this.clearTimer();
    this.state = createState(
      this.state.look,
      this.state.currentStepIndex - 1,
      this.state.status === 'paused' ? 'paused' : 'playing',
    );
    this.emit();
    this.scheduleNext();
    return this.state;
  };

  stop = () => {
    this.clearTimer();
    this.state = initialState;
    this.emit();
    return this.state;
  };

  private scheduleNext = () => {
    if (!this.autoAdvance || this.state.status !== 'playing' || !this.state.currentStep) {
      return;
    }

    this.timer = setTimeout(() => {
      this.next();
    }, this.state.currentStep.durationMs ?? 2000);
  };

  private clearTimer = () => {
    if (!this.timer) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = null;
  };

  private emit = () => {
    this.listeners.forEach((listener) => listener(this.state));
  };
}

export const engine = new MakeupEnginePlayer();
