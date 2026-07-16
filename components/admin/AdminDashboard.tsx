'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard,
  HandHeart,
  HelpCircle,
  ShieldCheck,
  Trophy,
  BarChart3,
  Users,
  FileText,
  Search,
  Bell,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Banknote,
  LogOut,
} from 'lucide-react'
import { logoutAction } from '@/actions/auth-actions'

/* ────────────────────────────────────────────────────────────────────
   Mock Data — Mandaue City–flavored
   ──────────────────────────────────────────────────────────────────── */

const MATCHING_QUEUE = [
  {
    id: 'MC-0512',
    requestor: 'Lola Remedios Canoy',
    priority: 'elderly' as const,
    donor: 'Basak Sari-Sari Store',
    item: 'Rice (5kg), Canned Sardines ×4',
    kind: 'food' as const,
    status: 'pending' as const,
  },
  {
    id: 'MC-0513',
    requestor: 'Baby Althea Fernandez',
    priority: 'infant' as const,
    donor: 'Tipolo Bakeshop',
    item: 'Powdered Milk ×3, Cerelac ×2',
    kind: 'food' as const,
    status: 'pending' as const,
  },
  {
    id: 'MC-0514',
    requestor: 'Roberto Escaño (PWD)',
    priority: 'pwd' as const,
    donor: 'Dela Peña Family',
    item: '₱1,500 Cash Assistance',
    kind: 'cash' as const,
    status: 'dispatched' as const,
  },
  {
    id: 'MC-0515',
    requestor: 'Garcia Household',
    priority: 'general' as const,
    donor: 'Subangdaku Rotary Club',
    item: 'Rice (10kg), Cooking Oil ×2',
    kind: 'food' as const,
    status: 'pending' as const,
  },
  {
    id: 'MC-0516',
    requestor: 'Lolo Vicente Daan',
    priority: 'elderly' as const,
    donor: 'M. Fernandez',
    item: '₱800 Cash Assistance',
    kind: 'cash' as const,
    status: 'dispatched' as const,
  },
  {
    id: 'MC-0517',
    requestor: 'Ramos Family',
    priority: 'general' as const,
    donor: 'Anonymous Donor',
    item: 'Noodles ×12, Canned Goods ×6',
    kind: 'food' as const,
    status: 'pending' as const,
  },
]

const VERIFICATION_FEED = [
  {
    id: 'MC-0498',
    donor: 'Basak Sari-Sari Store',
    recipient: 'P. Ramos household',
    item: 'Rice, canned goods, milk',
    code: '7Q3K',
    time: '2 min ago',
  },
  {
    id: 'MC-0496',
    donor: 'Anonymous cash gift',
    recipient: 'Lolo Vicente, 74',
    item: '₱1,200 Cash',
    code: '9XM2',
    time: '18 min ago',
  },
  {
    id: 'MC-0493',
    donor: 'Dela Peña Family',
    recipient: 'Marcelo Household',
    item: 'Rice (5kg), cooking oil',
    code: 'A4KN',
    time: '45 min ago',
  },
  {
    id: 'MC-0491',
    donor: 'Tipolo Bakeshop',
    recipient: 'Baby Jenna Cruz',
    item: 'Powdered Milk ×2, bread',
    code: 'R8PQ',
    time: '1 hr ago',
  },
]

