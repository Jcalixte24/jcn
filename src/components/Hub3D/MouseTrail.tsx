import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface MouseTrailProps {
  mobile?: boolean;
}

const TRAIL_LENGTH = 40;

const MouseTrail = ({ mobile = false }: MouseTrailProps) => {
  const { camera } = useThree();
  const lineRef = useRef<THREE.Line>(null);
  const mouse = useRef(new THREE.Vector2(9999, 9999));
  const raycaster = useRef(new THREE.Raycaster());
  const trailPoints = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(0, 0, -100))
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    const colors = new Float32Array(TRAIL_LENGTH * 4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    return geo;
  }, []);

  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geometry, mat);
  }, [geometry]);

  useEffect(() => {
    if (mobile) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mobile]);

  useFrame(() => {
    if (mobile) return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const targetPoint = new THREE.Vector3();
    raycaster.current.ray.at(8, targetPoint);

    const points = trailPoints.current;
    points[0].lerp(targetPoint, 0.35);
    for (let i = 1; i < TRAIL_LENGTH; i++) {
      points[i].lerp(points[i - 1], 0.15 + (i / TRAIL_LENGTH) * 0.05);
    }

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = geometry.attributes.color as THREE.BufferAttribute;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      posAttr.setXYZ(i, points[i].x, points[i].y, points[i].z);
      const alpha = Math.pow(1 - i / TRAIL_LENGTH, 2.5);
      const hue = 0.52 + (i / TRAIL_LENGTH) * 0.15;
      const c = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colAttr.setXYZW(i, c.r, c.g, c.b, alpha);
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  if (mobile) return null;

  return <primitive ref={lineRef} object={lineObj} />;
};

export default MouseTrail;
