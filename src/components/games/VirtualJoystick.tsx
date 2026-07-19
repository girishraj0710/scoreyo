"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { triggerHaptic } from "@/lib/haptics";

interface VirtualJoystickProps {
  /** Callback when joystick moves - returns angle in radians (-PI/2 to PI/2) */
  onMove: (angle: number) => void;
  /** Maximum radius in pixels */
  radius?: number;
  /** Joystick size */
  size?: number;
  /** Whether joystick is active */
  isActive?: boolean;
}

export default function VirtualJoystick({
  onMove,
  radius = 60,
  size = 140,
  isActive = true,
}: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  // Calculate angle from joystick position
  const calculateAngle = useCallback((x: number, y: number) => {
    // atan2(x, -y) gives angle where 0 is up, positive is right
    const angle = Math.atan2(x, -y);
    // Clamp to 180° arc (-90° to +90°)
    return Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angle));
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isActive || !containerRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;

    triggerHaptic('light');
    setIsPressed(true);

    // Calculate initial position
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    // Limit to radius
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const limitedDistance = Math.min(distance, radius);
    const angle = Math.atan2(deltaY, deltaX);

    const x = Math.cos(angle) * limitedDistance;
    const y = Math.sin(angle) * limitedDistance;

    setPosition({ x, y });
    onMove(calculateAngle(x, y));
  }, [isActive, radius, onMove, calculateAngle]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPressed || !containerRef.current || touchIdRef.current === null) return;
    e.preventDefault();

    // Find the touch that started this interaction
    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    // Limit to radius
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const limitedDistance = Math.min(distance, radius);
    const angle = Math.atan2(deltaY, deltaX);

    const x = Math.cos(angle) * limitedDistance;
    const y = Math.sin(angle) * limitedDistance;

    setPosition({ x, y });
    onMove(calculateAngle(x, y));
  }, [isPressed, radius, onMove, calculateAngle]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;

    // Check if our touch ended
    const touchEnded = !Array.from(e.touches).some(t => t.identifier === touchIdRef.current);
    if (!touchEnded) return;

    e.preventDefault();
    triggerHaptic('selection');

    setIsPressed(false);
    setPosition({ x: 0, y: 0 });
    touchIdRef.current = null;

    // Reset to center (angle 0 = straight up)
    onMove(0);
  }, [onMove]);

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none"
      style={{
        width: size,
        height: size,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Outer ring (boundary) */}
      <div
        className="absolute inset-0 rounded-full border-2 border-blue-500/30 bg-slate-900/50 backdrop-blur-sm transition-all"
        style={{
          boxShadow: isPressed
            ? '0 0 20px rgba(59, 130, 246, 0.4)'
            : '0 0 10px rgba(59, 130, 246, 0.2)',
        }}
      >
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-400/50 -translate-x-1/2 -translate-y-1/2" />

        {/* Direction indicators (8 directions) */}
        <div className="absolute inset-0">
          {/* Up indicator */}
          <div className="absolute top-2 left-1/2 w-1 h-3 bg-blue-500/20 rounded-full -translate-x-1/2" />
          {/* Down indicator */}
          <div className="absolute bottom-2 left-1/2 w-1 h-3 bg-blue-500/20 rounded-full -translate-x-1/2" />
          {/* Left indicator */}
          <div className="absolute top-1/2 left-2 w-3 h-1 bg-blue-500/20 rounded-full -translate-y-1/2" />
          {/* Right indicator */}
          <div className="absolute top-1/2 right-2 w-3 h-1 bg-blue-500/20 rounded-full -translate-y-1/2" />
        </div>
      </div>

      {/* Stick (handle) */}
      <div
        className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg transition-transform"
        style={{
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          boxShadow: isPressed
            ? '0 4px 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)'
            : '0 2px 10px rgba(59, 130, 246, 0.4)',
        }}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-blue-400/30" />

        {/* Center grip lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-1.5">
            <div className="w-8 h-0.5 bg-white/40 rounded-full" />
            <div className="w-8 h-0.5 bg-white/40 rounded-full" />
            <div className="w-8 h-0.5 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-300 font-bold whitespace-nowrap">
        AIM
      </div>
    </div>
  );
}
