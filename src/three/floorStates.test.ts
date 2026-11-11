import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORY_TOTAL_DURATION,
  getStoryStateAtTime,
  getChangeStageFloorState,
} from './floorStates';
import { FLOOR_TABLES, samplePath2D, worldToSvg } from './floorLayout';

test('floorLayout defines exactly 12 tables (7 round and 5 square) with Table 5 present', () => {
  assert.equal(FLOOR_TABLES.length, 12);
  const roundCount = FLOOR_TABLES.filter((t) => t.shape === 'round').length;
  const squareCount = FLOOR_TABLES.filter((t) => t.shape === 'square').length;
  assert.equal(roundCount, 7);
  assert.equal(squareCount, 5);
  assert.ok(FLOOR_TABLES.some((t) => t.id === 5));
});

test('getStoryStateAtTime steps through all 11 scenes and triggers CTA pop at end', () => {
  const startState = getStoryStateAtTime(0);
  assert.equal(startState.sceneIndex, 1);
  assert.equal(startState.table5Active, false);
  assert.equal(startState.ctaVisible, false);

  const level1State = getStoryStateAtTime(9.0);
  assert.equal(level1State.activeLevel, 1);
  assert.equal(level1State.camera, 'close-table-5');
  assert.equal(level1State.showAllTableCodes, true);
  assert.equal(level1State.showTable5MenuCard, true);
  assert.equal(level1State.table5Status, 'M');

  const level2State = getStoryStateAtTime(19.0);
  assert.equal(level2State.activeLevel, 2);
  assert.equal(level2State.windowMode, 'waiter-alert');
  assert.equal(level2State.table5Status, 'W');

  const level3State = getStoryStateAtTime(26.0);
  assert.equal(level3State.activeLevel, 3);
  assert.equal(level3State.showReceptionRoute, true);
  assert.equal(level3State.showKitchenRoute, true);

  const endState = getStoryStateAtTime(STORY_TOTAL_DURATION);
  assert.equal(endState.sceneIndex, 11);
  assert.equal(endState.ctaVisible, true);
  assert.equal(endState.floorDim, 0.4);
});

test('getChangeStageFloorState maps paper, menu, waiter, and order modes', () => {
  const paper = getChangeStageFloorState('paper');
  assert.equal(paper.showAllTableCodes, false);
  assert.equal(paper.showTable5MenuCard, false);
  const menu = getChangeStageFloorState('menu');
  assert.equal(menu.camera, 'close-table-5');
  assert.equal(menu.showAllTableCodes, true);
  assert.equal(menu.showTable5MenuCard, true);
  const waiter = getChangeStageFloorState('waiter');
  assert.equal(waiter.table5Status, 'W');
  const order = getChangeStageFloorState('order');
  assert.equal(order.showKitchenRoute, true);
});

test('worldToSvg and samplePath2D compute deterministic coordinates', () => {
  const center = worldToSvg(0, 0);
  assert.equal(center.sx, 400);
  assert.equal(center.sy, 266.5);

  const path = [
    { x: 0, z: 0 },
    { x: 10, z: 20 },
  ];
  const mid = samplePath2D(path, 0.5);
  assert.equal(mid.x, 5);
  assert.equal(mid.z, 10);
});
