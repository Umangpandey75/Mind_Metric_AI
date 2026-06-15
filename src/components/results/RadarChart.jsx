import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'

/* ── Custom Tooltip ─────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { subject, value } = payload[0].payload
  return (
    <div className="bg-white dark:bg-cardDark border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 dark:text-gray-100">{subject}</p>
      <p className="text-primary dark:text-primaryDark font-bold">{Math.round(value)}%</p>
    </div>
  )
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function RadarChart({ scores = {}, size = 340 }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Convert { TraitA: 75, TraitB: 60 } → Recharts data array
  const data = Object.entries(scores).map(([trait, value]) => ({
    subject: trait,
    value: Math.round(value),
    fullMark: 100,
  }))

  if (data.length === 0) return null

  // Theme-aware palette
  const gridStroke   = isDark ? '#374151' : '#e5e7eb'   // gray-700 / gray-200
  const tickFill     = isDark ? '#9ca3af' : '#6b7280'   // gray-400 / gray-500
  const radarFill    = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(79,70,229,0.15)'
  const radarStroke  = isDark ? '#818cf8' : '#4F46E5'

  return (
    <div className="w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height={size}>
        <RechartsRadar
          cx="50%"
          cy="50%"
          outerRadius="75%"
          data={data}
        >
          <PolarGrid stroke={gridStroke} strokeDasharray="3 3" />

          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: tickFill,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: tickFill, fontSize: 10 }}
            tickCount={5}
            stroke={gridStroke}
          />

          <Radar
            name="Score"
            dataKey="value"
            stroke={radarStroke}
            fill={radarFill}
            strokeWidth={2}
            dot={{ fill: radarStroke, r: 3, strokeWidth: 0 }}
            activeDot={{ fill: radarStroke, r: 5, strokeWidth: 2, stroke: '#fff' }}
          />

          <Tooltip content={<CustomTooltip />} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}
