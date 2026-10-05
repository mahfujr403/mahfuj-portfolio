"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import "sonner/dist/styles.css";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      closeButton
      duration={4000}
      gap={8}
      className="toaster group"
      toastOptions={{
        style: {
          background: "rgba(14, 19, 27, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#f1f5f9",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 229, 255, 0.08)",
          borderRadius: "12px",
          padding: "14px 16px",
        },
        classNames: {
          toast:
            "group font-sans transition-all duration-200 border !border-[#1e2633] hover:!border-cyan-500/30",
          title: "font-semibold text-sm text-[#f1f5f9] tracking-tight",
          description: "text-xs text-[#94a3b8] mt-0.5",
          closeButton:
            "!opacity-100 !bg-[#172030] !border-[#2b394f] !text-[#94a3b8] hover:!text-[#f1f5f9] hover:!bg-[#222f46] !transition-all !w-5 !h-5 !top-2 !right-2",
          actionButton:
            "bg-[#00e5ff] text-[#080b10] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#00e5ff]/90 transition-colors",
          cancelButton:
            "bg-[#1e2633] text-[#94a3b8] text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#2d3748] transition-colors",
        },
      }}
      icons={{
        success: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </span>
        ),
        error: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </span>
        ),
        info: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </span>
        ),
        loading: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 shrink-0">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </span>
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
