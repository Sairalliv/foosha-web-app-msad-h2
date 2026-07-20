"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="site w-full sticky top-0 z-50">
        <nav className="site flex items-center justify-between px-6 py-4 mx-auto max-w-[1180px]">
          <Link href="/">
            <Image
              className="logo-mark"
              style={{ marginBottom: 0, height: 30, width: "auto" }}
              src="/assets/foosha-logo.png"
              alt="Foosha"
              width={712}
              height={201}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-9 text-sm font-medium text-[var(--paper)]">
            <a href="#how-it-works" className="hover:opacity-100 opacity-80 transition-opacity">How it works</a>
            <a href="#trust-codes" className="hover:opacity-100 opacity-80 transition-opacity">Trust &amp; codes</a>
            <a href="#leaderboard" className="hover:opacity-100 opacity-80 transition-opacity">Leaderboard</a>
            <Link href="/map" className="hover:opacity-100 opacity-80 transition-opacity">Donation Map</Link>
            <Link href="/login" className="hover:opacity-100 opacity-80 transition-opacity">Login</Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/register" className="btn btn-primary">Sign up</Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="lg:hidden p-2 text-[var(--paper)] hover:bg-[rgba(244,236,216,0.05)] rounded-md transition-colors"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-64 max-w-full h-full bg-[var(--bg-deep)] border-l border-[var(--line)] shadow-2xl flex flex-col p-6 overflow-y-auto z-[61] animate-in slide-in-from-right duration-300">
            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-[var(--kalamansi)] uppercase">Menu</span>
              <button 
                className="p-2 text-[var(--paper-dim)] hover:text-[var(--paper)] hover:bg-[rgba(244,236,216,0.05)] rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex w-full flex-col gap-5 text-base font-medium">
                <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[var(--kalamansi)] transition-colors">Home</Link>
                <a href="#how-it-works" onClick={() => setIsOpen(false)} className="hover:text-[var(--kalamansi)] transition-colors">How it works</a>
                <a href="#trust-codes" onClick={() => setIsOpen(false)} className="hover:text-[var(--kalamansi)] transition-colors">Trust &amp; codes</a>
                <a href="#leaderboard" onClick={() => setIsOpen(false)} className="hover:text-[var(--kalamansi)] transition-colors">Leaderboard</a>
                <Link href="/map" onClick={() => setIsOpen(false)} className="hover:text-[var(--kalamansi)] transition-colors">Donation Map</Link>

                <div className="flex flex-col gap-5 border-t border-[var(--line)] pt-5">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-[var(--kalamansi)] transition-colors">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="btn btn-primary w-fit self-start text-center justify-center">Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
