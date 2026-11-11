import storyData from '../data/story.json';
import { Point2D, STAFF_PATHS, samplePath2D, TableStatusCode } from './floorLayout';

export type CameraPreset = 'top' | 'tilt-table-5' | 'close-table-5' | 'floor-mid' | 'pan-routes' | 'wide' | 'wide-dim';
export type StoryWindowMode =
  | 'none'
  | 'phone-open'
  | 'phone-menu'
  | 'phone-cart'
  | 'phone-call-waiter'
  | 'waiter-alert'
  | 'phone-order-sent'
  | 'reception-kitchen'
  | 'phone-served'
  | 'cta';

export type ChangeStageMode = 'paper' | 'menu' | 'waiter' | 'order';

export interface FloorSceneState {
  t: number;
  sceneIndex: number;
  activeLevel: 0 | 1 | 2 | 3 | 4;
  camera: CameraPreset;
  windowMode: StoryWindowMode;
  caption: string;
  table5Active: boolean;
  table5Status: TableStatusCode;
  showAllTableCodes: boolean;
  showTable5MenuCard: boolean;
  scanLineProgress: number; // 0..1
  waiterRingPulse: number; // 0..1
  showReceptionRoute: boolean;
  showKitchenRoute: boolean;
  kitchenGlow: number; // 0..1
  floorDim: number; // 0..1 (1 = normal, 0.4 = dimmed for end CTA)
  staff1Pos: Point2D;
  staff2Pos: Point2D;
  ctaVisible: boolean;
  otherTableStatuses: Record<number, TableStatusCode>;
}

export const STORY_TOTAL_DURATION = 34.0;

export const LEVEL_START_TIMES: Record<1 | 2 | 3, { start: number; end: number }> = {
  1: { start: 6.0, end: 11.0 },
  2: { start: 11.0, end: 22.0 },
  3: { start: 22.0, end: 32.0 },
};

export function getStoryStateAtTime(rawT: number): FloorSceneState {
  const t = Math.max(0, Math.min(STORY_TOTAL_DURATION, rawT));

  // Find current scene in story.json
  let currentScene = storyData[0];
  for (let i = 0; i < storyData.length; i++) {
    if (t >= storyData[i].t) {
      currentScene = storyData[i];
    } else {
      break;
    }
  }

  const sceneElapsed = Math.max(0, t - currentScene.t);
  const sceneProgress = Math.min(1, sceneElapsed / Math.max(0.1, currentScene.duration));

  const sIdx = currentScene.scene;
  const activeLevel = (currentScene.level as 0 | 1 | 2 | 3 | 4) || 0;

  let table5Status: TableStatusCode = 'F';
  if (sIdx >= 3 && sIdx <= 5) table5Status = 'M';
  else if (sIdx === 6 || sIdx === 7) table5Status = 'W';
  else if (sIdx === 8 || sIdx === 9) table5Status = 'O';
  else if (sIdx === 10) table5Status = sceneProgress < 0.65 ? 'C' : 'S';
  else if (sIdx === 11) table5Status = 'F';

  // Staff 1 & Staff 2 positions
  let staff1Pos: Point2D = samplePath2D(STAFF_PATHS.patrolLeft, (t % 8) / 8);
  let staff2Pos: Point2D = samplePath2D(STAFF_PATHS.patrolRight, (t % 10) / 10);

  if (sIdx === 6) {
    // Waiter called on phone -> Waiter immediately starts walking from Counter toward Table 5
    const walkProg = Math.max(0, Math.min(1, sceneProgress * 0.85));
    staff1Pos = samplePath2D(STAFF_PATHS.counterToTable5, walkProg);
  } else if (sIdx === 7) {
    // Waiter gets table number and walks all the way to Table 5
    staff1Pos = samplePath2D(STAFF_PATHS.counterToTable5, sceneProgress);
  } else if (sIdx === 10) {
    // Staff carries cooked order from kitchen to Table 5
    const carryProg = Math.max(0, Math.min(1, (sceneProgress - 0.2) / 0.8));
    staff2Pos = samplePath2D(STAFF_PATHS.kitchenToTable5, carryProg);
  }

  const otherTableStatuses: Record<number, TableStatusCode> = {};
  if (sIdx >= 9) {
    otherTableStatuses[2] = 'C';
    otherTableStatuses[4] = 'O';
    otherTableStatuses[8] = 'M';
    otherTableStatuses[11] = 'S';
  } else if (sIdx >= 4) {
    otherTableStatuses[2] = 'M';
    otherTableStatuses[8] = 'M';
  }

  return {
    t,
    sceneIndex: sIdx,
    activeLevel,
    camera: currentScene.camera as CameraPreset,
    windowMode: currentScene.window as StoryWindowMode,
    caption: currentScene.caption,
    table5Active: sIdx >= 2,
    table5Status,
    showAllTableCodes: sIdx >= 4,
    showTable5MenuCard: sIdx === 3 || sIdx === 4,
    scanLineProgress: sIdx === 2 || sIdx === 3 ? sceneProgress : sIdx > 3 ? 1 : 0,
    waiterRingPulse: sIdx === 6 || sIdx === 7 ? (Math.sin(t * 6) + 1) * 0.5 + 0.15 : 0,
    showReceptionRoute: sIdx === 9 || sIdx === 10,
    showKitchenRoute: sIdx === 9 || sIdx === 10,
    kitchenGlow: sIdx === 9 ? 0.6 : sIdx === 10 ? 1.0 : 0.15,
    floorDim: sIdx === 11 ? 0.4 : 1.0,
    staff1Pos,
    staff2Pos,
    ctaVisible: t >= 32.3,
    otherTableStatuses,
  };
}

