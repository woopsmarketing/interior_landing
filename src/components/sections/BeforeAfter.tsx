"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { ChevronsLeftRight } from "lucide-react";

// 실제 이미지로 교체 시 아래 상수만 변경하세요
const BEFORE_SRC = "/before.jpg";
const AFTER_SRC = "/after.jpg";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50); // 0~100 %
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const moveHandler = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(5, Math.min(95, pct)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsAnimating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    moveHandler(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = () => setIsAnimating(false);

  const handleTouchMove = (e: React.TouchEvent) => {
    moveHandler(e.touches[0].clientX);
  };

  const snapTo = (target: number) => {
    setIsAnimating(true);
    setPosition(target);
  };

  return (
    <section className="w-full bg-[#FFF9F5] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
          Before / After
        </p>
        <div
          ref={containerRef}
          className="relative h-[480px] cursor-ew-resize select-none overflow-hidden rounded-2xl shadow-md sm:h-[680px]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* AFTER — full background (right side) */}
          <div className="absolute inset-0 bg-orange-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AFTER_SRC}
              alt="인테리어 이후"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* BEFORE — clipped to position% from left */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width: `${position}%`,
              transition: isAnimating ? "width 0.5s ease-in-out" : "none",
            }}
            onTransitionEnd={() => setIsAnimating(false)}
          >
            <div
              className="absolute inset-0 bg-gray-300"
              style={{ width: containerWidth > 0 ? containerWidth : "100vw" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BEFORE_SRC}
                alt="인테리어 이전"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ width: containerWidth > 0 ? containerWidth : "100vw" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Divider line */}
          <div
            className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-white shadow-lg"
            style={{
              left: `${position}%`,
              transition: isAnimating ? "left 0.5s ease-in-out" : "none",
            }}
          >
            {/* Handle button */}
            <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl pointer-events-auto cursor-ew-resize">
              <ChevronsLeftRight className="h-5 w-5 text-gray-600" />
            </div>
          </div>

          {/* Labels — clickable buttons */}
          <button
            type="button"
            onClick={() => snapTo(5)}
            className="absolute left-4 top-4 rounded bg-black/60 px-3 py-1 text-sm font-semibold text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => snapTo(95)}
            className="absolute right-4 top-4 rounded bg-black/60 px-3 py-1 text-sm font-semibold text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            이후
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          구분선을 드래그하면 인테리어 전후를 비교할 수 있습니다
        </p>
      </div>
    </section>
  );
}
