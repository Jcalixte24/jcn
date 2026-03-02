import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WireframeSphereProps {
  mobile?: boolean;
}

const WireframeSphere = ({ mobile = false }: WireframeSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.03;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.05;
      glowRef.current.rotation.z += delta * 0.02;
    }
    if (outerRef.current && !mobile) {
      outerRef.current.rotation.y += delta * 0.015;
      outerRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.04;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.15) * 0.1;
    }
  });

  return (
    <group>
      {/* Inner wireframe icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, mobile ? 1 : 2]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Middle glow sphere */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Outer shell (desktop only) */}
      {!mobile && (
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.8, 1]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.04} />
        </mesh>
      )}

      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.008, 8, 80]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} />
      </mesh>

      {/* Core lights */}
      <pointLight color="#00d4ff" intensity={2.5} distance={14} decay={2} />
      <pointLight color="#8b5cf6" intensity={1} distance={10} decay={2} position={[0, 1.5, 0]} />
      <pointLight color="#a855f7" intensity={0.5} distance={8} decay={2} position={[0, -1, 2]} />
    </group>
  );
};

export default WireframeSphere;
