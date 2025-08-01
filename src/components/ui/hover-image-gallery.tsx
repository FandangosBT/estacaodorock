"use client";
import { useState } from "react";

interface HoverImageGalleryProps {
  images?: string[];
}

export function HoverImageGallery({
  images = [
    "https://source.unsplash.com/random/550x550?rock",
    "https://source.unsplash.com/random/550x550?guitar",
    "https://source.unsplash.com/random/550x550?concert",
    "https://source.unsplash.com/random/550x550?crowd",
    "https://source.unsplash.com/random/550x550?band",
  ],
}: HoverImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;

    setMousePosition({ x, y });

    const imageIndex = Math.floor((x / width) * images.length);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, imageIndex));
    setCurrentImageIndex(clampedIndex);
  };

  return (
    <div className="relative group">
      <div
        className="relative w-[550px] h-[550px] overflow-hidden rounded-lg shadow-lg cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={images[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-150 ease-out"
        />

        {isHovering && (
          <div
            className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: mousePosition.x, top: mousePosition.y }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/30 w-12 h-12 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}