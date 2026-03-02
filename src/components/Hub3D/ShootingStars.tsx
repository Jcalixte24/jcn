import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShootingStarsProps {
  mobile?: boolean;
}

/**
 * Animated shooting stars that streak across the 3D space periodically.
 */
const ShootingStars = ({ mobile = false }: ShootingStarsProps) => {
  const starCount = mobile ? 3 : 6;
  const linesRef = useRef<THREE.Group>(null);

  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, () => ({
        delay: Math.random() * 15,
        interval: 8 + Math.random() * 12,
        speed: 12 + Math.random() * 10,
        startPos: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          5 + Math.random() * 10,
          -10 - Math.random() * 10
        ),
        direction: new THREE.Vector3(
          -0.5 + Math.random() * -0.5,
          -0.3 - Math.random() * 0.3,
          0.2
        ).normalize(),
        length: 1.5 + Math.random() * 2,
      })),
    [starCount]
  );

  useFrame((state) => {
    if (!linesRef.current) return;
    const t = state.clock.elapsedTime;

    linesRef.current.children.forEach((child, i) => {
      const star = stars[i];
      const line = child as THREE.Line;
      const cycle = (t + star.delay) % star.interval;
      const active = cycle < 1.2;

      if (active) {
        const progress = cycle / 1.2;
        const head = star.startPos
          .clone()
          .add(star.direction.clone().multiplyScalar(progress * star.speed));
        const tail = head
          .clone()
          .sub(star.direction.clone().multiplyScalar(star.length));

        const positions = line.geometry.attributes.position as THREE.BufferAttribute;
        positions.setXYZ(0, tail.x, tail.y, tail.z);
        positions.setXYZ(1, head.x, head.y, head.z);
        positions.needsUpdate = true;

        (line.material as THREE.LineBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.8;
        line.visible = true;
      } else {
        line.visible = false;
      }
    });
  });

  return (
    <group ref={linesRef}>
      {stars.map((_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array(6)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#88ddff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
};

export default ShootingStars;
