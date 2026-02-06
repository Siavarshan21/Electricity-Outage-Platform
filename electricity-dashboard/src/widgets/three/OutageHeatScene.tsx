import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

interface HeatPoint {
  position: [number, number, number];
  intensity: number;
}

export const OutageHeatScene: React.FC = () => {
  const groupRef = useRef<Group>(null);

  const points: HeatPoint[] = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
      ] as [number, number, number],
      intensity: Math.random(),
    }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  const getColor = (intensity: number): string => {
    if (intensity > 0.8) return "#ef4444";
    if (intensity > 0.5) return "#f59e0b";
    if (intensity > 0.3) return "#3b82f6";
    return "#22c55e";
  };

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <mesh key={i} position={point.position}>
          <sphereGeometry args={[0.08 + point.intensity * 0.12, 16, 16]} />
          <meshStandardMaterial
            color={getColor(point.intensity)}
            emissive={getColor(point.intensity)}
            emissiveIntensity={point.intensity * 0.8}
            transparent
            opacity={0.6 + point.intensity * 0.4}
          />
        </mesh>
      ))}
    </group>
  );
};
