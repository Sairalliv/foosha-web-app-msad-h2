export const metadata = {
  title: 'Analytics - Foosha Admin',
}

export default function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Platform Analytics</h1>
        <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>High-level metrics and distribution data for Mandaue City.</p>
      </div>

      {/* High-level Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Households Helped', value: '208', color: 'var(--jeepney)' },
          { label: 'Value Distributed', value: '₱312K', color: 'var(--kalamansi)' },
          { label: 'Avg. Time to Match', value: '4.6 hrs', color: 'var(--teal)' },
          { label: 'Confirmed in 24h', value: '96%', color: 'var(--paper)' },
        ].map(metric => (
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
                {/* 60% Food (var(--teal)) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="var(--teal)" 
                  strokeWidth="20" 
                  strokeDasharray={`${0.6 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                />
                {/* 40% Cash (var(--jeepney)) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="var(--jeepney)" 
                  strokeWidth="20" 
                  strokeDasharray={`${0.4 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                  strokeDashoffset={`${-0.6 * 2 * Math.PI * 40}`}
                />
              </svg>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--paper)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--teal)' }} />
                  Food Items
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--teal)' }}>60%</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--paper)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--jeepney)' }} />
                  Cash
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--jeepney)' }}>40%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Matches by Barangay Chart */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 24px 0', color: 'var(--paper)' }}>Matches by Barangay</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { name: 'Basak', value: 84, max: 100, color: 'var(--kalamansi)' },
              { name: 'Tipolo', value: 62, max: 100, color: 'var(--teal)' },
              { name: 'Subangdaku', value: 45, max: 100, color: 'var(--jeepney)' },
              { name: 'Ibabao', value: 31, max: 100, color: 'rgba(255,255,255,0.3)' },
            ].map(b => (
              <div key={b.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--paper)' }}>
                  <span>{b.name}</span>
                  <span style={{ fontWeight: 600 }}>{b.value} matches</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${(b.value / b.max) * 100}%`, height: '100%', background: b.color, borderRadius: '99px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
