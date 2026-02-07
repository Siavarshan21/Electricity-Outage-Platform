import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";

export const GridPulseScene: React.FC = () => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const nodes: Array<{ position: [number, number, number]; color: string }> = [];
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const isActive = Math.random() > 0.7;
      nodes.push({
        position: [i * 0.8, j * 0.8, 0],
        color: isActive ? "#ef4444" : "#22c55e",
      });
    }
  }

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {nodes.map((node, i) =>
        nodes.slice(i + 1).map((other, j) => {
          const dx = node.position[0] - other.position[0];
          const dy = node.position[1] - other.position[1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1.2) return null;
          return (
            <Line
              key={`${i}-${j}`}
              points={[node.position, other.position]}
              color="#4b5563"
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          );
        }),
      )}
    </group>
  );
};