const LEADERBOARD = [
  {
    rank: 1,
    name: 'Basak Sari-Sari Store',
    amount: '₱18,400',
    badges: ['bayani', 'first'],
  },
  {
    rank: 2,
    name: 'Dela Peña Family',
    amount: '₱11,050',
    badges: ['first'],
  },
  {
    rank: 3,
    name: 'Tipolo Bakeshop',
    amount: '₱7,900',
    badges: ['first'],
  },
  {
    rank: 4,
    name: 'Subangdaku Rotary Club',
    amount: '₱6,200',
    badges: [],
  },
  {
    rank: 5,
    name: 'M. Fernandez',
    amount: '₱4,850',
    badges: [],
  },
]

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin', active: true, group: 'main' },
  { label: 'Manage Donations', icon: HandHeart, href: '/admin', count: 24, group: 'main' },
  { label: 'Assistance Requests', icon: HelpCircle, href: '/admin', count: 18, group: 'main' },
  { label: 'Verification Logs', icon: ShieldCheck, href: '/admin', group: 'main' },
  { label: 'Leaderboards', icon: Trophy, href: '/admin', group: 'main' },
  { label: 'Impact Reports', icon: BarChart3, href: '/admin', group: 'main' },
  { label: 'User Management', icon: Users, href: '/admin', group: 'admin' },
  { label: 'System Logs', icon: FileText, href: '/admin', group: 'admin' },
]

/* ────────────────────────────────────────────────────────────────────
   Badge Icon Helper
   ──────────────────────────────────────────────────────────────────── */
