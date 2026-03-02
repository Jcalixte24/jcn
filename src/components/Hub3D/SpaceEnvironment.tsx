import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpaceEnvironmentProps {
  mobile?: boolean;
  scrollSpeed: number;
  cameraZ: number;
}

/**
 * Rich space environment: dense star field, comets, asteroids, nebula clouds.
 * Objects are generated around the camera and recycled as camera moves.
 */
const SpaceEnvironment = ({ mobile = false, scrollSpeed, cameraZ }: SpaceEnvironmentProps) => {
  const starsRef = useRef<THREE.Points>(null);
  const cometsRef = useRef<THREE.Group>(null);
  const asteroidsRef = useRef<THREE.Group>(null);
  const speedLinesRef = useRef<THREE.Points>(null);

  const starCount = mobile ? 600 : 1500;
  const cometCount = mobile ? 3 : 6;
  const asteroidCount = mobile ? 8 : 18;
  const speedLineCount = mobile ? 40 : 100;

  // Star field
  const { starPositions, starColors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const palette = [
      [0.7, 0.85, 1],    // blue-white
      [1, 0.95, 0.8],    // warm white
      [0.8, 0.7, 1],     // purple tint
      [0.6, 0.9, 1],     // cyan
      [1, 0.8, 0.6],     // gold
    ];
    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = Math.random() * -150;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { starPositions: pos, starColors: col };
  }, [starCount]);

  // Speed lines (appear when scrolling fast)
  const speedLinePositions = useMemo(() => {
    const pos = new Float32Array(speedLineCount * 3);
    for (let i = 0; i < speedLineCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = Math.random() * -10;
    }
    return pos;
  }, [speedLineCount]);

  // Comet data
  const comets = useMemo(() =>
    Array.from({ length: cometCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        -Math.random() * 120
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.01,
        0.02 + Math.random() * 0.03
      ),
      tailLength: 1.5 + Math.random() * 2,
      color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.7),
    })),
    [cometCount]
  );

  // Asteroid data
  const asteroids = useMemo(() =>
    Array.from({ length: asteroidCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 25,
        -Math.random() * 140
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      scale: 0.05 + Math.random() * 0.15,
    })),
    [asteroidCount]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Twinkle stars
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.002;
    }

    // Speed lines - opacity based on scroll speed
    if (speedLinesRef.current) {
      const mat = speedLinesRef.current.material as THREE.PointsMaterial;
      mat.opacity = Math.min(Math.abs(scrollSpeed) * 3, 0.8);

      // Stretch lines in Z based on speed
      const positions = speedLinesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < speedLineCount; i++) {
        let z = positions.getZ(i) + scrollSpeed * 0.5;
        // Recycle
        if (z > 5) z = -10;
        if (z < -15) z = 5;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      speedLinesRef.current.position.z = cameraZ;
    }

    // Animate comets
    if (cometsRef.current) {
      cometsRef.current.children.forEach((group, i) => {
        const comet = comets[i];
        const mesh = group.children[0] as THREE.Mesh;
        const tail = group.children[1] as THREE.Mesh;
        if (!mesh || !comet) return;

        comet.pos.add(comet.velocity);
        // Recycle comets
        if (comet.pos.z > 10) {
          comet.pos.z = -130;
          comet.pos.x = (Math.random() - 0.5) * 40;
          comet.pos.y = (Math.random() - 0.5) * 20;
        }
        mesh.position.copy(comet.pos);
        if (tail) {
          tail.position.copy(comet.pos);
          tail.position.z -= comet.tailLength * 0.5;
          tail.scale.z = comet.tailLength;
        }
      });
    }

    // Animate asteroids
    if (asteroidsRef.current) {
      asteroidsRef.current.children.forEach((mesh, i) => {
        const ast = asteroids[i];
        if (!ast) return;
        mesh.rotation.x += ast.rotSpeed.x * 0.01;
        mesh.rotation.y += ast.rotSpeed.y * 0.01;
        // Gentle drift
        ast.pos.z += 0.005;
        if (ast.pos.z > 10) {
          ast.pos.z = -130;
          ast.pos.x = (Math.random() - 0.5) * 50;
        }
        mesh.position.copy(ast.pos);
      });
    }
  });

  return (
    <group>
      {/* Dense star field */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starCount} array={starPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={starCount} array={starColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={mobile ? 0.06 : 0.08}
          transparent
          opacity={0.9}
          vertexColors
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Speed lines */}
      <points ref={speedLinesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={speedLineCount} array={speedLinePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color="#88ccff"
          size={mobile ? 0.02 : 0.035}
          transparent
          opacity={0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Comets */}
      <group ref={cometsRef}>
        {comets.map((comet, i) => (
          <group key={`comet-${i}`}>
            {/* Head */}
            <mesh position={comet.pos.toArray()}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={comet.color} transparent opacity={0.9} />
            </mesh>
            {/* Tail */}
            <mesh position={[comet.pos.x, comet.pos.y, comet.pos.z - comet.tailLength * 0.5]}>
              <cylinderGeometry args={[0.04, 0, comet.tailLength, 4]} />
              <meshBasicMaterial
                color={comet.color}
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Asteroids */}
      <group ref={asteroidsRef}>
        {asteroids.map((ast, i) => (
          <mesh key={`ast-${i}`} position={ast.pos.toArray()} scale={ast.scale}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="hsl(30, 15%, 25%)"
              roughness={0.9}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Nebula ambient glow planes */}
      {!mobile && (
        <>
          <mesh position={[-15, 3, -50]} rotation={[0, 0.3, 0]}>
            <planeGeometry args={[20, 15]} />
            <meshBasicMaterial color="hsl(260, 60%, 25%)" transparent opacity={0.03} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[12, -2, -80]} rotation={[0, -0.5, 0.2]}>
            <planeGeometry args={[18, 12]} />
            <meshBasicMaterial color="hsl(195, 80%, 20%)" transparent opacity={0.025} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[-8, 5, -110]} rotation={[0.1, 0.2, 0]}>
            <planeGeometry args={[25, 18]} />
            <meshBasicMaterial color="hsl(320, 50%, 18%)" transparent opacity={0.02} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default SpaceEnvironment;
