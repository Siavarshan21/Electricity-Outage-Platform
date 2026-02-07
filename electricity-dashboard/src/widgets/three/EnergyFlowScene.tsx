import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface FlowParticle {
  angle: number;
  radius: number;
  speed: number;
  height: number;
  size: number;
  color: string;
}

export const EnergyFlowScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  const particles: FlowParticle[] = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.8 + Math.random() * 1.5,
        speed: 0.3 + Math.random() * 0.8,
        height: (Math.random() - 0.5) * 2,
        size: 0.02 + Math.random() * 0.04,
        color: ["#3b82f6", "#60a5fa", "#93c5fd", "#f59e0b", "#22c55e"][Math.floor(Math.random() * 5)],
      })),
    [],
  );

  const arcNodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return {
          x: Math.cos(angle) * 2,
          y: 0,
          z: Math.sin(angle) * 2,
          angle,
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.5;
      const s = 1 + Math.sin(t * 2) * 0.05;
      innerRingRef.current.scale.set(s, s, s);
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} color="#3b82f6" intensity={4} distance={8} />
      <pointLight position={[0, 2, 0]} color="#60a5fa" intensity={2} distance={5} />

      {/* Central energy core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} />
      </mesh>

      {/* Inner spinning ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.02, 8, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>

      {/* Outer spinning ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 8, 64]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.3} />
      </mesh>

      {/* Third ring */}
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[2, 0.01, 8, 64]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.15} />
      </mesh>

      {/* Arc nodes around the core */}
      {arcNodes.map((node, i) => (
        <group key={`node-${i}`}>
          <mesh position={[node.x, node.y, node.z]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#22c55e" : "#f59e0b"}
              emissive={i % 2 === 0 ? "#22c55e" : "#f59e0b"}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Connection lines to center */}
          <Line
            points={[[node.x, node.y, node.z], [0, 0, 0]]}
            color="#3b82f6"
            lineWidth={1}
            transparent
            opacity={0.2}
          />
        </group>
      ))}

      {/* Orbiting energy particles */}
      {particles.map((p, i) => {
        const x = Math.cos(p.angle) * p.radius;
        const z = Math.sin(p.angle) * p.radius;
        return (
          <mesh key={`particle-${i}`} position={[x, p.height, z]}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
};
