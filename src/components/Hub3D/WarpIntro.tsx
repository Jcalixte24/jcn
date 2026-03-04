import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WarpIntroProps {
  active: boolean;
  onComplete: () => void;
  mobile?: boolean;
}

/**
 * Warp speed intro effect — star streaks rushing past camera,
 * decelerating over ~3 seconds then calling onComplete.
 */
const WarpIntro = ({ active, onComplete, mobile = false }: WarpIntroProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  const lineCount = mobile ? 200 : 500;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(lineCount * 3);
    const vel = new Float32Array(lineCount);
    for (let i = 0; i < lineCount; i++) {
      // Spread around camera in a cylinder
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -Math.random() * 80 - 10; // deep behind
      vel[i] = 1.5 + Math.random() * 2.5;
    }
    return { positions: pos, velocities: vel };
  }, [lineCount]);

  useFrame((_, delta) => {
    if (!active || completedRef.current || !pointsRef.current) return;

    progressRef.current += delta;
    const t = progressRef.current;
    const duration = 3;

    if (t >= duration) {
      completedRef.current = true;
      onComplete();
      return;
    }

    // Easing: fast at start, slowing down
    const speedMult = Math.max(0, 1 - (t / duration) ** 1.5);
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < lineCount; i++) {
      let z = attr.getZ(i);
      z += velocities[i] * speedMult * 60 * delta;
      if (z > 10) z = -80; // recycle
      attr.setZ(i, z);
    }
    attr.needsUpdate = true;

    // Size grows then shrinks
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = speedMult * 0.9 + 0.1;
    mat.size = 0.02 + speedMult * 0.12;
  });

  if (!active && completedRef.current) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#88ccff"
        size={0.1}
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default WarpIntro;
