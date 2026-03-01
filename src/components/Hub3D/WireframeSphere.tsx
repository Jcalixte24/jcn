import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const WireframeSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.03;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.05;
      glowRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group>
      {/* Inner wireframe icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Core glow point light */}
      <pointLight color="#00d4ff" intensity={2} distance={12} decay={2} />
      <pointLight color="#8b5cf6" intensity={0.8} distance={8} decay={2} position={[0, 1, 0]} />
    </group>
  );
};

export default WireframeSphere;
