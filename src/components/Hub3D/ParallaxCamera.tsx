import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ParallaxCamera = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, 0.5, 8));

  // Track mouse
  if (typeof window !== "undefined") {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    // Only add once
    if (!(window as any).__parallaxMouse) {
      window.addEventListener("mousemove", handler);
      (window as any).__parallaxMouse = true;
      // Store for cleanup
      (window as any).__parallaxCleanup = () => {
        window.removeEventListener("mousemove", handler);
        delete (window as any).__parallaxMouse;
        delete (window as any).__parallaxCleanup;
      };
    }
  }

  useFrame(() => {
    // Gentle parallax offset
    target.current.x = mouse.current.x * 1.2;
    target.current.y = 0.5 - mouse.current.y * 0.6;
    target.current.z = 8;

    camera.position.lerp(target.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export default ParallaxCamera;
