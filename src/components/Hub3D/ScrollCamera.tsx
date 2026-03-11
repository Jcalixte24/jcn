import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ScrollCameraProps {
  mobile?: boolean;
  onCameraZ: (z: number) => void;
  onScrollSpeed: (speed: number) => void;
  maxDepth: number;
  autoScroll?: boolean;
  warpActive?: boolean;
  disabled?: boolean;
  returnToStart?: boolean;
  onReturnComplete?: () => void;
  waypointZs?: number[];
}

const DEG2RAD = Math.PI / 180;
const MAX_ROLL = 20 * DEG2RAD;

const ScrollCamera = ({
  mobile = false,
  onCameraZ,
  onScrollSpeed,
  maxDepth,
  autoScroll = false,
  warpActive = false,
  disabled = false,
  returnToStart = false,
  onReturnComplete,
  waypointZs = [],
}: ScrollCameraProps) => {
  const { camera } = useThree();
  const targetZ = useRef(warpActive ? -60 : 5);
  const currentZ = useRef(warpActive ? -60 : 5);
  const scrollSpeed = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const touchStart = useRef(0);
  const lastInteraction = useRef(Date.now());
  const disabledRef = useRef(disabled);

  // Keep disabledRef in sync — avoids stale closure in native handlers
  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const currentRoll = useRef(0);
  const currentPitch = useRef(0);
  const currentYaw = useRef(0);

  const returning = useRef(false);
  const returnStarted = useRef(false);
  const pauseTimer = useRef(0);
  const pausedAtWaypoint = useRef<number | null>(null);

  useEffect(() => {
    if (returnToStart && !returnStarted.current) {
      returning.current = true;
      returnStarted.current = true;
      targetZ.current = 5;
    }
    if (!returnToStart) {
      returnStarted.current = false;
    }
  }, [returnToStart]);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Guard via ref so native handler sees live value
    if (disabledRef.current || returning.current) return;
    e.preventDefault();
    lastInteraction.current = Date.now();
    const delta = e.deltaY * 0.04;
    targetZ.current = Math.max(maxDepth - 5, Math.min(5, targetZ.current - delta));
  }, [maxDepth]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabledRef.current || returning.current) return;
    touchStart.current = e.touches[0].clientY;
    lastInteraction.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabledRef.current || returning.current) return;
    e.preventDefault();
    lastInteraction.current = Date.now();
    const delta = (touchStart.current - e.touches[0].clientY) * 0.08;
    touchStart.current = e.touches[0].clientY;
    targetZ.current = Math.max(maxDepth - 5, Math.min(5, targetZ.current - delta));
  }, [maxDepth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (disabledRef.current) return;
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("hub3d-container");
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    if (!mobile) window.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mobile, handleWheel, handleTouchStart, handleTouchMove, handleMouseMove]);

  useFrame((_, delta) => {
    if (warpActive) {
      targetZ.current += (5 - targetZ.current) * 0.03;
    }

    if (returning.current) {
      const diff = Math.abs(currentZ.current - 5);
      if (diff < 0.5) {
        returning.current = false;
        onReturnComplete?.();
      }
    }

    if (autoScroll && !warpActive && !returning.current && !disabled) {
      const idle = Date.now() - lastInteraction.current;
      if (idle > 10000) {
        const nearWaypoint = waypointZs.find(wz => Math.abs(targetZ.current - wz) < 1.5);
        if (nearWaypoint !== undefined && pausedAtWaypoint.current !== nearWaypoint) {
          pausedAtWaypoint.current = nearWaypoint;
          pauseTimer.current = 0;
        }
        if (pausedAtWaypoint.current !== null) {
          pauseTimer.current += delta;
          if (pauseTimer.current >= 3) {
            pausedAtWaypoint.current = null;
            targetZ.current = Math.max(maxDepth - 5, targetZ.current - delta * 1.2);
          }
        } else {
          targetZ.current = Math.max(maxDepth - 5, targetZ.current - delta * 1.2);
        }
      }
    }

    const prevZ = currentZ.current;
    const lerpFactor = returning.current ? 0.025 : warpActive ? 0.04 : 0.06;
    currentZ.current += (targetZ.current - currentZ.current) * lerpFactor;
    scrollSpeed.current = currentZ.current - prevZ;

    const targetYaw = mobile ? 0 : mouse.current.x * MAX_ROLL;
    const targetPitch = mobile ? 0 : mouse.current.y * 8 * DEG2RAD;
    const targetRoll = -scrollSpeed.current * 15;
    const clampedRoll = Math.max(-MAX_ROLL, Math.min(MAX_ROLL, targetRoll));

    currentYaw.current += (targetYaw - currentYaw.current) * 0.04;
    currentPitch.current += (targetPitch - currentPitch.current) * 0.04;
    currentRoll.current += (clampedRoll - currentRoll.current) * 0.06;

    const parallaxX = mobile ? 0 : mouse.current.x * 0.3;
    const parallaxY = mobile ? 0 : -mouse.current.y * 0.12;

    camera.position.set(parallaxX, 0.3 + parallaxY, currentZ.current);

    const lookTarget = new THREE.Vector3(
      parallaxX + Math.sin(currentYaw.current) * 2,
      0.3 + parallaxY + Math.sin(currentPitch.current) * 0.5,
      currentZ.current - 10
    );
    camera.lookAt(lookTarget);
    camera.rotateZ(currentRoll.current);

    onCameraZ(currentZ.current);
    onScrollSpeed(scrollSpeed.current);
  });

  return null;
};

export default ScrollCamera;
