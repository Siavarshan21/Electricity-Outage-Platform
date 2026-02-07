import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function createCatenaryPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  sag: number,
  segments: number,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = start.x + (end.x - start.x) * t;
    const z = start.z + (end.z - start.z) * t;
    const sagAmount = sag * Math.sin(t * Math.PI);
    const y = start.y + (end.y - start.y) * t - sagAmount;
    points.push([x, y, z]);
  }
  return points;
}

interface WireLine {
  points: [number, number, number][];
  vec3Points: THREE.Vector3[];
}

interface EnergyParticle {
  lineIndex: number;
  t: number;
  speed: number;
}

export const PowerLineScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<EnergyParticle[]>([]);

  const towers = useMemo(
    () => [
      { x: -3, z: 0 },
      { x: -1, z: 0 },
      { x: 1, z: 0 },
      { x: 3, z: 0 },
    ],
    [],
  );

  const wireLines: WireLine[] = useMemo(() => {
    const lines: WireLine[] = [];
    for (let i = 0; i < towers.length - 1; i++) {
      const offsets = [-0.3, 0, 0.3];
      for (const offsetZ of offsets) {
        const start = new THREE.Vector3(towers[i].x, 1.8, towers[i].z + offsetZ);
        const end = new THREE.Vector3(towers[i + 1].x, 1.8, towers[i + 1].z + offsetZ);
        const pts = createCatenaryPoints(start, end, 0.3, 20);
        lines.push({
          points: pts,
          vec3Points: pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        });
      }
    }
    return lines;
  }, [towers]);

  useMemo(() => {
    particlesRef.current = Array.from({ length: 30 }, (_, i) => ({
      lineIndex: i % wireLines.length,
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.25,
    }));
  }, [wireLines]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(elapsed * 0.1) * 0.15;
    }
    particlesRef.current.forEach((p) => {
      p.t += p.speed * 0.016;
      if (p.t > 1) p.t -= 1;
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 2]} color="#3b82f6" intensity={2} distance={10} />
      <pointLight position={[0, 0, -2]} color="#f59e0b" intensity={1} distance={6} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#1e293b" opacity={0.5} transparent />
      </mesh>

      {/* Towers */}
      {towers.map((tower, i) => (
        <group key={`tower-${i}`} position={[tower.x, 0, tower.z]}>
          {/* Main pole */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.06, 2.3, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Cross arm */}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Insulators */}
          {[-0.3, 0, 0.3].map((z, j) => (
            <mesh key={`ins-${j}`} position={[0, 1.7, z]}>
              <cylinderGeometry args={[0.03, 0.02, 0.12, 8]} />
              <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.3} />
            </mesh>
          ))}
          {/* Base */}
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.2, 0.15, 0.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
      ))}

      {/* Power lines */}
      {wireLines.map((wireLine, i) => (
        <Line
          key={`wire-${i}`}
          points={wireLine.points}
          color="#94a3b8"
          lineWidth={1}
          transparent
          opacity={0.7}
        />
      ))}

      {/* Energy particles flowing along wires */}
      {particlesRef.current.map((particle, i) => {
        const wireLine = wireLines[particle.lineIndex];
        if (!wireLine) return null;
        const idx = Math.floor(particle.t * (wireLine.vec3Points.length - 1));
        const pos = wireLine.vec3Points[Math.min(idx, wireLine.vec3Points.length - 1)];
        return (
          <mesh key={`energy-${i}`} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};
