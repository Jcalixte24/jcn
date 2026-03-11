import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface WireframeSphereProps {
  mobile?: boolean;
}

const WireframeSphere = ({ mobile = false }: WireframeSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x += delta * 0.025;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.04;
      glowRef.current.rotation.z += delta * 0.015;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.12) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Inner wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, mobile ? 1 : 2]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.006, 8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </mesh>

      {/* Core lights */}
      <pointLight color="#00d4ff" intensity={1.5} distance={10} decay={2} />
      <pointLight color="#8b5cf6" intensity={0.6} distance={8} decay={2} position={[0, 1, 0]} />

      {/* JCN UNIVERSE label */}
      <Html center position={[0, 2.15, 0]} style={{ pointerEvents: "none" }}>
        <div style={{ textAlign: "center", userSelect: "none" }}>
          <div
            style={{
              fontFamily: "'Orbitron', 'Space Mono', monospace",
              fontSize: mobile ? "11px" : "15px",
              fontWeight: "900",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #00d4ff 0%, #a78bfa 50%, #00d4ff 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 10px rgba(0,212,255,0.9)) drop-shadow(0 0 25px rgba(99,102,241,0.6))",
              whiteSpace: "nowrap",
              animation: "jcnPulse 3s ease-in-out infinite",
            }}
          >
            JCN UNIVERSE
          </div>
          <div
            style={{
              fontFamily: "'Exo 2', 'Space Grotesk', sans-serif",
              fontSize: mobile ? "6px" : "7px",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "rgba(0, 212, 255, 0.5)",
              marginTop: "4px",
              whiteSpace: "nowrap",
            }}
          >
            ✦ PORTFOLIO SPATIAL ✦
          </div>
        </div>
        <style>{`
          @keyframes jcnPulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; filter: drop-shadow(0 0 14px rgba(0,212,255,1)) drop-shadow(0 0 30px rgba(99,102,241,0.8)); }
          }
        `}</style>
      </Html>
    </group>
  );
};

export default WireframeSphere;
