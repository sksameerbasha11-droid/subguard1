import React from "react";
import { cn } from "@/lib/utils";

interface ServiceLogoProps {
  name: string;
  size?: number; // 40-48px default container size
  className?: string;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({
  name,
  size = 44,
  className = "",
}) => {
  const normalized = (name || "").toLowerCase().trim();

  // Return crisp vector SVG representations for standard subscription services
  const renderIcon = () => {
    switch (normalized) {
      case "netflix":
        return (
          <div className="w-full h-full bg-black text-[#E50914] flex items-center justify-center font-black text-2xl rounded-2xl shadow-sm border border-black/10 select-none">
            <svg className="w-6 h-6 fill-[#E50914]" viewBox="0 0 24 24">
              <path d="M5.398 0v24c1.196-.18 2.392-.387 3.588-.621V9.932l4.896 13.06c1.182-.234 2.364-.468 3.546-.729V0h-3.588v14.068L8.986 1.002C7.79 1.236 6.594 1.443 5.398 1.677V0z"/>
            </svg>
          </div>
        );
      case "spotify":
        return (
          <div className="w-full h-full bg-[#1ED760] text-black flex items-center justify-center rounded-2xl shadow-sm">
            <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
        );
      case "youtube premium":
      case "youtube":
        return (
          <div className="w-full h-full bg-[#FF0000] text-white flex items-center justify-center rounded-2xl shadow-sm">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );
      case "github":
        return (
          <div className="w-full h-full bg-[#181717] text-white flex items-center justify-center rounded-2xl shadow-sm">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
        );
      case "amazon prime":
      case "prime":
        return (
          <div className="w-full h-full bg-[#00A8E1] text-white flex items-center justify-center font-bold text-xs rounded-2xl shadow-sm tracking-tight">
            prime
          </div>
        );
      case "disney+":
      case "disney":
        return (
          <div className="w-full h-full bg-[#113CCF] text-white flex items-center justify-center font-extrabold text-sm rounded-2xl shadow-sm">
            D+
          </div>
        );
      case "apple music":
        return (
          <div className="w-full h-full bg-gradient-to-tr from-[#FC3C44] to-[#F94C57] text-white flex items-center justify-center text-lg rounded-2xl shadow-sm">
            ♫
          </div>
        );
      case "google one":
        return (
          <div className="w-full h-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center font-black text-sm rounded-2xl shadow-sm">
            G1
          </div>
        );
      case "adobe":
        return (
          <div className="w-full h-full bg-[#FF0000] text-white flex items-center justify-center font-black text-xl rounded-2xl shadow-sm">
            A
          </div>
        );
      case "microsoft 365":
        return (
          <div className="w-full h-full bg-[#D83B01] text-white flex items-center justify-center font-bold text-xs rounded-2xl shadow-sm">
            M365
          </div>
        );
      case "canva":
        return (
          <div className="w-full h-full bg-[#00C4CC] text-white flex items-center justify-center font-bold text-sm rounded-2xl shadow-sm">
            C
          </div>
        );
      case "dropbox":
        return (
          <div className="w-full h-full bg-[#0061FF] text-white flex items-center justify-center font-black text-lg rounded-2xl shadow-sm">
            ✦
          </div>
        );
      case "notion":
        return (
          <div className="w-full h-full bg-black text-white flex items-center justify-center font-serif font-black text-xl rounded-2xl shadow-sm">
            N
          </div>
        );
      case "figma":
        return (
          <div className="w-full h-full bg-[#0ACF83] text-white flex items-center justify-center font-extrabold text-lg rounded-2xl shadow-sm">
            F
          </div>
        );
      case "chatgpt":
        return (
          <div className="w-full h-full bg-[#10A37F] text-white flex items-center justify-center font-bold text-lg rounded-2xl shadow-sm">
            ⚡
          </div>
        );
      case "claude":
        return (
          <div className="w-full h-full bg-[#D97757] text-white flex items-center justify-center font-bold text-lg rounded-2xl shadow-sm">
            ✳
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm rounded-2xl shadow-sm uppercase">
            {name ? name.slice(0, 2) : "SG"}
          </div>
        );
    }
  };

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={cn("flex-shrink-0 relative select-none", className)}
    >
      {renderIcon()}
    </div>
  );
};
