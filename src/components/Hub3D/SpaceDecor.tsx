import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpaceDecorProps {
  mobile?: boolean;
}

/**
 * Additional space decorations: distant planets, ring systems, 
 * glowing nebula clouds, and light beams to break the black void.
 */
const SpaceDecor = ({ mobile = false }: SpaceDecorProps) => {
  const nebulaRef = useRef<THREE.Group>(null);
  const planetsRef = useRef<THREE.Group>(null);

  // Nebula cloud data
  const nebulae = useMemo(() => [
    { pos: [-18, 6, -25], size: 14, color: "hsl(270, 70%, 30%)", opacity: 0.06, rotation: 0.3 },
    { pos: [20, -4, -45], size: 18, color: "hsl(200, 80%, 25%)", opacity: 0.05, rotation: -0.2 },
    { pos: [-12, 8, -65], size: 22, color: "hsl(340, 60%, 25%)", opacity: 0.04, rotation: 0.15 },
    { pos: [15, -6, -85], size: 16, color: "hsl(160, 50%, 20%)", opacity: 0.05, rotation: -0.4 },
    { pos: [-20, 3, -100], size: 20, color: "hsl(220, 70%, 28%)", opacity: 0.045, rotation: 0.25 },
    { pos: [8, 10, -35], size: 12, color: "hsl(290, 50%, 35%)", opacity: 0.035, rotation: 0.1 },
    { pos: [-6, -8, -55], size: 15, color: "hsl(180, 60%, 22%)", opacity: 0.04, rotation: -0.15 },
  ], []);

  // Distant planets/moons
  const planets = useMemo(() => [
    { pos: [25, 8, -30] as [number, number, number], radius: 2.5, color: "hsl(30, 40%, 20%)", emissive: "hsl(30, 60%, 15%)", ring: true },
    { pos: [-22, -5, -60] as [number, number, number], radius: 1.8, color: "hsl(210, 30%, 18%)", emissive: "hsl(210, 50%, 12%)", ring: false },
    { pos: [18, 12, -90] as [number, number, number], radius: 3.2, color: "hsl(10, 35%, 22%)", emissive: "hsl(10, 50%, 14%)", ring: true },
    { pos: [-25, -8, -110] as [number, number, number], radius: 1.5, color: "hsl(260, 25%, 20%)", emissive: "hsl(260, 40%, 12%)", ring: false },
  ], []);

  // Light beams / god rays
  const beams = useMemo(() => [
    { pos: [-10, 15, -20], rotation: [0.3, 0, 0.8], length: 30, color: "hsl(45, 80%, 60%)", opacity: 0.015 },
    { pos: [12, -10, -50], rotation: [-0.2, 0, -0.5], length: 25, color: "hsl(200, 70%, 55%)", opacity: 0.012 },
    { pos: [-8, 12, -80], rotation: [0.1, 0, 0.6], length: 35, color: "hsl(280, 60%, 50%)", opacity: 0.01 },
  ], []);

  // Dust lane particles
  const dustCount = mobile ? 100 : 300;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = -Math.random() * 130;
    }
    return pos;
  }, [dustCount]);

  const dustColors = useMemo(() => {
    const col = new Float32Array(dustCount * 3);
    const palette = [
      [0.4, 0.3, 0.6],
      [0.3, 0.5, 0.7],
      [0.6, 0.3, 0.4],
      [0.5, 0.4, 0.3],
    ];
    for (let i = 0; i < dustCount; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return col;
  }, [dustCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Gentle nebula drift
    if (nebulaRef.current) {
      nebulaRef.current.children.forEach((mesh, i) => {
        mesh.rotation.z = nebulae[i].rotation + t * 0.003 * (i % 2 === 0 ? 1 : -1);
      });
    }

    // Planet rotation
    if (planetsRef.current) {
      planetsRef.current.children.forEach((group, i) => {
        const planet = group.children[0];
        if (planet) planet.rotation.y = t * 0.02 * (i + 1);
        // Ring rotation
        const ring = group.children[1];
        if (ring) ring.rotation.z = t * 0.005;
      });
    }
  });

  return (
    <group>
      {/* Nebula clouds */}
      <group ref={nebulaRef}>
        {nebulae.map((n, i) => (
          <mesh key={`neb-${i}`} position={n.pos as [number, number, number]} rotation={[0, 0, n.rotation]}>
            <planeGeometry args={[n.size, n.size * 0.7]} />
            <meshBasicMaterial
              color={n.color}
              transparent
              opacity={n.opacity}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Distant planets */}
      <group ref={planetsRef}>
        {planets.map((p, i) => (
          <group key={`planet-${i}`} position={p.pos}>
            <mesh>
              <sphereGeometry args={[p.radius, mobile ? 12 : 24, mobile ? 12 : 24]} />
              <meshStandardMaterial
                color={p.color}
                emissive={p.emissive}
                emissiveIntensity={0.3}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            {/* Atmosphere glow */}
            <mesh scale={1.15}>
              <sphereGeometry args={[p.radius, mobile ? 12 : 16, mobile ? 12 : 16]} />
              <meshBasicMaterial
                color={p.emissive}
                transparent
                opacity={0.06}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                depthWrite={false}
              />
            </mesh>
            {/* Ring system */}
            {p.ring && !mobile && (
              <mesh rotation={[Math.PI / 3, 0, 0.2]}>
                <ringGeometry args={[p.radius * 1.4, p.radius * 2.2, 48]} />
                <meshBasicMaterial
                  color={p.color}
                  transparent
                  opacity={0.08}
                  blending={THREE.AdditiveBlending}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Light beams / god rays */}
      {!mobile && beams.map((b, i) => (
        <mesh key={`beam-${i}`} position={b.pos as [number, number, number]} rotation={b.rotation as [number, number, number]}>
          <planeGeometry args={[1.5, b.length]} />
          <meshBasicMaterial
            color={b.color}
            transparent
            opacity={b.opacity}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Cosmic dust lane */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dustCount} array={dustPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={dustCount} array={dustColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={mobile ? 0.08 : 0.12}
          transparent
          opacity={0.25}
          vertexColors
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Distant galaxy disc */}
      {!mobile && (
        <group position={[30, 15, -70]} rotation={[0.8, 0.3, 0.5]}>
          <mesh>
            <circleGeometry args={[4, 32]} />
            <meshBasicMaterial
              color="hsl(40, 60%, 40%)"
              transparent
              opacity={0.025}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[2, 5, 48]} />
            <meshBasicMaterial
              color="hsl(220, 50%, 45%)"
              transparent
              opacity={0.015}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default SpaceDecor;
