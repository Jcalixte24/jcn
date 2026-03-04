import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ScrollCameraProps {
  mobile?: boolean;
  onCameraZ: (z: number) => void;
  onScrollSpeed: (speed: number) => void;
  maxDepth: number;
  /** If true, auto-scroll forward slowly */
  autoScroll?: boolean;
  /** Warp intro: camera starts far back and animates to z=5 */
  warpActive?: boolean;
}

/**
 * Camera that moves through space based on wheel/touch scroll.
 * Reduced parallax so users can click easily.
 */
const ScrollCamera = ({
  mobile = false,
  onCameraZ,
  onScrollSpeed,
  maxDepth,
  autoScroll = false,
  warpActive = false,
}: ScrollCameraProps) => {
  const { camera } = useThree();
  const targetZ = useRef(warpActive ? -60 : 5);
  const currentZ = useRef(warpActive ? -60 : 5);
  const scrollSpeed = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const touchStart = useRef(0);
  const lastInteraction = useRef(Date.now());

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    lastInteraction.current = Date.now();
    const delta = e.deltaY * 0.04;
    targetZ.current = Math.max(maxDepth - 5, Math.min(5, targetZ.current - delta));
  }, [maxDepth]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
    lastInteraction.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    lastInteraction.current = Date.now();
    const delta = (touchStart.current - e.touches[0].clientY) * 0.08;
    touchStart.current = e.touches[0].clientY;
    targetZ.current = Math.max(maxDepth - 5, Math.min(5, targetZ.current - delta));
  }, [maxDepth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("hub3d-container");
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    if (!mobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mobile, handleWheel, handleTouchStart, handleTouchMove, handleMouseMove]);

  useFrame((_, delta) => {
    // Warp intro: fast approach to z=5
    if (warpActive) {
      targetZ.current += (5 - targetZ.current) * 0.03;
    }

    // Auto-scroll when idle for 10s
    if (autoScroll && !warpActive) {
      const idle = Date.now() - lastInteraction.current;
      if (idle > 10000) {
        // Slowly drift forward
        targetZ.current = Math.max(maxDepth - 5, targetZ.current - delta * 1.2);
      }
    }

    // Smooth camera Z interpolation
    const prevZ = currentZ.current;
    const lerpFactor = warpActive ? 0.04 : 0.06;
    currentZ.current += (targetZ.current - currentZ.current) * lerpFactor;
    scrollSpeed.current = currentZ.current - prevZ;

    // Very subtle parallax (reduced so clicks work)
    const parallaxX = mobile ? 0 : mouse.current.x * 0.15;
    const parallaxY = mobile ? 0 : -mouse.current.y * 0.08;

    camera.position.set(
      parallaxX,
      0.3 + parallaxY,
      currentZ.current
    );
    camera.lookAt(parallaxX * 0.2, parallaxY * 0.2, currentZ.current - 10);

    onCameraZ(currentZ.current);
    onScrollSpeed(scrollSpeed.current);
  });

  return null;
};

export default ScrollCamera;
