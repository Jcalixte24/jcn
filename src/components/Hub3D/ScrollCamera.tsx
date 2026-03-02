import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ScrollCameraProps {
  mobile?: boolean;
  onCameraZ: (z: number) => void;
  onScrollSpeed: (speed: number) => void;
  maxDepth: number;
}

/**
 * Camera that moves through space based on wheel/touch scroll.
 * Provides smooth interpolation and subtle mouse parallax.
 */
const ScrollCamera = ({ mobile = false, onCameraZ, onScrollSpeed, maxDepth }: ScrollCameraProps) => {
  const { camera } = useThree();
  const targetZ = useRef(5);
  const currentZ = useRef(5);
  const scrollSpeed = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const touchStart = useRef(0);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.04;
    targetZ.current = Math.max(maxDepth - 5, Math.min(5, targetZ.current - delta));
  }, [maxDepth]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
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

  useFrame(() => {
    // Smooth camera Z interpolation
    const prevZ = currentZ.current;
    currentZ.current += (targetZ.current - currentZ.current) * 0.06;
    scrollSpeed.current = currentZ.current - prevZ;

    // Very subtle parallax (won't interfere with clicking)
    const parallaxX = mobile ? 0 : mouse.current.x * 0.3;
    const parallaxY = mobile ? 0 : -mouse.current.y * 0.15;

    camera.position.set(
      parallaxX,
      0.3 + parallaxY,
      currentZ.current
    );
    camera.lookAt(parallaxX * 0.3, parallaxY * 0.3, currentZ.current - 10);

    onCameraZ(currentZ.current);
    onScrollSpeed(scrollSpeed.current);
  });

  return null;
};

export default ScrollCamera;
