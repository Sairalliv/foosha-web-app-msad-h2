import { getSupabaseService } from '@/lib/supabaseService.server'
import type { AnalyticsSummary } from '@/lib/supabaseService'
import { AnalyticsRangeSelect } from '@/components/admin/AnalyticsRangeSelect'

export const metadata = {
  title: 'Analytics - Foosha Admin',
}

const EMPTY_ANALYTICS: AnalyticsSummary = {
  householdsHelped: 0,
  valueDistributedPhp: 0,
  avgTimeToMatchHours: null,
  confirmedMatchRatePercent: 0,
  donationSplit: { foodPercent: 0, cashPercent: 0 },
  matchesByBarangay: [],
}

const VALID_RANGES = new Set(['7', '30', '90', 'all'])

function formatPhp(amount: number): string {
  if (amount >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `₱${(amount / 1_000).toFixed(1)}K`
  return `₱${amount.toLocaleString()}`
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const rawRange = resolvedParams?.range
  const range = typeof rawRange === 'string' && VALID_RANGES.has(rawRange) ? rawRange : 'all'
  const rangeDays = range === 'all' ? null : Number(range)

  const supabaseService = await getSupabaseService()
  const analytics = await supabaseService.getAnalytics(rangeDays).catch((err) => {
    console.error('Failed to load analytics:', err)
    return EMPTY_ANALYTICS
  })

  const { foodPercent, cashPercent } = analytics.donationSplit
  const maxBarangayValue = Math.max(1, ...analytics.matchesByBarangay.map((b) => b.value))

  const metrics = [
    { label: 'Households Helped', value: String(analytics.householdsHelped), color: 'var(--jeepney)' },
    { label: 'Value Distributed', value: formatPhp(analytics.valueDistributedPhp), color: 'var(--kalamansi)' },
    {
      label: 'Avg. Time to Match',
      value: analytics.avgTimeToMatchHours == null ? '—' : `${analytics.avgTimeToMatchHours} hrs`,
      color: 'var(--teal)',
    },
    { label: 'Confirmed Match Rate', value: `${analytics.confirmedMatchRatePercent}%`, color: 'var(--paper)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Platform Analytics</h1>
          <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>High-level metrics and distribution data for Cebu City.</p>
        </div>
        <AnalyticsRangeSelect value={range} />
      </div>

      {/* High-level Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {metrics.map(metric => (
          <div key={metric.label} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: metric.color, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>{metric.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--paper-dim)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{metric.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Food vs. Cash Pie Chart */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 32px 0', color: 'var(--paper)' }}>Donation Type Split</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="var(--teal)"
                  strokeWidth="20"
                  strokeDasharray={`${(foodPercent / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                />
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="var(--jeepney)"
                  strokeWidth="20"
                  strokeDasharray={`${(cashPercent / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                  strokeDashoffset={`${-(foodPercent / 100) * 2 * Math.PI * 40}`}
                />
              </svg>
            </div>

            <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--paper)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--teal)' }} />
                  Food Items
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--teal)' }}>{foodPercent}%</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--paper)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--jeepney)' }} />
                  Cash
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--jeepney)' }}>{cashPercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmed Matches by Barangay */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 24px 0', color: 'var(--paper)' }}>Confirmed Matches by Barangay</h3>

          {analytics.matchesByBarangay.length === 0 ? (
            <p style={{ color: 'var(--paper-dim)', fontSize: '14px' }}>No confirmed matches yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {analytics.matchesByBarangay.map((b, i) => (
                <div key={b.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--paper)' }}>
                    <span>{b.name}</span>
                    <span style={{ fontWeight: 600 }}>{b.value} match{b.value === 1 ? '' : 'es'}</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(b.value / maxBarangayValue) * 100}%`,
                        height: '100%',
                        background: i === 0 ? 'var(--kalamansi)' : i === 1 ? 'var(--teal)' : i === 2 ? 'var(--jeepney)' : 'rgba(255,255,255,0.3)',
                        borderRadius: '99px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
