"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link2, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingNavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function LandingNavbar({ theme, onToggleTheme }: LandingNavbarProps): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="light:bg-white/80 light:border-slate-200 sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl transition-colors dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="light:text-slate-900 flex items-center gap-2 text-xl font-bold text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f76707]/10 text-[#f76707]">
            <Link2 className="h-5 w-5" />
          </span>
          <span className="tracking-tight">Glix Connect</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="light:text-slate-600 hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a href="#features" className="transition-colors hover:text-[#f76707]">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-[#f76707]">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-[#f76707]">
            FAQ
          </a>
          <a href="#contact" className="transition-colors hover:text-[#f76707]">
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={onToggleTheme}
            className="light:border-slate-300 light:text-slate-700 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-all hover:border-white/20 hover:text-white"
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="light:border-slate-300 light:text-slate-800 border-white/20 text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-[#f76707] font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-[#e05d06]"
            >
              Register Org
            </Button>
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleTheme}
            className="light:border-slate-300 light:text-slate-700 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-slate-300"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="light:text-slate-700 p-1 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen ? (
        <div className="light:bg-white light:border-slate-200 space-y-3 border-b border-white/10 bg-slate-900/95 px-6 py-4 md:hidden">
          <div className="light:text-slate-700 flex flex-col gap-2.5 text-sm font-medium text-slate-300">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="light:text-slate-900 w-full text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-[#f76707] text-white hover:bg-[#e05d06]">
                Register Org
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
