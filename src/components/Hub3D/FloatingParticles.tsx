import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingParticlesProps {
  count?: number;
  mobile?: boolean;
}

const FloatingParticles = ({ count = 200, mobile = false }: FloatingParticlesProps) => {
  const particleCount = mobile ? Math.floor(count * 0.35) : count;
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color("hsl(195, 100%, 70%)"),
      new THREE.Color("hsl(260, 60%, 70%)"),
      new THREE.Color("hsl(40, 95%, 70%)"),
      new THREE.Color("hsl(320, 70%, 70%)"),
      new THREE.Color("hsl(180, 80%, 80%)"),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a sphere volume for more natural feel
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 20;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      siz[i] = Math.random() * 0.06 + 0.015;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [particleCount]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.006;
    meshRef.current.rotation.x = Math.sin(t * 0.004) * 0.04;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={mobile ? 0.03 : 0.045}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </points>
  );
};

export default FloatingParticles;
