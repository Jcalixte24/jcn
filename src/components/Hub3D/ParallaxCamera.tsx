import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParallaxCameraProps {
  mobile?: boolean;
}

const ParallaxCamera = ({ mobile = false }: ParallaxCameraProps) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, 0.5, 8));
  const gyro = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma !== null && e.beta !== null) {
      gyro.current.x = (e.gamma / 45) * 0.5; // -1 to 1 range, clamped
      gyro.current.y = ((e.beta - 45) / 45) * 0.5;
    }
  }, []);

  useEffect(() => {
    if (mobile) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [mobile, handleMouseMove, handleDeviceOrientation]);

  useFrame(() => {
    const inputX = mobile ? gyro.current.x : mouse.current.x;
    const inputY = mobile ? gyro.current.y : mouse.current.y;
    const intensity = mobile ? 0.6 : 1.2;

    target.current.x = inputX * intensity;
    target.current.y = 0.5 - inputY * (intensity * 0.5);
    target.current.z = 8;

    camera.position.lerp(target.current, 0.025);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export default ParallaxCamera;
