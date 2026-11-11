import { TableStatusCode } from '../three/floorLayout';

export const STATUS_LABELS: Record<TableStatusCode, string> = {
  F: 'Free',
  M: 'Menu open',
  W: 'Waiter called',
  O: 'Ordering',
  C: 'Cooking',
  S: 'Served',
};

export function getStatusFill(code: TableStatusCode, isTable5: boolean): string {
  if (code === 'W' || code === 'O') return '#E8500C';
  if (code === 'C') return '#FD671E';
  if (code === 'M') return isTable5 ? '#E8500C' : '#5C1C07';
  if (code === 'S') return '#371307';
  return isTable5 ? '#371307' : '#2A180D';
}
