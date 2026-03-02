import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaFieldProps {
  mobile?: boolean;
}

/**
 * Creates volumetric nebula clouds using transparent sprite planes
 * with additive blending for a deep-space atmosphere.
 */
const NebulaField = ({ mobile = false }: NebulaFieldProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const cloudCount = mobile ? 4 : 8;

  const clouds = useMemo(() => {
    const palette = [
      new THREE.Color("hsl(260, 60%, 25%)"),
      new THREE.Color("hsl(195, 80%, 20%)"),
      new THREE.Color("hsl(320, 50%, 20%)"),
      new THREE.Color("hsl(220, 70%, 18%)"),
      new THREE.Color("hsl(40, 60%, 15%)"),
    ];

    return Array.from({ length: cloudCount }, (_, i) => {
      const angle = (i / cloudCount) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 8 + Math.random() * 10;
      return {
        position: [
          Math.cos(angle) * dist,
          (Math.random() - 0.5) * 6,
          Math.sin(angle) * dist,
        ] as [number, number, number],
        scale: 4 + Math.random() * 8,
        color: palette[i % palette.length],
        rotSpeed: (Math.random() - 0.5) * 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });
  }, [cloudCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const cloud = clouds[i];
      if (!cloud) return;
      child.rotation.z += cloud.rotSpeed;
      // Gentle pulsing opacity
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 0.3 + cloud.pulseOffset) * 0.015;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position} scale={cloud.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default NebulaField;
