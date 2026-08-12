"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoveHorizontal, Compass, RefreshCw, ZoomIn, ZoomOut, Play, Pause, AlertCircle, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VirtualTourProps {
  propertyTitle: string;
}

interface RoomTour {
  name: string;
  image: string;
}
const defaultRooms: RoomTour[] = [
  { 
    name: "Building Exterior", 
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80" 
  },
  { 
    name: "Living Room", 
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80" 
  },
  { 
    name: "Chef's Kitchen", 
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2400&q=80" 
  },
  { 
    name: "Master Suite", 
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=80" 
  },
  { 
    name: "Spa Bathroom", 
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2400&q=80" 
  }
];

export default function VirtualTour({ propertyTitle }: VirtualTourProps) {
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [posX, setPosX] = useState(50); // percentage 0 to 100
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; pos: number } | null>(null);

  const currentRoom = defaultRooms[activeRoomIdx];

  // Auto rotate effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setPosX((prev) => {
        let next = prev + 0.15;
        if (next > 100) next = 0;
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [autoRotate]);

  // Reset parameters when switching rooms
  const handleRoomChange = (idx: number) => {
    setActiveRoomIdx(idx);
    setPosX(50);
    setZoom(1);
    setAutoRotate(true);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setAutoRotate(false);
    dragStartRef.current = {
      x: e.clientX,
      pos: posX,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current || !containerRef.current) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const width = containerRef.current.clientWidth;
    const deltaPercent = (deltaX / width) * 100;
    
    let newPos = dragStartRef.current.pos - deltaPercent * 0.7;
    
    if (newPos > 100) newPos = newPos - 100;
    if (newPos < 0) newPos = newPos + 100;
    
    setPosX(newPos);
  };

  const handleMouseUpOrLeave = () => {
    dragStartRef.current = null;
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setAutoRotate(false);
    if (e.touches.length === 1) {
      dragStartRef.current = {
        x: e.touches[0].clientX,
        pos: posX,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current || !containerRef.current || e.touches.length !== 1) return;
    
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const width = containerRef.current.clientWidth;
    const deltaPercent = (deltaX / width) * 100;
    
    let newPos = dragStartRef.current.pos - deltaPercent * 0.7;
    
    if (newPos > 100) newPos = newPos - 100;
    if (newPos < 0) newPos = newPos + 100;
    
    setPosX(newPos);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
            3D Virtual Space Tour
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Explore the interior layout of {propertyTitle}</p>
        </div>
        
        {/* Controls strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-2xs font-bold uppercase tracking-wider transition-colors border ${
              autoRotate 
                ? "bg-amber-50 border-amber-200 text-amber-700" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {autoRotate ? "Pause Rotate" : "Auto Rotate"}
          </button>

          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setZoom((prev) => Math.max(1, prev - 0.25))}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.25))}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setPosX(50);
                setZoom(1);
                setAutoRotate(true);
              }}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition-colors border-l"
              title="Reset View"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Room Selector Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100/60">
        {defaultRooms.map((room, idx) => {
          const isActive = idx === activeRoomIdx;
          return (
            <button
              key={room.name}
              onClick={() => handleRoomChange(idx)}
              className={`flex-grow sm:flex-grow-0 rounded-lg px-4 py-2 text-2xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {room.name}
            </button>
          );
        })}
      </div>

      {/* Main Panoramic viewport */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
        className="relative h-96 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-900 cursor-grab active:cursor-grabbing select-none group"
      >
        {/* Panoramic image background panned via styles */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-75"
          style={{
            backgroundImage: `url(${currentRoom.image})`,
            backgroundPosition: `${posX}% center`,
            backgroundSize: `${zoom * 300}% 100%`,
            backgroundRepeat: "repeat-x",
          }}
        />

        {/* Overlay helpers */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />
        
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-slate-900/70 backdrop-blur-xs px-3 py-1 text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
          <Eye className="h-3.5 w-3.5 text-amber-400" />
          {currentRoom.name} Panorama
        </div>

        {/* Floating guidance overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur-xs px-4 py-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider border border-white/10 shadow-lg transition-opacity group-hover:opacity-100 opacity-60">
          <MoveHorizontal className="h-4 w-4 text-amber-400 animate-pulse" />
          Drag or swipe to look around
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3 text-3xs font-semibold text-slate-400 uppercase tracking-widest">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Virtual staging represents layout concepts. Actual property fixtures may vary.</span>
      </div>
    </div>
  );
}
