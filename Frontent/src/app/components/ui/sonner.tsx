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
          background: "#111620",
          border: "1px solid #222C3D",
          color: "#F8FAFC",
          boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.7)",
          borderRadius: "8px",
          padding: "14px 16px",
        },
        classNames: {
          toast:
            "group font-sans transition-all duration-200 border !border-[#222C3D] hover:!border-[#334155]",
          title: "font-semibold text-sm text-[#F8FAFC] tracking-tight",
          description: "text-xs text-[#94A3B8] mt-0.5",
          closeButton:
            "!opacity-100 !bg-[#18202E] !border-[#222C3D] !text-[#94A3B8] hover:!text-[#F8FAFC] hover:!bg-[#222C3D] !transition-all !w-5 !h-5 !top-2 !right-2",
          actionButton:
            "bg-[#3B82F6] text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-[#2563EB] transition-colors",
          cancelButton:
            "bg-[#18202E] border border-[#222C3D] text-[#94A3B8] text-xs font-medium px-3 py-1.5 rounded-md hover:text-[#F8FAFC] hover:bg-[#222C3D] transition-colors",
        },
      }}
      icons={{
        success: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </span>
        ),
        error: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/15 text-rose-400 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </span>
        ),
        info: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/15 text-blue-400 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </span>
        ),
        loading: (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/15 text-blue-400 shrink-0">
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
