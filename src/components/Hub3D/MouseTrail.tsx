import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";

interface MouseTrailProps {
  mobile?: boolean;
}

const TRAIL_LENGTH = 40;

/**
 * Luminous trail that follows the mouse cursor in 3D space.
 * Uses a line of points that fade out with distance from cursor.
 */
const MouseTrail = ({ mobile = false }: MouseTrailProps) => {
  const { camera, size } = useThree();
  const lineRef = useRef<THREE.Line>(null);
  const mouse = useRef(new THREE.Vector2(9999, 9999));
  const raycaster = useRef(new THREE.Raycaster());
  const trailPoints = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(0, 0, -100))
  );
  const initialized = useRef(false);

  const { geometry, colorArray } = useMemo(() => {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    const colors = new Float32Array(TRAIL_LENGTH * 4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    return { geometry: geo, colorArray: colors };
  }, []);

  // Track mouse
  if (typeof window !== "undefined" && !initialized.current) {
    initialized.current = true;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
  }

  useFrame(() => {
    if (!lineRef.current || mobile) return;

    // Project mouse into 3D at a fixed depth in front of camera
    raycaster.current.setFromCamera(mouse.current, camera);
    const targetPoint = new THREE.Vector3();
    raycaster.current.ray.at(8, targetPoint); // 8 units in front

    // Shift trail: each point lerps toward the one ahead
    const points = trailPoints.current;
    points[0].lerp(targetPoint, 0.35);
    for (let i = 1; i < TRAIL_LENGTH; i++) {
      points[i].lerp(points[i - 1], 0.15 + (i / TRAIL_LENGTH) * 0.05);
    }

    // Update geometry
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = geometry.attributes.color as THREE.BufferAttribute;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      posAttr.setXYZ(i, points[i].x, points[i].y, points[i].z);
      const alpha = Math.pow(1 - i / TRAIL_LENGTH, 2.5);
      // Cyan-to-purple gradient
      const hue = 0.52 + (i / TRAIL_LENGTH) * 0.15;
      const c = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colAttr.setXYZW(i, c.r, c.g, c.b, alpha);
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  if (mobile) return null;

  return (
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        linewidth={1}
      />
    </line>
  );
};

export default MouseTrail;
