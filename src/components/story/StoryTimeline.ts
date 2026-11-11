import {
  FloorSceneState,
  LEVEL_START_TIMES,
  STORY_TOTAL_DURATION,
  getStoryStateAtTime,
} from '../../three/floorStates';

export interface StoryTimelineCallbacks {
  onUpdate: (state: FloorSceneState) => void;
}

export class StoryTimeline {
  private currentTime = 0;
  private isPlaying = true;
  private loopRange: { start: number; end: number } | null = null;
  private rafId = 0;
  private lastNow = 0;
  private callbacks: StoryTimelineCallbacks;

  constructor(callbacks: StoryTimelineCallbacks, startAtEnd = false) {
    this.callbacks = callbacks;
    if (startAtEnd) {
      this.currentTime = STORY_TOTAL_DURATION;
      this.isPlaying = false;
    }
    this.emit();
  }

  public start(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
    }
    this.lastNow = performance.now();
    this.tick();
  }

  public pause(): void {
    this.isPlaying = false;
    cancelAnimationFrame(this.rafId);
  }

  public skipToEnd(): void {
    this.loopRange = null;
    this.currentTime = STORY_TOTAL_DURATION;
    this.isPlaying = false;
    cancelAnimationFrame(this.rafId);
    this.emit();
  }

  public replayAll(): void {
    this.loopRange = null;
    this.currentTime = 0;
    this.isPlaying = true;
    this.lastNow = performance.now();
    this.emit();
    cancelAnimationFrame(this.rafId);
    this.tick();
  }

  public jumpToLevel(level: 1 | 2 | 3): void {
    const range = LEVEL_START_TIMES[level];
    this.loopRange = range;
    this.currentTime = range.start;
    this.isPlaying = true;
    this.lastNow = performance.now();
    this.emit();
    cancelAnimationFrame(this.rafId);
    this.tick();
  }

  private emit(): void {
    const state = getStoryStateAtTime(this.currentTime);
    this.callbacks.onUpdate(state);
  }

  private tick = (): void => {
    if (!this.isPlaying) return;
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastNow) / 1000);
    this.lastNow = now;

    this.currentTime += dt;

    if (this.loopRange) {
      if (this.currentTime >= this.loopRange.end) {
        this.currentTime = this.loopRange.start;
      }
    } else if (this.currentTime >= STORY_TOTAL_DURATION) {
      this.currentTime = STORY_TOTAL_DURATION;
      this.isPlaying = false;
      this.emit();
      return;
    }

    this.emit();
    this.rafId = requestAnimationFrame(this.tick);
  };

  public destroy(): void {
    this.isPlaying = false;
    cancelAnimationFrame(this.rafId);
  }
}
