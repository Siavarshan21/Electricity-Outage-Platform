import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

interface ThreeCanvasShellProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export const ThreeCanvasShell: React.FC<ThreeCanvasShellProps> = ({
  children,
  className,
  height = "300px",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-900 to-gray-900 ${className}`}
        style={{ height }}
      >
        <p className="text-sm text-gray-400">3D visualization</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
