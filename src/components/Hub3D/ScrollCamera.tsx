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
  /** Trigger animated return to start */
  returnToStart?: boolean;
  onReturnComplete?: () => void;
  /** Z positions of waypoints for auto-pause */
  waypointZs?: number[];
}

const DEG2RAD = Math.PI / 180;
const MAX_ROLL = 20 * DEG2RAD; // ±20 degrees

const ScrollCamera = ({
  mobile = false,
  onCameraZ,
  onScrollSpeed,
  maxDepth,
  autoScroll = false,
  warpActive = false,
  returnToStart = false,
  onReturnComplete,
}: ScrollCameraProps) => {
  const { camera } = useThree();
  const targetZ = useRef(warpActive ? -60 : 5);
  const currentZ = useRef(warpActive ? -60 : 5);
  const scrollSpeed = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const touchStart = useRef(0);
  const lastInteraction = useRef(Date.now());

  // Rocket tilt state
  const currentRoll = useRef(0);
  const currentPitch = useRef(0);
  const currentYaw = useRef(0);

  // Return animation state
  const returning = useRef(false);
  const returnStarted = useRef(false);

  // Detect returnToStart trigger
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
    if (returning.current) return;
    e.preventDefault();
    lastInteraction.current = Date.now();
    const delta = e.deltaY * 0.04;
    targetZ.current = Math.max(maxDepth - 5, Math.min(5, targetZ.current - delta));
  }, [maxDepth]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (returning.current) return;
    touchStart.current = e.touches[0].clientY;
    lastInteraction.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (returning.current) return;
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
    // Warp intro
    if (warpActive) {
      targetZ.current += (5 - targetZ.current) * 0.03;
    }

    // Return to start animation
    if (returning.current) {
      const diff = Math.abs(currentZ.current - 5);
      if (diff < 0.5) {
        returning.current = false;
        onReturnComplete?.();
      }
    }

    // Auto-scroll when idle
    if (autoScroll && !warpActive && !returning.current) {
      const idle = Date.now() - lastInteraction.current;
      if (idle > 10000) {
        targetZ.current = Math.max(maxDepth - 5, targetZ.current - delta * 1.2);
      }
    }

    // Smooth Z interpolation — faster when returning
    const prevZ = currentZ.current;
    const lerpFactor = returning.current ? 0.025 : warpActive ? 0.04 : 0.06;
    currentZ.current += (targetZ.current - currentZ.current) * lerpFactor;
    scrollSpeed.current = currentZ.current - prevZ;

    // === ROCKET FEEL ===
    // Mouse X → yaw (turning left/right, ±20°)
    const targetYaw = mobile ? 0 : mouse.current.x * MAX_ROLL;
    // Mouse Y → slight pitch
    const targetPitch = mobile ? 0 : mouse.current.y * 8 * DEG2RAD;
    // Scroll speed → roll (banking into turns)
    const targetRoll = -scrollSpeed.current * 15;
    const clampedRoll = Math.max(-MAX_ROLL, Math.min(MAX_ROLL, targetRoll));

    currentYaw.current += (targetYaw - currentYaw.current) * 0.04;
    currentPitch.current += (targetPitch - currentPitch.current) * 0.04;
    currentRoll.current += (clampedRoll - currentRoll.current) * 0.06;

    // Parallax offset from mouse
    const parallaxX = mobile ? 0 : mouse.current.x * 0.3;
    const parallaxY = mobile ? 0 : -mouse.current.y * 0.12;

    camera.position.set(
      parallaxX,
      0.3 + parallaxY,
      currentZ.current
    );

    // Apply rotation via quaternion for proper rocket feel
    const euler = new THREE.Euler(
      currentPitch.current,
      currentYaw.current * 0.15, // subtle yaw on position
      currentRoll.current,
      "YXZ"
    );

    // Look forward with tilt
    const lookTarget = new THREE.Vector3(
      parallaxX + Math.sin(currentYaw.current) * 2,
      0.3 + parallaxY + Math.sin(currentPitch.current) * 0.5,
      currentZ.current - 10
    );
    camera.lookAt(lookTarget);
    
    // Apply roll on top
    camera.rotateZ(currentRoll.current);

    onCameraZ(currentZ.current);
    onScrollSpeed(scrollSpeed.current);
  });

  return null;
};

export default ScrollCamera;
