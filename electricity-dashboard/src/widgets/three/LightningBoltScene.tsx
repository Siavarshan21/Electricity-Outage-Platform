import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function generateBoltPoints(start: THREE.Vector3, end: THREE.Vector3, segments: number): [number, number, number][] {
  const points: [number, number, number][] = [[start.x, start.y, start.z]];
  const dir = end.clone().sub(start);

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const basePoint = start.clone().add(dir.clone().multiplyScalar(t));
    points.push([
      basePoint.x + (Math.random() - 0.5) * 0.4,
      basePoint.y + (Math.random() - 0.5) * 0.4,
      basePoint.z + (Math.random() - 0.5) * 0.2,
    ]);
  }
  points.push([end.x, end.y, end.z]);
  return points;
}

interface BoltData {
  points: [number, number, number][];
  opacity: number;
}

export const LightningBoltScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const boltsRef = useRef<BoltData[]>([]);
  const timeRef = useRef(0);

  const boltEndpoints = useMemo(
    () => [
      { start: new THREE.Vector3(-2, 2, 0), end: new THREE.Vector3(0, -1.5, 0) },
      { start: new THREE.Vector3(2, 2, 0), end: new THREE.Vector3(0, -1.5, 0) },
      { start: new THREE.Vector3(0, 2.5, 0), end: new THREE.Vector3(-1, -1, 0) },
      { start: new THREE.Vector3(-1, 2, 0.5), end: new THREE.Vector3(1, -1.5, -0.5) },
      { start: new THREE.Vector3(1.5, 2, -0.5), end: new THREE.Vector3(-0.5, -1, 0.5) },
    ],
    [],
  );

  const regenerateBolts = useCallback(() => {
    boltsRef.current = boltEndpoints.map((ep) => ({
      points: generateBoltPoints(ep.start, ep.end, 12),
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, [boltEndpoints]);

  useMemo(() => regenerateBolts(), [regenerateBolts]);

  useFrame(({ clock }) => {
    timeRef.current = clock.getElapsedTime();
    if (Math.floor(timeRef.current * 8) !== Math.floor((timeRef.current - 0.016) * 8)) {
      regenerateBolts();
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.15;
    }
  });

  const coreGlow = useMemo(
    () => (
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
      </mesh>
    ),
    [],
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 0.5 + Math.random() * 0.5;
        return (
          <mesh
            key={`spark-${i}`}
            position={[
              Math.cos(angle) * radius,
              -1.5 + Math.random() * 0.5,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.6} />
          </mesh>
        );
      }),
    [],
  );

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, -1.5, 0]} color="#3b82f6" intensity={3} distance={8} />
      <pointLight position={[0, 2, 0]} color="#60a5fa" intensity={1.5} distance={6} />

      {/* Lightning bolts */}
      {boltsRef.current.map((bolt, i) => (
        <Line
          key={`bolt-${i}`}
          points={bolt.points}
          color="#93c5fd"
          lineWidth={2}
          transparent
          opacity={bolt.opacity}
        />
      ))}

      {/* Secondary thin bolts */}
      {boltsRef.current.map((bolt, i) => (
        <Line
          key={`bolt-thin-${i}`}
          points={bolt.points}
          color="#dbeafe"
          lineWidth={1}
          transparent
          opacity={bolt.opacity * 0.5}
        />
      ))}

      {coreGlow}
      {sparks}

      {/* Tower/pole structures */}
      <mesh position={[-2, 1, 0]}>
        <boxGeometry args={[0.08, 2.5, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2, 1, 0]}>
        <boxGeometry args={[0.08, 2.5, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.06, 3, 0.06]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cross bars */}
      <mesh position={[-2, 2.2, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[2, 2.2, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};