export function getChangeStageFloorState(mode: ChangeStageMode, stepProgress = 0.5): FloorSceneState {
  const p = Math.max(0, Math.min(1, stepProgress));
  if (mode === 'paper') {
    return {
      t: 1,
      sceneIndex: 1,
      activeLevel: 0,
      camera: 'top',
      windowMode: 'none',
      caption: 'Staff carry menus, take orders by hand and walk each one to the kitchen.',
      table5Active: false,
      table5Status: 'F',
      showAllTableCodes: false,
      showTable5MenuCard: false,
      scanLineProgress: 0,
      waiterRingPulse: 0,
      showReceptionRoute: false,
      showKitchenRoute: false,
      kitchenGlow: 0.1,
      floorDim: 1.0,
      staff1Pos: samplePath2D(STAFF_PATHS.patrolLeft, p),
      staff2Pos: samplePath2D(STAFF_PATHS.patrolRight, (p + 0.4) % 1),
      ctaVisible: false,
      otherTableStatuses: {},
    };
  }
  if (mode === 'menu') {
    return {
      t: 9,
      sceneIndex: 4,
      activeLevel: 1,
      camera: 'close-table-5',
      windowMode: 'none',
      caption: 'A code on each table opens your full menu with photos and prices.',
      table5Active: true,
      table5Status: 'M',
      showAllTableCodes: true,
      showTable5MenuCard: true,
      scanLineProgress: 0.15 + p * 0.75,
      waiterRingPulse: 0,
      showReceptionRoute: false,
      showKitchenRoute: false,
      kitchenGlow: 0.2,
      floorDim: 1.0,
      staff1Pos: { x: -3.2, z: -4.8 },
      staff2Pos: { x: 1.8, z: -4.8 },
      ctaVisible: false,
      otherTableStatuses: { 2: 'M', 4: 'M', 7: 'M', 10: 'M' },
    };
  }
  if (mode === 'waiter') {
    return {
      t: 19.5,
      sceneIndex: 7,
      activeLevel: 2,
      camera: 'floor-mid',
      windowMode: 'none',
      caption: 'Guests fill the cart and tap the button below it. The waiter is notified with the table number and comes over.',
      table5Active: true,
      table5Status: 'W',
      showAllTableCodes: true,
      showTable5MenuCard: false,
      scanLineProgress: 1,
      waiterRingPulse: (Math.sin(p * Math.PI * 3) + 1) * 0.35 + 0.25,
      showReceptionRoute: false,
      showKitchenRoute: false,
      kitchenGlow: 0.25,
      floorDim: 1.0,
      staff1Pos: samplePath2D(STAFF_PATHS.counterToTable5, 0.15 + p * 0.85),
      staff2Pos: { x: 2.2, z: -4.8 },
      ctaVisible: false,
      otherTableStatuses: { 2: 'M', 8: 'M' },
    };
  }
  return {
    t: 27.5,
    sceneIndex: 9,
    activeLevel: 3,
    camera: 'pan-routes',
    windowMode: 'none',
    caption: 'Guests order from the phone. Reception or the kitchen gets it with the table number. It is made and served.',
    table5Active: true,
    table5Status: p > 0.8 ? 'S' : 'O',
    showAllTableCodes: true,
    showTable5MenuCard: false,
    scanLineProgress: 1,
    waiterRingPulse: 0,
    showReceptionRoute: true,
    showKitchenRoute: true,
    kitchenGlow: 0.55 + p * 0.45,
    floorDim: 1.0,
    staff1Pos: { x: 4.0, z: -4.8 },
    staff2Pos: samplePath2D(STAFF_PATHS.kitchenToTable5, 0.15 + p * 0.85),
    ctaVisible: false,
    otherTableStatuses: { 2: 'C', 4: 'O', 8: 'M', 11: 'S' },
  };
}
