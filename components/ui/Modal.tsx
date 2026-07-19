'use client'

import React from 'react'

export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13, 26, 23, 0.72)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-panel)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          boxShadow: '0 40px 80px -24px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.04)',
          animation: 'slideUp 0.25s ease both',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="modal-close-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
