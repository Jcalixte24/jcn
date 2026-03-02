import { useRef } from "react";
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

/**
 * A section panel fixed in space. Becomes visible and interactive
 * as the camera approaches via scroll.
 */
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

  useFrame((state) => {
    if (!groupRef.current) return;

    const dist = Math.abs(cameraZ - position[2]);
    const proximity = Math.max(0, 1 - dist / 12); // 0 = far, 1 = very close

    // Scale up as camera approaches
    const scale = 0.4 + proximity * 0.6;
    groupRef.current.scale.setScalar(scale);

    // Gentle float
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[2] * 0.1) * 0.15;
    groupRef.current.position.x = position[0] + Math.sin(t * 0.3 + position[2] * 0.05) * 0.08;

    // Glow intensity based on proximity
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = proximity * 0.06;
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
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Small orbiting marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isNear ? 0.8 : 0.3}
        />
      </mesh>
    </group>
  );
};

export default SectionWaypoint;
