"use client";

import React from "react";

export const GlassShield3D: React.FC<{ size?: number; className?: string }> = ({
  size = 180,
  className = "",
}) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/25 via-indigo-400/30 to-purple-400/20 rounded-full blur-2xl animate-pulse" />

      {/* Floating ambient sphere 1 */}
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-blue-300 to-indigo-200 blur-[1px] shadow-[0_0_15px_rgba(99,102,241,0.5)] opacity-80" />

      {/* Floating ambient sphere 2 */}
      <div className="absolute bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-tr from-purple-400 to-pink-300 blur-[1px] shadow-[0_0_12px_rgba(168,85,247,0.5)] opacity-70" />

      {/* Glass Orbital Ring Back */}
      <svg
        className="absolute inset-0 w-full h-full rotate-[-18deg]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <ellipse
          cx="100"
          cy="105"
          rx="75"
          ry="32"
          stroke="url(#ringGrad)"
          strokeWidth="6"
          strokeOpacity="0.45"
          filter="url(#ringBlur)"
        />
        <defs>
          <linearGradient id="ringGrad" x1="20" y1="80" x2="180" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0.6" />
          </linearGradient>
          <filter id="ringBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
      </svg>

      {/* Main 3D Holographic Glass Shield */}
      <svg
        className="relative z-10 w-[72%] h-[72%] drop-shadow-[0_12px_24px_rgba(79,70,229,0.35)]"
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Outer Glass Gradient */}
          <linearGradient id="outerShield" x1="15" y1="10" x2="85" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" stopOpacity="0.85" />
            <stop offset="0.3" stopColor="#60A5FA" stopOpacity="0.75" />
            <stop offset="0.7" stopColor="#6366F1" stopOpacity="0.85" />
            <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.9" />
          </linearGradient>

          {/* Inner Refraction Gradient */}
          <linearGradient id="innerShield" x1="25" y1="20" x2="75" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#DBEAFE" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#4F46E5" stopOpacity="0.75" />
          </linearGradient>

          {/* Highlight Rim Gradient */}
          <linearGradient id="shieldRim" x1="10" y1="5" x2="90" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="0.4" stopColor="#BAE6FD" stopOpacity="0.6" />
            <stop offset="0.8" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.85" />
          </linearGradient>

          {/* Soft blur for outer rim */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shield Outer Path */}
        <path
          d="M50 4 L86 16 C86 58 68 88 50 108 C32 88 14 58 14 16 L50 4 Z"
          fill="url(#outerShield)"
          stroke="url(#shieldRim)"
          strokeWidth="2.5"
          filter="url(#softGlow)"
        />

        {/* Shield Inner Inset Layer */}
        <path
          d="M50 12 L78 22 C78 54 64 80 50 96 C36 80 22 54 22 22 L50 12 Z"
          fill="url(#innerShield)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.2"
        />

        {/* High-gloss diagonal light reflection sheen */}
        <path
          d="M50 12 L78 22 C78 40 70 60 58 72 L32 20 L50 12 Z"
          fill="url(#sheenGrad)"
          opacity="0.35"
        />
        <defs>
          <linearGradient id="sheenGrad" x1="30" y1="15" x2="70" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#93C5FD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Luminous Glowing White Checkmark */}
        <path
          d="M36 52 L46 62 L66 42"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 2px 8px rgba(255,255,255,0.9))"
        />
      </svg>

      {/* Glass Orbital Ring Front */}
      <svg
        className="absolute inset-0 w-full h-full rotate-[-18deg] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M 32 105 A 75 32 0 0 0 168 105"
          stroke="url(#ringFrontGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <defs>
          <linearGradient id="ringFrontGrad" x1="40" y1="110" x2="160" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="0.6" stopColor="#C4B5FD" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
