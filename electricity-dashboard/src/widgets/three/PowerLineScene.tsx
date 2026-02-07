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
  span: number; // which span (0, 1, 2) between towers
  wireIdx: number; // which wire in the span (0, 1, 2)
}

/** Animated electricity pulse that travels along a wire */
function ElectricityPulse({
  wireLine,
  speed,
  offset,
  color,
  size,
}: {
  wireLine: WireLine;
  speed: number;
  offset: number;
  color: string;
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() * speed + offset) % 1.0);
    const pts = wireLine.vec3Points;
    const totalPts = pts.length - 1;

    // Main pulse position
    const idx = t * totalPts;
    const low = Math.floor(idx);
    const high = Math.min(low + 1, totalPts);
    const frac = idx - low;
    const pos = pts[low].clone().lerp(pts[high], frac);

    if (meshRef.current) {
      meshRef.current.position.copy(pos);
    }
    if (glowRef.current) {
      glowRef.current.position.copy(pos);
      glowRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 20) * 0.3);
    }

    // Trail particles
    trailRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const trailT = ((clock.getElapsedTime() * speed + offset - (i + 1) * 0.03) % 1.0 + 1.0) % 1.0;
      const trailIdx = trailT * totalPts;
      const tLow = Math.floor(trailIdx);
      const tHigh = Math.min(tLow + 1, totalPts);
      const tFrac = trailIdx - tLow;
      const trailPos = pts[tLow].clone().lerp(pts[tHigh], tFrac);
      ref.position.copy(trailPos);
      ref.scale.setScalar(1 - (i + 1) * 0.15);
    });
  });

  return (
    <group>
      {/* Main bright pulse */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      {/* Glow around pulse */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2.5, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      {/* Trail particles */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
        >
          <sphereGeometry args={[size * 0.6, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Glowing wire that flickers with electricity */
function GlowingWire({
  wireLine,
  baseColor,
  glowColor,
}: {
  wireLine: WireLine;
  baseColor: string;
  glowColor: string;
}) {
  return (
    <group>
      {/* Base wire */}
      <Line
        points={wireLine.points}
        color={baseColor}
        lineWidth={1.5}
        transparent
        opacity={0.8}
      />
      {/* Glow layer */}
      <Line
        points={wireLine.points}
        color={glowColor}
        lineWidth={3}
        transparent
        opacity={0.15}
      />
    </group>
  );
}

export const PowerLineScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef1 = useRef<THREE.PointLight>(null);
  const lightRef2 = useRef<THREE.PointLight>(null);

  const towers = useMemo(
    () => [
      { x: -4.5, z: 0 },
      { x: -1.5, z: 0 },
      { x: 1.5, z: 0 },
      { x: 4.5, z: 0 },
    ],
    [],
  );

  const wireLines: WireLine[] = useMemo(() => {
    const lines: WireLine[] = [];
    for (let i = 0; i < towers.length - 1; i++) {
      const offsets = [-0.35, 0, 0.35];
      offsets.forEach((offsetZ, j) => {
        const start = new THREE.Vector3(towers[i].x, 2.2, towers[i].z + offsetZ);
        const end = new THREE.Vector3(towers[i + 1].x, 2.2, towers[i + 1].z + offsetZ);
        const pts = createCatenaryPoints(start, end, 0.35, 30);
        lines.push({
          points: pts,
          vec3Points: pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
          span: i,
          wireIdx: j,
        });
      });
    }
    return lines;
  }, [towers]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(elapsed * 0.15) * 0.12;
    }
    // Flicker the lights to simulate electrical energy
    if (lightRef1.current) {
      lightRef1.current.intensity = 2 + Math.sin(elapsed * 8) * 0.5 + Math.sin(elapsed * 13) * 0.3;
    }
    if (lightRef2.current) {
      lightRef2.current.intensity = 1.5 + Math.sin(elapsed * 6 + 1) * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      <ambientLight intensity={0.25} />
      <pointLight
        ref={lightRef1}
        position={[0, 3, 2]}
        color="#3b82f6"
        intensity={2}
        distance={12}
      />
      <pointLight
        ref={lightRef2}
        position={[0, 1, -2]}
        color="#60a5fa"
        intensity={1.5}
        distance={8}
      />
      <pointLight position={[-3, 0, 3]} color="#f59e0b" intensity={0.5} distance={6} />

      {/* Ground plane with gradient feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#0f172a" opacity={0.6} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#1e3a5f" opacity={0.3} transparent />
      </mesh>

      {/* Towers */}
      {towers.map((tower, i) => (
        <group key={`tower-${i}`} position={[tower.x, 0, tower.z]}>
          {/* Main pole */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.08, 2.8, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* Diagonal supports */}
          <mesh position={[-0.15, 0.2, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.04, 1.2, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.04, 1.2, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Cross arm */}
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.9]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.15} />
          </mesh>
          {/* Insulators with glow */}
          {[-0.35, 0, 0.35].map((z, j) => (
            <group key={`ins-${j}`} position={[0, 2.05, z]}>
              <mesh>
                <cylinderGeometry args={[0.04, 0.03, 0.15, 8]} />
                <meshStandardMaterial
                  color="#93c5fd"
                  emissive="#3b82f6"
                  emissiveIntensity={0.6}
                  metalness={0.3}
                  roughness={0.4}
                />
              </mesh>
              {/* Insulator glow */}
              <mesh>
                <cylinderGeometry args={[0.07, 0.06, 0.08, 8]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
              </mesh>
            </group>
          ))}
          {/* Base platform */}
          <mesh position={[0, -0.55, 0]}>
            <boxGeometry args={[0.35, 0.12, 0.35]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Glowing power lines */}
      {wireLines.map((wireLine, i) => (
        <GlowingWire
          key={`wire-${i}`}
          wireLine={wireLine}
          baseColor="#94a3b8"
          glowColor="#60a5fa"
        />
      ))}

      {/* Electricity pulses flowing along each wire */}
      {wireLines.map((wireLine, i) => (
        <React.Fragment key={`pulses-${i}`}>
          {/* Primary fast pulse */}
          <ElectricityPulse
            wireLine={wireLine}
            speed={0.6 + wireLine.wireIdx * 0.08}
            offset={wireLine.span * 0.33 + wireLine.wireIdx * 0.11}
            color="#60a5fa"
            size={0.04}
          />
          {/* Secondary slower pulse */}
          <ElectricityPulse
            wireLine={wireLine}
            speed={0.4 + wireLine.wireIdx * 0.05}
            offset={wireLine.span * 0.33 + wireLine.wireIdx * 0.11 + 0.5}
            color="#93c5fd"
            size={0.03}
          />
        </React.Fragment>
      ))}

      {/* Ambient electrical sparks near insulators */}
      {towers.map((tower, ti) =>
        [-0.35, 0, 0.35].map((z, zi) => (
          <pointLight
            key={`spark-light-${ti}-${zi}`}
            position={[tower.x, 2.1, tower.z + z]}
            color="#60a5fa"
            intensity={0.3}
            distance={1}
          />
        )),
      )}
    </group>
  );
};
