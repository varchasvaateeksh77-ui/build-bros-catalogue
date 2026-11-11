import React from 'react';
import {
  FLOOR_TABLES,
  COUNTER_BLOCK,
  RECEPTION_BLOCK,
  KITCHEN_BLOCK,
  ORDER_ROUTES,
  STAFF_PATHS,
  worldToSvg,
} from '../three/floorLayout';
import { FloorSceneState } from '../three/floorStates';
import { getStatusFill } from './floorStates2D';

interface Floor2DProps {
  state: FloorSceneState;
  className?: string;
}

export const Floor2D: React.FC<Floor2DProps> = ({ state, className = '' }) => {
  const counterPos = worldToSvg(COUNTER_BLOCK.x, COUNTER_BLOCK.z);
  const recPos = worldToSvg(RECEPTION_BLOCK.x, RECEPTION_BLOCK.z);
  const kitPos = worldToSvg(KITCHEN_BLOCK.x, KITCHEN_BLOCK.z);
  const staff1Svg = worldToSvg(state.staff1Pos.x, state.staff1Pos.z);
  const staff2Svg = worldToSvg(state.staff2Pos.x, state.staff2Pos.z);

  const recPoints = ORDER_ROUTES.table5ToReception
    .map((p) => {
      const { sx, sy } = worldToSvg(p.x, p.z);
      return `${sx},${sy}`;
    })
    .join(' ');

  const kitPoints = ORDER_ROUTES.table5ToKitchen
    .map((p) => {
      const { sx, sy } = worldToSvg(p.x, p.z);
      return `${sx},${sy}`;
    })
    .join(' ');

  const waiterPoints = STAFF_PATHS.counterToTable5
    .map((p) => {
      const { sx, sy } = worldToSvg(p.x, p.z);
      return `${sx},${sy}`;
    })
    .join(' ');

  const t5Pos = worldToSvg(-0.8, 0.8);
  const svgViewBox = state.showTable5MenuCard ? '195 145 385 265' : '0 0 800 533';

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-[#140905] select-none ${className}`}
      style={{ opacity: state.floorDim }}
      data-testid="floor-2d-svg"
    >
      <svg
        viewBox={svgViewBox}
        className="w-full h-full max-h-full transition-all duration-300"
        role="img"
        aria-label="Top-down cafe floor plan showing 12 tables, counter, reception, and kitchen"
      >
        {/* Floor perimeter hairline */}
        <rect
          x="20"
          y="20"
          width="760"
          height="493"
          rx="14"
          fill="#180B06"
          stroke="#F7F2ED"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />

        {/* Counter Block */}
        <g transform={`translate(${counterPos.sx - 180}, ${counterPos.sy - 26})`}>
          <rect
            width="360"
            height="52"
            rx="6"
            fill="#2A180D"
            stroke="#F7F2ED"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <line x1="8" y1="48" x2="352" y2="48" stroke="#F7F2ED" strokeWidth="2.5" strokeOpacity="0.7" />
          <text x="180" y="30" fill="#FBEFE6" fontSize="13" fontWeight="600" textAnchor="middle">
            Counter
          </text>
        </g>

        {/* Reception Block */}
        <g transform={`translate(${recPos.sx - 56}, ${recPos.sy - 26})`}>
          <rect
            width="112"
            height="52"
            rx="6"
            fill="#2A180D"
            stroke={state.showReceptionRoute ? '#E8500C' : '#F7F2ED'}
            strokeOpacity={state.showReceptionRoute ? '0.95' : '0.35'}
            strokeWidth="1.5"
          />
          <line x1="8" y1="48" x2="104" y2="48" stroke="#F7F2ED" strokeWidth="2.5" strokeOpacity="0.8" />
          <text x="56" y="30" fill="#FBEFE6" fontSize="12" fontWeight="600" textAnchor="middle">
            Reception
          </text>
        </g>

        {/* Kitchen Block */}
        <g transform={`translate(${kitPos.sx - 52}, ${kitPos.sy - 155})`}>
          <rect
            width="104"
            height="310"
            rx="8"
            fill="#5C1C07"
            stroke="#E8500C"
            strokeOpacity={0.3 + state.kitchenGlow * 0.7}
            strokeWidth="2"
          />
          <line
            x1="4"
            y1="16"
            x2="4"
            y2="294"
            stroke="#E8500C"
            strokeWidth="5"
            strokeOpacity={0.4 + state.kitchenGlow * 0.6}
          />
          <text x="54" y="158" fill="#FBEFE6" fontSize="13" fontWeight="600" textAnchor="middle">
            Kitchen
          </text>
        </g>

        {/* Waiter walk route from Counter to Table 5 */}
        {state.waiterRingPulse > 0 && (
          <polyline
            points={waiterPoints}
            fill="none"
            stroke="#FF8741"
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeOpacity="0.9"
          />
        )}

        {/* Order routing hairlines */}
        {state.showReceptionRoute && (
          <polyline
            points={recPoints}
            fill="none"
            stroke="#F7F2ED"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            strokeOpacity="0.85"
          />
        )}
        {state.showKitchenRoute && (
          <polyline
            points={kitPoints}
            fill="none"
            stroke="#E8500C"
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeOpacity="0.95"
          />
        )}

        {/* Twelve Tables */}
        {FLOOR_TABLES.map((t) => {
          const { sx, sy } = worldToSvg(t.x, t.z);
          const isT5 = t.id === 5;
          const status = isT5 ? state.table5Status : state.otherTableStatuses[t.id] || 'F';
          const fill = getStatusFill(status, isT5 && state.table5Active);
          const showCode = (isT5 && state.table5Active) || state.showAllTableCodes;

          return (
            <g key={t.id} transform={`translate(${sx}, ${sy})`}>
              {/* Waiter call ring pulse on Table 5 */}
              {isT5 && (state.waiterRingPulse > 0 || state.showTable5MenuCard) && (
                <circle
                  r={38 + (state.waiterRingPulse || 0.35) * 12}
                  fill="none"
                  stroke="#E8500C"
                  strokeWidth="2.5"
                  strokeOpacity={0.4 + (state.waiterRingPulse || 0.35) * 0.5}
                />
              )}

              {/* Chairs */}
              <rect x="-42" y="-10" width="8" height="20" rx="2" fill="#382012" />
              <rect x="34" y="-10" width="8" height="20" rx="2" fill="#382012" />
              {t.chairs === 4 && (
                <>
                  <rect x="-10" y="-42" width="20" height="8" rx="2" fill="#382012" />
                  <rect x="-10" y="34" width="20" height="8" rx="2" fill="#382012" />
                </>
              )}

              {/* Table Top */}
              {t.shape === 'round' ? (
                <circle
                  r="30"
                  fill={fill}
                  stroke={isT5 && state.table5Active ? '#E8500C' : '#F7F2ED'}
                  strokeOpacity={isT5 && state.table5Active ? '1' : '0.28'}
                  strokeWidth={isT5 && state.table5Active ? '2.5' : '1.2'}
                />
              ) : (
                <rect
                  x="-28"
                  y="-28"
                  width="56"
                  height="56"
                  rx="6"
                  fill={fill}
                  stroke="#F7F2ED"
                  strokeOpacity="0.28"
                  strokeWidth="1.2"
                />
              )}

              {/* QR Table Code Square */}
              {showCode && (
                <g transform="translate(7, -18)">
                  <rect
                    width="13"
                    height="13"
                    rx="2"
                    fill="#F7F2ED"
                    stroke="#E8500C"
                    strokeWidth="1.2"
                  />
                  <rect x="2.5" y="2.5" width="3" height="3" fill="#140905" />
                  <rect x="7.5" y="2.5" width="3" height="3" fill="#140905" />
                  <rect x="2.5" y="7.5" width="3" height="3" fill="#140905" />
                  <rect x="6" y="6" width="2.5" height="2.5" fill="#E8500C" />
                </g>
              )}

              {/* Scan line on Table 5 */}
              {isT5 && state.scanLineProgress > 0 && state.scanLineProgress < 1 && (
                <line
                  x1="-22"
                  y1={-16 + state.scanLineProgress * 32}
                  x2="22"
                  y2={-16 + state.scanLineProgress * 32}
                  stroke="#FBEFE6"
                  strokeWidth="2.5"
                />
              )}

              {/* Table Number + Status Letter (never colour alone) */}
              <text
                x="0"
                y="-2"
                fill="#FBEFE6"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                T{t.id}
              </text>
              <text
                x="0"
                y="13"
                fill="#F7F2ED"
                fillOpacity="0.85"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight="600"
                textAnchor="middle"
              >
                [{status}]
              </text>
            </g>
          );
        })}

        {/* Level 1 Zoomed-in Digital Menu Callout on Table 5 */}
        {state.showTable5MenuCard && (
          <g transform={`translate(${t5Pos.sx + 44}, ${t5Pos.sy - 82})`}>
            {/* Scan beam connector from Table 5 QR code to Menu Card */}
            <path
              d="M -32 72 L 0 42 L 0 96 Z"
              fill="#E8500C"
              fillOpacity="0.28"
            />
            <line
              x1="-32"
              y1="72"
              x2="0"
              y2="68"
              stroke="#E8500C"
              strokeWidth="2"
              strokeDasharray="3 2"
            />
            <rect
              x="0"
              y="0"
              width="156"
              height="118"
              rx="10"
              fill="#FFFFFF"
              stroke="#E8500C"
              strokeWidth="2"
            />
            <rect x="6" y="6" width="144" height="20" rx="5" fill="#1A0C06" />
            <text x="12" y="19" fill="#FBEFE6" fontSize="8.5" fontWeight="700">
              TABLE 5 · MENU
            </text>
            <text x="142" y="19" fill="#FF8741" fontSize="7.5" fontWeight="700" textAnchor="end">
              NO APP
            </text>
            {/* Dish 1 */}
            <rect x="6" y="31" width="144" height="24" rx="5" fill="#F7F2ED" stroke="#E3D9D3" strokeWidth="1" />
            <circle cx="17" cy="43" r="6" fill="#C88A5A" />
            <text x="27" y="46" fill="#1A0C06" fontSize="8.5" fontWeight="700">
              Flat white
            </text>
            <text x="142" y="46" fill="#C03E0A" fontSize="8.5" fontWeight="700" textAnchor="end">
              3.50
            </text>
            {/* Dish 2 */}
            <rect x="6" y="59" width="144" height="24" rx="5" fill="#F7F2ED" stroke="#E3D9D3" strokeWidth="1" />
            <circle cx="17" cy="71" r="6" fill="#8C3F19" />
            <text x="27" y="74" fill="#1A0C06" fontSize="8.5" fontWeight="700">
              Smash burger
            </text>
            <text x="142" y="74" fill="#C03E0A" fontSize="8.5" fontWeight="700" textAnchor="end">
              9.50
            </text>
            {/* Dish 3 */}
            <rect x="6" y="87" width="144" height="24" rx="5" fill="#F7F2ED" stroke="#E3D9D3" strokeWidth="1" />
            <circle cx="17" cy="99" r="6" fill="#D97B38" />
            <text x="27" y="102" fill="#1A0C06" fontSize="8.5" fontWeight="700">
              Iced latte
            </text>
            <text x="142" y="102" fill="#C03E0A" fontSize="8.5" fontWeight="700" textAnchor="end">
              3.80
            </text>
          </g>
        )}

        {/* Staff Capsules */}
        <g transform={`translate(${staff1Svg.sx}, ${staff1Svg.sy})`}>
          {state.waiterRingPulse > 0 && (
            <g transform="translate(0, -22)">
              <rect x="-42" y="-11" width="84" height="20" rx="6" fill="#E8500C" stroke="#F7F2ED" strokeWidth="1.2" />
              <text y="3" fill="#FBEFE6" fontSize="9.5" fontWeight="700" textAnchor="middle">
                Waiter → T5
              </text>
            </g>
          )}
          <circle r="11" fill="#F7F2ED" stroke="#E8500C" strokeWidth="2.5" />
          <text y="3.5" fill="#140905" fontSize="9" fontWeight="700" textAnchor="middle">
            S1
          </text>
        </g>
        <g transform={`translate(${staff2Svg.sx}, ${staff2Svg.sy})`}>
          <circle r="10" fill="#FFEEE3" stroke="#E8500C" strokeWidth="2.5" />
          <text y="3.5" fill="#140905" fontSize="9" fontWeight="700" textAnchor="middle">
            S2
          </text>
        </g>
      </svg>
    </div>
  );
};
