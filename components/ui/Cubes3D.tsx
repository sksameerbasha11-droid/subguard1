"use client";

import React from "react";

export const Cubes3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative w-28 h-24 select-none pointer-events-none flex items-center justify-center ${className}`}>
      {/* Glow aura */}
      <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl" />

      <svg viewBox="0 0 140 120" className="w-full h-full relative z-10" fill="none">
        <defs>
          {/* Isometric cube 1 gradients (Main big cube) */}
          <linearGradient id="cubeTop1" x1="45" y1="25" x2="85" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="1" stopColor="#BFDBFE" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="cubeLeft1" x1="45" y1="45" x2="45" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" stopOpacity="0.85" />
            <stop offset="1" stopColor="#1D4ED8" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="cubeRight1" x1="85" y1="45" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="1" stopColor="#2563EB" stopOpacity="0.85" />
          </linearGradient>

          {/* Cube 2 (upper right smaller cube) */}
          <linearGradient id="cubeTop2" x1="85" y1="5" x2="115" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BAE6FD" stopOpacity="0.95" />
            <stop offset="1" stopColor="#E0F2FE" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="cubeLeft2" x1="85" y1="20" x2="85" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0284C7" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="cubeRight2" x1="115" y1="20" x2="115" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7DD3FC" stopOpacity="0.8" />
            <stop offset="1" stopColor="#0369A1" stopOpacity="0.85" />
          </linearGradient>

          {/* Cube 3 (lower right floating crystal) */}
          <linearGradient id="cubeTop3" x1="90" y1="65" x2="120" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C7D2FE" stopOpacity="0.95" />
            <stop offset="1" stopColor="#E0E7FF" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="cubeLeft3" x1="90" y1="80" x2="90" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" stopOpacity="0.85" />
            <stop offset="1" stopColor="#4338CA" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="cubeRight3" x1="120" y1="80" x2="120" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#4F46E5" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Cube 2 (Background Upper) */}
        <g filter="drop-shadow(0 4px 8px rgba(3,105,161,0.25))">
          {/* Top face */}
          <polygon points="100,8 122,20 100,32 78,20" fill="url(#cubeTop2)" stroke="#FFFFFF" strokeWidth="0.8" />
          {/* Left face */}
          <polygon points="78,20 100,32 100,56 78,44" fill="url(#cubeLeft2)" stroke="#FFFFFF" strokeWidth="0.8" />
          {/* Right face */}
          <polygon points="100,32 122,20 122,44 100,56" fill="url(#cubeRight2)" stroke="#FFFFFF" strokeWidth="0.8" />
        </g>

        {/* Cube 1 (Foreground Main) */}
        <g filter="drop-shadow(0 8px 16px rgba(37,99,235,0.35))">
          {/* Top face */}
          <polygon points="65,30 95,46 65,62 35,46" fill="url(#cubeTop1)" stroke="#FFFFFF" strokeWidth="1" />
          {/* Left face */}
          <polygon points="35,46 65,62 65,96 35,80" fill="url(#cubeLeft1)" stroke="#FFFFFF" strokeWidth="1" />
          {/* Right face */}
          <polygon points="65,62 95,46 95,80 65,96" fill="url(#cubeRight1)" stroke="#FFFFFF" strokeWidth="1" />
        </g>

        {/* Cube 3 (Lower Accent) */}
        <g filter="drop-shadow(0 4px 10px rgba(67,56,202,0.3))">
          {/* Top face */}
          <polygon points="108,68 126,78 108,88 90,78" fill="url(#cubeTop3)" stroke="#FFFFFF" strokeWidth="0.8" />
          {/* Left face */}
          <polygon points="90,78 108,88 108,106 90,96" fill="url(#cubeLeft3)" stroke="#FFFFFF" strokeWidth="0.8" />
          {/* Right face */}
          <polygon points="108,88 126,78 126,96 108,106" fill="url(#cubeRight3)" stroke="#FFFFFF" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
};
