import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface OrbitingPanelProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  index: number;
  total: number;
  radius: number;
  yOffset: number;
  speed: number;
  onSelect: (id: string) => void;
}

const OrbitingPanel = ({
  id,
  label,
  icon,
  color,
  index,
  total,
  radius,
  yOffset,
  speed,
  onSelect,
}: OrbitingPanelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseAngle = (index / total) * Math.PI * 2;
  const currentSpeed = useRef(speed);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth speed transition on hover
    const targetSpeed = hovered ? speed * 0.15 : speed;
    currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;

    const t = state.clock.elapsedTime * currentSpeed.current + baseAngle;
    groupRef.current.position.x = Math.cos(t) * radius;
    groupRef.current.position.z = Math.sin(t) * radius;
    groupRef.current.position.y = yOffset + Math.sin(t * 0.5) * 0.15;

    // Face outward from center
    groupRef.current.lookAt(0, groupRef.current.position.y, 0);
    groupRef.current.rotateY(Math.PI);

    // Hover scale
    const targetScale = hovered ? 1.15 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      <Html
        transform
        distanceFactor={6}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className={`
            w-[180px] md:w-[200px] p-5 rounded-2xl cursor-pointer select-none
            backdrop-blur-xl border transition-all duration-500
            ${hovered
              ? "border-[color:var(--glow)] shadow-[0_0_30px_var(--glow),0_0_60px_var(--glow-dim)] scale-105"
              : "border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            }
          `}
          style={{
            background: hovered
              ? `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))`
              : `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
            "--glow": color,
            "--glow-dim": color.replace(")", " / 0.2)").replace("hsl(", "hsl("),
          } as React.CSSProperties}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => onSelect(id)}
        >
          <div className="text-3xl mb-3">{icon}</div>
          <h3
            className="font-orbitron text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-300"
            style={{ color: hovered ? color : "rgba(255,255,255,0.85)" }}
          >
            {label}
          </h3>
          <div
            className={`
              text-[10px] font-exo uppercase tracking-wider transition-all duration-300
              ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
            `}
            style={{ color }}
          >
            → View
          </div>
        </div>
      </Html>

      {/* Subtle glow plane behind panel */}
      {hovered && (
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[2.2, 2.8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default OrbitingPanel;
