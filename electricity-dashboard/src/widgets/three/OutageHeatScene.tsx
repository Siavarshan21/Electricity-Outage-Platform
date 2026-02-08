import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh, Group } from "three";

/* ------------------------------------------------------------------ */
/*  Glowing Insulator (ceramic stack on top of transformer)           */
/* ------------------------------------------------------------------ */

function Insulator({ position }: { position: [number, number, number] }) {
  const tipRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (tipRef.current) {
      const mat = tipRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.4 + Math.sin(clock.getElapsedTime() * 3 + position[0] * 5) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base disk */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.14, 0.06, 16]} />
        <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Ceramic rings */}
      {[0.08, 0.18, 0.28].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
          <meshStandardMaterial
            color="#93c5fd"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {/* Glowing tip */}
      <mesh ref={tipRef} position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Electricity Arc between two points                                */
/* ------------------------------------------------------------------ */

function ElectricArc({
  start,
  end,
  seed,
}: {
  start: [number, number, number];
  end: [number, number, number];
  seed: number;
}) {
  const pointsRef = useRef<[number, number, number][]>([]);
  const timeRef = useRef(0);
  const segments = 14;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (t - timeRef.current > 0.08) {
      timeRef.current = t;
      const newPts: [number, number, number][] = [];
      for (let i = 0; i <= segments; i++) {
        const frac = i / segments;
        const x = start[0] + (end[0] - start[0]) * frac;
        const y = start[1] + (end[1] - start[1]) * frac;
        const z = start[2] + (end[2] - start[2]) * frac;
        const disp = Math.sin(frac * Math.PI) * 0.15;
        newPts.push([
          x + (Math.random() - 0.5) * disp,
          y + (Math.random() - 0.5) * disp,
          z + (Math.random() - 0.5) * disp * 0.5,
        ]);
      }
      pointsRef.current = newPts;
    }
  });

  const initialPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const frac = i / segments;
      pts.push([
        start[0] + (end[0] - start[0]) * frac,
        start[1] + (end[1] - start[1]) * frac + Math.sin(frac * Math.PI) * 0.05 * (seed % 3),
        start[2] + (end[2] - start[2]) * frac,
      ]);
    }
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pts = pointsRef.current.length > 0 ? pointsRef.current : initialPoints;

  return (
    <group>
      <Line points={pts} color="#ffffff" lineWidth={1.5} transparent opacity={0.9} />
      <Line points={pts} color="#60a5fa" lineWidth={4} transparent opacity={0.35} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Energy Ring - pulsing torus around transformer                    */
/* ------------------------------------------------------------------ */

function EnergyRing({
  radius,
  speed,
  yOffset,
}: {
  radius: number;
  speed: number;
  yOffset: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      const s = 1 + Math.sin(t) * 0.15;
      ref.current.scale.set(s, s, s);
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.2 + Math.sin(t) * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={[0, yOffset, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 8, 48]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#2563eb"
        emissiveIntensity={1}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbiting Spark Particles                                          */
/* ------------------------------------------------------------------ */

function Sparks() {
  const groupRef = useRef<Group>(null);

  const sparks = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        angle: (i / 20) * Math.PI * 2,
        radius: 0.8 + Math.random() * 0.6,
        speed: 0.5 + Math.random() * 1.5,
        yBase: (Math.random() - 0.5) * 1.2,
        size: 0.015 + Math.random() * 0.02,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const s = sparks[i];
      const a = s.angle + t * s.speed;
      child.position.set(
        Math.cos(a) * s.radius,
        s.yBase + Math.sin(t * 2 + s.angle) * 0.2,
        Math.sin(a) * s.radius,
      );
      const mat = (child as Mesh).material as THREE.MeshStandardMaterial;
      if (mat) mat.emissiveIntensity = 0.5 + Math.sin(t * 4 + i) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {sparks.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Sagging Power Wire (quadratic bezier)                             */
/* ------------------------------------------------------------------ */

function PowerWire({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const points = useMemo(() => {
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      Math.min(from[1], to[1]) - 0.15,
      (from[2] + to[2]) / 2,
    ];
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const u = 1 - t;
      pts.push([
        u * u * from[0] + 2 * u * t * mid[0] + t * t * to[0],
        u * u * from[1] + 2 * u * t * mid[1] + t * t * to[1],
        u * u * from[2] + 2 * u * t * mid[2] + t * t * to[2],
      ]);
    }
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Line points={points} color="#6b7280" lineWidth={1.2} transparent opacity={0.6} />;
}

/* ------------------------------------------------------------------ */
/*  Main Scene: 3D Power Transformer                                  */
/* ------------------------------------------------------------------ */

export const OutageHeatScene: React.FC = () => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const insulatorPos: [number, number, number][] = [
    [-0.5, 0.55, 0.2],
    [0, 0.55, -0.25],
    [0.5, 0.55, 0.2],
  ];

  const wireEnds: [number, number, number][] = [
    [-2, 0.8, 0.5],
    [0, 1.2, -1.5],
    [2, 0.8, 0.5],
  ];

  return (
    <group ref={groupRef}>
      {/* Scene accent lights */}
      <pointLight position={[0, 2, 2]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0, -1, -2]} intensity={0.3} color="#1e40af" />

      {/* Transformer body (hexagonal tank) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.6, 0.65, 1.0, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.62, 0.6, 0.1, 6]} />
        <meshStandardMaterial color="#4b5563" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Bottom base plate */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.0]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Cooling fins */}
      {[-0.55, -0.35, -0.15, 0.15, 0.35, 0.55].map((x, i) => (
        <mesh key={`fin-${i}`} position={[x, -0.1, 0.62]}>
          <boxGeometry args={[0.04, 0.7, 0.08]} />
          <meshStandardMaterial color="#4b5563" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}

      {/* Status indicator light */}
      <mesh position={[0, 0.15, 0.66]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>

      {/* Insulators */}
      {insulatorPos.map((pos, i) => (
        <Insulator key={i} position={pos} />
      ))}

      {/* Power wires from insulators outward */}
      {insulatorPos.map((pos, i) => (
        <PowerWire
          key={`wire-${i}`}
          from={[pos[0], pos[1] + 0.38, pos[2]]}
          to={wireEnds[i]}
        />
      ))}

      {/* Electric arcs between insulator tips */}
      <ElectricArc
        start={[insulatorPos[0][0], insulatorPos[0][1] + 0.38, insulatorPos[0][2]]}
        end={[insulatorPos[1][0], insulatorPos[1][1] + 0.38, insulatorPos[1][2]]}
        seed={1}
      />
      <ElectricArc
        start={[insulatorPos[1][0], insulatorPos[1][1] + 0.38, insulatorPos[1][2]]}
        end={[insulatorPos[2][0], insulatorPos[2][1] + 0.38, insulatorPos[2][2]]}
        seed={2}
      />

      {/* Energy rings */}
      <EnergyRing radius={0.85} speed={1.5} yOffset={0.0} />
      <EnergyRing radius={1.0} speed={1.0} yOffset={0.25} />
      <EnergyRing radius={0.75} speed={2.0} yOffset={-0.25} />

      {/* Orbiting sparks */}
      <Sparks />

      {/* Ground plane */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.5}
          roughness={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};
