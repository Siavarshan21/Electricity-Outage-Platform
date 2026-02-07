import React, { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function generateBoltPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number,
  jitter: number,
): [number, number, number][] {
  const points: [number, number, number][] = [[start.x, start.y, start.z]];
  const dir = end.clone().sub(start);

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const basePoint = start.clone().add(dir.clone().multiplyScalar(t));
    // More jitter in the middle, less at endpoints
    const jitterScale = Math.sin(t * Math.PI) * jitter;
    points.push([
      basePoint.x + (Math.random() - 0.5) * jitterScale,
      basePoint.y + (Math.random() - 0.5) * jitterScale * 0.3,
      basePoint.z + (Math.random() - 0.5) * jitterScale * 0.5,
    ]);
  }
  points.push([end.x, end.y, end.z]);
  return points;
}

function generateBranchPoints(
  parentPoints: [number, number, number][],
  branchStart: number,
  length: number,
  segments: number,
): [number, number, number][] {
  const startIdx = Math.floor(branchStart * (parentPoints.length - 1));
  const origin = parentPoints[startIdx];
  const angle = (Math.random() - 0.5) * Math.PI * 0.6;
  const endX = origin[0] + Math.sin(angle) * length;
  const endY = origin[1] - length * 0.7;
  const endZ = origin[2] + (Math.random() - 0.5) * length * 0.3;

  return generateBoltPoints(
    new THREE.Vector3(origin[0], origin[1], origin[2]),
    new THREE.Vector3(endX, endY, endZ),
    segments,
    0.3,
  );
}

interface BoltData {
  mainPoints: [number, number, number][];
  branches: [number, number, number][][];
  opacity: number;
  width: number;
}

/** Animated sphere that pulses with energy */
function EnergyOrb({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2 + 0.5) * 0.2);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 4) * 0.06;
    }
  });

  return (
    <group position={position}>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/** Ring that pulses outward */
function PulseRing({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.5) % 1;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.5 + t * 2);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - t);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.35, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

export const LightningBoltScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const boltsRef = useRef<BoltData[]>([]);
  const timeRef = useRef(0);
  const lightRef = useRef<THREE.PointLight>(null);

  const boltConfigs = useMemo(
    () => [
      // Main central bolt - dramatic top to bottom
      { start: new THREE.Vector3(0, 2.8, 0), end: new THREE.Vector3(0, -0.5, 0), jitter: 0.5, width: 3, branches: 3 },
      // Side bolts
      { start: new THREE.Vector3(-1.2, 2.5, 0.2), end: new THREE.Vector3(-0.3, -0.3, 0), jitter: 0.4, width: 2, branches: 2 },
      { start: new THREE.Vector3(1.2, 2.5, -0.2), end: new THREE.Vector3(0.3, -0.3, 0), jitter: 0.4, width: 2, branches: 2 },
      // Arcing bolts between towers
      { start: new THREE.Vector3(-1.8, 2.2, 0), end: new THREE.Vector3(-0.5, 1.5, 0), jitter: 0.25, width: 1.5, branches: 1 },
      { start: new THREE.Vector3(1.8, 2.2, 0), end: new THREE.Vector3(0.5, 1.5, 0), jitter: 0.25, width: 1.5, branches: 1 },
    ],
    [],
  );

  const regenerateBolts = useCallback(() => {
    boltsRef.current = boltConfigs.map((cfg) => {
      const mainPoints = generateBoltPoints(cfg.start, cfg.end, 16, cfg.jitter);
      const branches: [number, number, number][][] = [];
      for (let b = 0; b < cfg.branches; b++) {
        const branchStart = 0.2 + Math.random() * 0.5;
        branches.push(generateBranchPoints(mainPoints, branchStart, 0.5 + Math.random() * 0.6, 6));
      }
      return {
        mainPoints,
        branches,
        opacity: 0.5 + Math.random() * 0.5,
        width: cfg.width,
      };
    });
  }, [boltConfigs]);

  useMemo(() => regenerateBolts(), [regenerateBolts]);

  useFrame(({ clock }) => {
    timeRef.current = clock.getElapsedTime();
    // Regenerate bolts ~10 times per second for crackling effect
    if (
      Math.floor(timeRef.current * 10) !==
      Math.floor((timeRef.current - 0.016) * 10)
    ) {
      regenerateBolts();
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.2) * 0.1;
    }
    // Flickering light
    if (lightRef.current) {
      lightRef.current.intensity =
        4 + Math.sin(timeRef.current * 15) * 2 + Math.random() * 1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 1]}
        color="#60a5fa"
        intensity={4}
        distance={10}
      />
      <pointLight position={[0, 3, 0]} color="#93c5fd" intensity={1.5} distance={8} />
      <pointLight position={[0, -1, 2]} color="#3b82f6" intensity={1} distance={5} />

      {/* Lightning bolts - main + glow layers */}
      {boltsRef.current.map((bolt, i) => (
        <group key={`bolt-group-${i}`}>
          {/* Bright core */}
          <Line
            points={bolt.mainPoints}
            color="#ffffff"
            lineWidth={bolt.width}
            transparent
            opacity={bolt.opacity}
          />
          {/* Blue glow */}
          <Line
            points={bolt.mainPoints}
            color="#60a5fa"
            lineWidth={bolt.width + 2}
            transparent
            opacity={bolt.opacity * 0.4}
          />
          {/* Outer glow */}
          <Line
            points={bolt.mainPoints}
            color="#3b82f6"
            lineWidth={bolt.width + 5}
            transparent
            opacity={bolt.opacity * 0.15}
          />
          {/* Branches */}
          {bolt.branches.map((branch, j) => (
            <group key={`branch-${i}-${j}`}>
              <Line
                points={branch}
                color="#dbeafe"
                lineWidth={1}
                transparent
                opacity={bolt.opacity * 0.7}
              />
              <Line
                points={branch}
                color="#60a5fa"
                lineWidth={3}
                transparent
                opacity={bolt.opacity * 0.2}
              />
            </group>
          ))}
        </group>
      ))}

      {/* Central energy orb where bolts converge */}
      <EnergyOrb position={[0, -0.5, 0]} color="#3b82f6" size={0.25} />

      {/* Pulse rings emanating from center */}
      <PulseRing position={[0, -0.5, 0]} color="#60a5fa" />

      {/* Tower structures - cleaner, more centered */}
      {/* Left tower */}
      <group position={[-1.8, 0, 0]}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.1, 2.8, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[0.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Insulator */}
        <mesh position={[0, 2.45, 0]}>
          <cylinderGeometry args={[0.04, 0.03, 0.12, 8]} />
          <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Center tower (taller) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[0.1, 3.4, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.05, 0]}>
          <cylinderGeometry args={[0.04, 0.03, 0.12, 8]} />
          <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Right tower */}
      <group position={[1.8, 0, 0]}>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.1, 2.8, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[0.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.45, 0]}>
          <cylinderGeometry args={[0.04, 0.03, 0.12, 8]} />
          <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.1, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#0f172a" opacity={0.4} transparent />
      </mesh>

      {/* Floating spark particles around the scene */}
      {Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 0.4 + (i % 5) * 0.25;
        const yOffset = ((i * 7) % 30) / 10 - 0.5;
        return (
          <mesh
            key={`spark-${i}`}
            position={[
              Math.cos(angle) * radius,
              yOffset,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.015 + (i % 3) * 0.008, 6, 6]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#93c5fd" : "#60a5fa"}
              transparent
              opacity={0.5 + (i % 4) * 0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};
