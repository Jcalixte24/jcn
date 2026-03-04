import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface SectionWaypointProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  position: [number, number, number];
  cameraZ: number;
  onSelect: (id: string) => void;
  mobile?: boolean;
}

const PARTICLE_COUNT = 24;

const SectionWaypoint = ({
  id,
  label,
  icon,
  color,
  position,
  cameraZ,
  onSelect,
  mobile = false,
}: SectionWaypointProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRing1Ref = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Particle positions scattered in a sphere around the waypoint
  const particleData = useMemo(() => {
    const count = mobile ? 12 : PARTICLE_COUNT;
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.8 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      speeds[i] = 0.3 + Math.random() * 0.7;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, speeds, offsets, count };
  }, [mobile]);

  const parsedColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const dist = Math.abs(cameraZ - position[2]);
    const proximity = Math.max(0, 1 - dist / 12);

    // Scale up as camera approaches
    const scale = 0.4 + proximity * 0.6;
    groupRef.current.scale.setScalar(scale);

    // Gentle float
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[2] * 0.1) * 0.15;
    groupRef.current.position.x = position[0] + Math.sin(t * 0.3 + position[2] * 0.05) * 0.08;

    // Glow disc
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = proximity * 0.08;
    }

    // Pulse rings
    const pulseScale1 = 0.5 + (Math.sin(t * 2) * 0.5 + 0.5) * 1.5;
    const pulseScale2 = 0.5 + (Math.sin(t * 2 + Math.PI) * 0.5 + 0.5) * 1.5;
    const pulseOpacity = proximity * 0.15;

    if (pulseRing1Ref.current) {
      pulseRing1Ref.current.scale.setScalar(pulseScale1);
      (pulseRing1Ref.current.material as THREE.MeshBasicMaterial).opacity =
        pulseOpacity * (1 - (pulseScale1 - 0.5) / 1.5);
    }
    if (pulseRing2Ref.current) {
      pulseRing2Ref.current.scale.setScalar(pulseScale2);
      (pulseRing2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        pulseOpacity * (1 - (pulseScale2 - 0.5) / 1.5);
    }

    // Animate particles
    if (particlesRef.current) {
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = proximity * 0.7;

      const positions = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleData.count; i++) {
        const baseX = particleData.positions[i * 3];
        const baseY = particleData.positions[i * 3 + 1];
        const baseZ = particleData.positions[i * 3 + 2];
        const sp = particleData.speeds[i];
        const off = particleData.offsets[i];
        // Orbit & pulse outward on proximity
        const expand = 1 + proximity * 0.6;
        const angle = t * sp + off;
        positions.setXYZ(
          i,
          baseX * expand * Math.cos(angle * 0.3) - baseZ * expand * Math.sin(angle * 0.3) * 0.2,
          baseY * expand + Math.sin(angle) * 0.15,
          baseZ * expand * Math.cos(angle * 0.3) + baseX * expand * Math.sin(angle * 0.3) * 0.2
        );
      }
      positions.needsUpdate = true;
    }
  });

  const dist = Math.abs(cameraZ - position[2]);
  const isNear = dist < 10;
  const isVeryNear = dist < 5;

  return (
    <group ref={groupRef} position={position}>
      <Html
        transform
        distanceFactor={mobile ? 8 : 6.5}
        style={{ pointerEvents: isNear ? "auto" : "none" }}
        occlude={false}
      >
        <div
          className={`
            ${mobile ? "w-[110px] p-2.5" : "w-[150px] p-4"} rounded-xl cursor-pointer select-none
            backdrop-blur-xl border transition-all duration-700
            ${isVeryNear
              ? "border-[color:var(--glow)] opacity-100"
              : isNear
                ? "border-white/10 opacity-70"
                : "border-white/5 opacity-0"
            }
          `}
          style={{
            background: isVeryNear
              ? `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.35))`
              : `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
            boxShadow: isVeryNear
              ? `0 0 25px ${color.replace(")", " / 0.25)").replace("hsl(", "hsl(")}, 0 0 60px ${color.replace(")", " / 0.08)").replace("hsl(", "hsl(")}, inset 0 1px 0 rgba(255,255,255,0.08)`
              : `0 2px 20px rgba(0,0,0,0.3)`,
            "--glow": color,
            transform: `scale(${isVeryNear ? 1 : 0.9})`,
            transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          } as React.CSSProperties}
          onClick={() => isNear && onSelect(id)}
        >
          <div className={`${mobile ? "text-lg mb-1" : "text-2xl mb-2"}`}>{icon}</div>
          <h3
            className={`font-orbitron ${mobile ? "text-[8px]" : "text-[10px]"} font-semibold tracking-widest uppercase mb-1 transition-colors duration-500`}
            style={{ color: isVeryNear ? color : "rgba(255,255,255,0.7)" }}
          >
            {label}
          </h3>
          <div
            className="h-[1px] rounded-full transition-all duration-700"
            style={{
              background: isVeryNear
                ? `linear-gradient(90deg, transparent, ${color}, transparent)`
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              width: isVeryNear ? "100%" : "30%",
            }}
          />
          <div
            className={`${mobile ? "text-[7px]" : "text-[9px]"} font-exo uppercase tracking-wider mt-1.5 transition-all duration-500`}
            style={{
              color,
              opacity: isVeryNear ? 1 : 0,
              transform: `translateY(${isVeryNear ? 0 : 4}px)`,
            }}
          >
            → Explore
          </div>
        </div>
      </Html>

      {/* Glow disc behind */}
      <mesh ref={glowRef} position={[0, 0, -0.2]}>
        <circleGeometry args={[1.8, 16]} />
        <meshBasicMaterial
          color={parsedColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulse ring 1 */}
      <mesh ref={pulseRing1Ref} position={[0, 0, -0.15]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.9, 1.0, 32]} />
        <meshBasicMaterial
          color={parsedColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulse ring 2 (offset phase) */}
      <mesh ref={pulseRing2Ref} position={[0, 0, -0.1]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.7, 0.78, 32]} />
        <meshBasicMaterial
          color={parsedColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Proximity particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.count}
            array={particleData.positions.slice()}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={parsedColor}
          size={mobile ? 0.04 : 0.06}
          transparent
          opacity={0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Center marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color={parsedColor}
          transparent
          opacity={isNear ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  );
};

export default SectionWaypoint;