function BadgeIcons({ badges }: { badges: string[] }) {
  return (
    <div className="lb-badges">
      {badges.map((b) => (
        <span key={b} className={`lb-badge-icon ${b}`} title={b === 'bayani' ? 'Bayani ng Barangay' : 'First Harvest'}>
          {b === 'bayani' ? '★' : '🌱'}
        </span>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Admin Dashboard Component
   ──────────────────────────────────────────────────────────────────── */

interface AdminDashboardProps {
  adminName: string
  adminInitials: string
}

export default function AdminDashboard({ adminName, adminInitials }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Overview')

  const mainNav = NAV_ITEMS.filter((n) => n.group === 'main')
  const adminNav = NAV_ITEMS.filter((n) => n.group === 'admin')

  return (
    <div className="app admin-app">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <Image
          className="logo-mark"
          src="/assets/foosha-logo.png"
          alt="Foosha"
          width={712}
          height={201}
          priority
        />
        <div className="logo-sub">City Government</div>

        {/* Main navigation */}
        <div className="nav-group">
          <div className="nav-label">Platform</div>
          {mainNav.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <item.icon className="nav-icon" size={18} />
                {item.label}
              </span>
              {item.count && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
        </div>

        {/* Admin section */}
        <div className="nav-group">
          <div className="nav-label">Admin</div>
          {adminNav.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <item.icon className="nav-icon" size={18} />
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="sidebar-foot">
          <form action={logoutAction}>
            <button type="submit" className="mini-profile">
              <div className="avatar teal">{adminInitials}</div>
              <div>
                <div className="who">{adminName}</div>
                <div className="role">admin · Log out</div>
              </div>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Area ───────────────────────────────────────────────── */}
      <main>
        {/* Header */}
        <div className="admin-header">
          <h1 className="header-title">Project Foosha Admin Portal — Mandaue City</h1>
          <div className="header-right">
            <div className="header-search">
              <Search className="search-icon" size={14} />
              <input
                type="text"
                placeholder="Search families, IDs, transactions…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="admin-global-search"
              />
            </div>
            <button className="header-btn" id="admin-notifications" title="Notifications">
              <Bell size={20} />
              <span className="notif-badge">3</span>
            </button>
            <div className="header-profile">
              <div className="avatar teal" style={{ fontSize: 13 }}>{adminInitials}</div>
              <span className="profile-name">{adminName.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="admin-content">
          {/* Page Title */}
          <div className="page-head" style={{ marginBottom: 24 }}>
            <div>
              <div className="eyebrow">
                <Clock size={13} />
                Live overview · July 2026
              </div>
              <h1>Dashboard</h1>
              <p className="sub">
                Supply, demand, and delivery status across all barangays.
              </p>
            </div>
          </div>

          {/* ── Metric Cards ──────────────────────────────────────── */}
          <div className="stat-row admin-stats stagger" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {/* Card 1: Active Requests */}
            <div className="admin-stat-card urgent slide-up">
              <div>
                <h4>Total Active Requests</h4>
                <div className="primary-num">47</div>
              </div>
              <div className="stat-breakdown">
                <span className="stat-pill elderly">
                  <AlertTriangle size={11} />
                  Elderly <span className="val">14</span>
                </span>
                <span className="stat-pill pwd">
                  <AlertTriangle size={11} />
                  PWD <span className="val">9</span>
                </span>
                <span className="stat-pill infant">
                  <AlertTriangle size={11} />
                  Infant <span className="val">7</span>
                </span>
              </div>
            </div>

            {/* Card 2: Donations This Month */}
            <div className="admin-stat-card slide-up">
              <h4>Donations Received This Month</h4>
              <div className="double-stat-wrap">
                <div className="half-stat">
                  <div className="primary-num" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Package size={22} style={{ opacity: 0.6 }} />
                    156
                  </div>
                  <div className="sub-label">Food items</div>
                </div>
                <div className="half-stat cash">
                  <div className="primary-num" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Banknote size={22} style={{ opacity: 0.6 }} />
                    ₱48.2k
                  </div>
                  <div className="sub-label">Cash donations</div>
                </div>
              </div>
            </div>

            {/* Card 3: Verified Deliveries */}
            <div className="admin-stat-card slide-up">
              <div>
                <h4>Successful Deliveries</h4>
                <div className="primary-num" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={24} style={{ opacity: 0.7 }} />
                  132
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className="delta up">↑ 12% vs. last month</span>
                <span className="section-tag">OTP verified</span>
              </div>
            </div>
          </div>

          {/* ── Main Grid: Queue + Sidebar ─────────────────────────── */}
          <div className="admin-grid" style={{ marginTop: 28 }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Matching Queue Table */}
              <div className="admin-table-panel slide-up">
                <div className="panel-head">
                  <h3>Matching Queue — Priority Dispatch</h3>
                  <span className="section-tag">{MATCHING_QUEUE.length} pending</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table" id="matching-queue-table">
                    <thead>
                      <tr>
                        <th>Requestor</th>
                        <th>Priority</th>
                        <th>Matched Donor</th>
                        <th>Item / Amount</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MATCHING_QUEUE.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div className="td-primary">{row.requestor}</div>
                            <div className="td-secondary">{row.id}</div>
                          </td>
                          <td>
                            <span className={`priority-tag ${row.priority}`}>
                              {row.priority === 'pwd' ? 'PWD' : row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
                            </span>
                          </td>
                          <td>{row.donor}</td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              <span className={`kind-badge ${row.kind}`}>
                                {row.kind === 'food' ? '🍚' : '💵'} {row.kind}
                              </span>
                              {row.item}
                            </span>
                          </td>
                          <td>
                            <span className={`status-chip ${row.status === 'pending' ? 'matching' : 'awaiting_pickup'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {row.status === 'pending' ? (
                              <button className="btn-dispatch pending">
                                Dispatch
                              </button>
                            ) : (
                              <button className="btn-dispatch dispatched">
                                Dispatched
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verification Tracker Feed */}
              <div className="admin-table-panel slide-up">
                <div className="panel-head">
                  <h3>Verification Tracker</h3>
                  <Link href="/admin" className="panel-head" style={{ margin: 0 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--kalamansi)', fontWeight: 600 }}>
                      View all logs <ChevronRight size={13} style={{ display: 'inline' }} />
                    </span>
                  </Link>
                </div>
                <div className="verification-feed">
                  {VERIFICATION_FEED.map((item) => (
                    <div className="feed-item" key={item.id}>
                      <div className="feed-icon">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="feed-content">
                        <p>
                          <strong>{item.donor}</strong> → <strong>{item.recipient}</strong>
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--paper-dim)', margin: 0 }}>
                          {item.item}
                        </p>
                        <div className="feed-meta">
                          <span className="ticket-ref">#{item.id}</span>
                          <span>Code: {item.code}</span>
                          <span style={{ marginLeft: 'auto', color: '#6f8377' }}>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Leaderboard */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Leaderboard Widget */}
              <div className="leaderboard-widget slide-up">
                <div className="panel-head" style={{ marginBottom: 0 }}>
                  <h3>
                    <Trophy size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px', color: 'var(--kalamansi)' }} />
                    Top Donors
                  </h3>
                  <span className="section-tag">This month</span>
                </div>
                <div className="lb-list">
                  {LEADERBOARD.map((donor) => (
                    <div className="lb-item" key={donor.rank}>
                      <div className="lb-rank">{donor.rank}</div>
                      <div className="lb-info">
                        <div className="lb-name">{donor.name}</div>
                        <div className="lb-amount">{donor.amount}</div>
                        {donor.badges.length > 0 && <BadgeIcons badges={donor.badges} />}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/admin"
                  className="btn btn-ghost btn-sm btn-block"
                  style={{ marginTop: 20, fontSize: 12.5 }}
                >
                  View Full Leaderboard
                </Link>
              </div>

              {/* Quick Stats Mini Panel */}
              <div className="panel slide-up">
                <div className="panel-head" style={{ marginBottom: 14 }}>
                  <h3>Delivery Summary</h3>
                  <span className="section-tag">July 2026</span>
                </div>
                <div className="delivery-summary" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
                  {/* Delivery Ring */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div className="delivery-ring">
                      <svg viewBox="0 0 100 100" width="100" height="100">
                        {/* background ring */}
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-deep)" strokeWidth="10" />
                        {/* confirmed arc (73%) */}
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="var(--teal)"
                          strokeWidth="10"
                          strokeDasharray={`${0.73 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                          strokeLinecap="round"
                        />
                        {/* dispatched arc (additional 18%) */}
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="var(--kalamansi)"
                          strokeWidth="10"
                          strokeDasharray={`${0.18 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                          strokeDashoffset={`${-0.73 * 2 * Math.PI * 42}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="delivery-ring-label">
                        <span className="ring-num">73%</span>
                        <span className="ring-sub">delivered</span>
                      </div>
                    </div>
                    <div className="delivery-legend">
                      <div className="delivery-legend-item">
                        <div className="delivery-legend-dot" style={{ background: 'var(--teal)' }} />
                        Confirmed (132)
                      </div>
                      <div className="delivery-legend-item">
                        <div className="delivery-legend-dot" style={{ background: 'var(--kalamansi)' }} />
                        Dispatched (33)
                      </div>
                      <div className="delivery-legend-item">
                        <div className="delivery-legend-dot" style={{ background: 'var(--bg-deep)' }} />
                        Pending (16)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Breakdown mini panel */}
              <div className="panel slide-up">
                <div className="panel-head" style={{ marginBottom: 14 }}>
                  <h3>Priority Queue</h3>
                </div>
                <div className="hbar-row">
                  <div className="hbar-top">
                    <span className="nm">Elderly</span>
                    <span className="val">14 requests</span>
                  </div>
                  <div className="hbar-track">
                    <div className="hbar-fill" style={{ width: '62%' }} />
                  </div>
                </div>
                <div className="hbar-row">
                  <div className="hbar-top">
                    <span className="nm">PWD</span>
                    <span className="val">9 requests</span>
                  </div>
                  <div className="hbar-track">
                    <div className="hbar-fill alt" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="hbar-row">
                  <div className="hbar-top">
                    <span className="nm">Infant</span>
                    <span className="val">7 requests</span>
                  </div>
                  <div className="hbar-track">
                    <div className="hbar-fill" style={{ width: '31%', background: 'linear-gradient(90deg, var(--teal), #7da898)' }} />
                  </div>
                </div>
                <div className="hbar-row">
                  <div className="hbar-top">
                    <span className="nm">General</span>
                    <span className="val">17 requests</span>
                  </div>
                  <div className="hbar-track">
                    <div className="hbar-fill" style={{ width: '75%', background: 'linear-gradient(90deg, #5f7268, #4a5750)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
