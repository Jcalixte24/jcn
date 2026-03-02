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
  mobile?: boolean;
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
  mobile = false,
}: OrbitingPanelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseAngle = (index / total) * Math.PI * 2;
  const currentSpeed = useRef(speed);
  const scaleVec = useRef(new THREE.Vector3(1, 1, 1));

  const panelRadius = mobile ? radius * 0.8 : radius;

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetSpeed = hovered ? speed * 0.1 : speed;
    currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;

    const t = state.clock.elapsedTime * currentSpeed.current + baseAngle;
    groupRef.current.position.x = Math.cos(t) * panelRadius;
    groupRef.current.position.z = Math.sin(t) * panelRadius;
    groupRef.current.position.y = yOffset + Math.sin(t * 0.5) * 0.2;

    groupRef.current.lookAt(0, groupRef.current.position.y, 0);
    groupRef.current.rotateY(Math.PI);

    const targetScale = hovered ? 1.18 : 1;
    scaleVec.current.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(scaleVec.current, 0.08);
  });

  return (
    <group ref={groupRef}>
      <Html
        transform
        distanceFactor={mobile ? 7 : 6}
        style={{ pointerEvents: "auto" }}
      >
        <div
          className={`
            ${mobile ? "w-[140px] p-3" : "w-[200px] p-5"} rounded-2xl cursor-pointer select-none
            backdrop-blur-xl border transition-all duration-500
            ${hovered
              ? "border-[color:var(--glow)] scale-105"
              : "border-white/10"
            }
          `}
          style={{
            background: hovered
              ? `linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.4))`
              : `linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))`,
            boxShadow: hovered
              ? `0 0 30px ${color.replace(")", " / 0.3)").replace("hsl(", "hsl(")}, 0 0 80px ${color.replace(")", " / 0.1)").replace("hsl(", "hsl(")}, inset 0 1px 0 rgba(255,255,255,0.1)`
              : `0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
            "--glow": color,
          } as React.CSSProperties}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => onSelect(id)}
        >
          {/* Icon with glow */}
          <div className={`${mobile ? "text-2xl mb-2" : "text-3xl mb-3"} relative`}>
            {icon}
            {hovered && (
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: color, opacity: 0.15 }}
              />
            )}
          </div>

          <h3
            className={`font-orbitron ${mobile ? "text-[9px]" : "text-[11px]"} font-semibold tracking-widest uppercase mb-1.5 transition-colors duration-300`}
            style={{ color: hovered ? color : "rgba(255,255,255,0.85)" }}
          >
            {label}
          </h3>

          {/* Animated underline */}
          <div
            className="h-[1px] transition-all duration-500 rounded-full"
            style={{
              background: hovered
                ? `linear-gradient(90deg, transparent, ${color}, transparent)`
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              width: hovered ? "100%" : "40%",
            }}
          />

          <div
            className={`
              ${mobile ? "text-[8px]" : "text-[10px]"} font-exo uppercase tracking-wider mt-2 transition-all duration-300
              ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
            `}
            style={{ color }}
          >
            → Explore
          </div>
        </div>
      </Html>

      {/* Ambient glow behind panel on hover */}
      {hovered && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.5, 3]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};

export default OrbitingPanel;
