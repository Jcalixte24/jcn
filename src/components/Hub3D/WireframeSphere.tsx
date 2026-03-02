import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WireframeSphereProps {
  mobile?: boolean;
}

const WireframeSphere = ({ mobile = false }: WireframeSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x += delta * 0.025;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.04;
      glowRef.current.rotation.z += delta * 0.015;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.12) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Inner wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, mobile ? 1 : 2]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.006, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </mesh>

      {/* Core lights */}
      <pointLight color="#00d4ff" intensity={1.5} distance={10} decay={2} />
      <pointLight color="#8b5cf6" intensity={0.6} distance={8} decay={2} position={[0, 1, 0]} />
    </group>
  );
};

export default WireframeSphere;
