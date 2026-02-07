import React, { useEffect, useRef, useCallback } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  PointLight,
  Vector3,
  Color3,
  Color4,
  MeshBuilder,
  StandardMaterial,
  GlowLayer,
  ParticleSystem,
  Texture,
  Animation,
} from "@babylonjs/core";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

interface BabylonCanvasProps {
  className?: string;
  height?: string;
  scene: "powerGrid" | "electricArc" | "transformer";
}

function createPowerGridScene(scene: Scene): void {
  const gridSize = 5;
  const spacing = 1.2;
  const nodes: { mesh: ReturnType<typeof MeshBuilder.CreateSphere>; active: boolean }[] = [];

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const isActive = Math.random() > 0.3;
      const sphere = MeshBuilder.CreateSphere(
        `node_${x}_${z}`,
        { diameter: 0.15, segments: 16 },
        scene,
      );
      sphere.position = new Vector3(
        (x - gridSize / 2) * spacing,
        0,
        (z - gridSize / 2) * spacing,
      );

      const mat = new StandardMaterial(`mat_${x}_${z}`, scene);
      mat.diffuseColor = isActive ? new Color3(0.13, 0.77, 0.37) : new Color3(0.94, 0.27, 0.27);
      mat.emissiveColor = isActive
        ? new Color3(0.13, 0.77, 0.37).scale(0.4)
        : new Color3(0.94, 0.27, 0.27).scale(0.4);
      sphere.material = mat;
      nodes.push({ mesh: sphere, active: isActive });

      // Add connections
      if (x > 0) {
        const line = MeshBuilder.CreateLines(
          `lineX_${x}_${z}`,
          {
            points: [
              new Vector3((x - gridSize / 2) * spacing, 0, (z - gridSize / 2) * spacing),
              new Vector3((x - 1 - gridSize / 2) * spacing, 0, (z - gridSize / 2) * spacing),
            ],
          },
          scene,
        );
        line.color = new Color3(0.3, 0.5, 0.8);
        line.alpha = 0.4;
      }
      if (z > 0) {
        const line = MeshBuilder.CreateLines(
          `lineZ_${x}_${z}`,
          {
            points: [
              new Vector3((x - gridSize / 2) * spacing, 0, (z - gridSize / 2) * spacing),
              new Vector3((x - gridSize / 2) * spacing, 0, (z - 1 - gridSize / 2) * spacing),
            ],
          },
          scene,
        );
        line.color = new Color3(0.3, 0.5, 0.8);
        line.alpha = 0.4;
      }
    }
  }

  // Pulse animation on nodes
  nodes.forEach((node, i) => {
    const anim = new Animation(
      `pulse_${i}`,
      "scaling",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    anim.setKeys([
      { frame: 0, value: new Vector3(1, 1, 1) },
      { frame: 15, value: new Vector3(1.3, 1.3, 1.3) },
      { frame: 30, value: new Vector3(1, 1, 1) },
    ]);
    node.mesh.animations.push(anim);
    scene.beginAnimation(node.mesh, 0, 30, true, 0.5 + Math.random() * 0.5);
  });
}

function createElectricArcScene(scene: Scene): void {
  // Central transformer
  const transformer = MeshBuilder.CreateBox("transformer", { width: 0.8, height: 1.2, depth: 0.6 }, scene);
  transformer.position = new Vector3(0, 0, 0);
  const tMat = new StandardMaterial("tMat", scene);
  tMat.diffuseColor = new Color3(0.4, 0.45, 0.5);
  tMat.emissiveColor = new Color3(0.1, 0.15, 0.2);
  tMat.specularColor = new Color3(0.5, 0.5, 0.5);
  transformer.material = tMat;

  // Insulators on top
  for (let i = -1; i <= 1; i++) {
    const insulator = MeshBuilder.CreateCylinder(
      `insulator_${i}`,
      { height: 0.4, diameterTop: 0.06, diameterBottom: 0.1, tessellation: 12 },
      scene,
    );
    insulator.position = new Vector3(i * 0.25, 0.8, 0);
    const iMat = new StandardMaterial(`iMat_${i}`, scene);
    iMat.diffuseColor = new Color3(0.23, 0.51, 0.98);
    iMat.emissiveColor = new Color3(0.15, 0.35, 0.7);
    insulator.material = iMat;

    // Electric arc particles from insulators
    const ps = new ParticleSystem(`arc_${i}`, 100, scene);
    ps.createPointEmitter(new Vector3(-0.05, 0, -0.05), new Vector3(0.05, 0.3, 0.05));
    ps.emitter = insulator;
    ps.minSize = 0.01;
    ps.maxSize = 0.04;
    ps.minLifeTime = 0.05;
    ps.maxLifeTime = 0.15;
    ps.emitRate = 80;
    ps.color1 = new Color4(0.37, 0.63, 0.98, 1);
    ps.color2 = new Color4(0.58, 0.77, 1, 1);
    ps.colorDead = new Color4(0.15, 0.35, 0.7, 0);
    ps.minEmitPower = 0.5;
    ps.maxEmitPower = 1.5;
    ps.updateSpeed = 0.02;
    ps.start();
  }

  // Wires going outward
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const endX = Math.cos(angle) * 2.5;
    const endZ = Math.sin(angle) * 2.5;

    const wire = MeshBuilder.CreateLines(
      `wire_${i}`,
      {
        points: [new Vector3(0, 1, 0), new Vector3(endX, 0.5, endZ)],
      },
      scene,
    );
    wire.color = new Color3(0.6, 0.65, 0.7);

    // Pole at end
    const pole = MeshBuilder.CreateCylinder(
      `pole_${i}`,
      { height: 2, diameter: 0.05, tessellation: 8 },
      scene,
    );
    pole.position = new Vector3(endX, 0.5, endZ);
    const poleMat = new StandardMaterial(`poleMat_${i}`, scene);
    poleMat.diffuseColor = new Color3(0.5, 0.5, 0.55);
    pole.material = poleMat;
  }

  // Rotating animation for the whole scene
  const rotAnim = new Animation(
    "sceneRot",
    "rotation.y",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  );
  rotAnim.setKeys([
    { frame: 0, value: 0 },
    { frame: 300, value: Math.PI * 2 },
  ]);
  transformer.animations.push(rotAnim);
}

function createTransformerScene(scene: Scene): void {
  // Main transformer body
  const body = MeshBuilder.CreateCylinder("tBody", { height: 1.5, diameter: 1, tessellation: 24 }, scene);
  body.position.y = 0.2;
  const bodyMat = new StandardMaterial("bodyMat", scene);
  bodyMat.diffuseColor = new Color3(0.35, 0.4, 0.45);
  bodyMat.specularColor = new Color3(0.7, 0.7, 0.7);
  body.material = bodyMat;

  // Cooling fins
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const fin = MeshBuilder.CreateBox(`fin_${i}`, { width: 0.05, height: 1.2, depth: 0.2 }, scene);
    fin.position = new Vector3(Math.cos(angle) * 0.55, 0.2, Math.sin(angle) * 0.55);
    fin.rotation.y = -angle;
    const finMat = new StandardMaterial(`finMat_${i}`, scene);
    finMat.diffuseColor = new Color3(0.4, 0.45, 0.5);
    fin.material = finMat;
  }

  // Bushings on top
  for (let i = -1; i <= 1; i++) {
    const bushing = MeshBuilder.CreateCylinder(
      `bushing_${i}`,
      { height: 0.6, diameterTop: 0.06, diameterBottom: 0.1, tessellation: 12 },
      scene,
    );
    bushing.position = new Vector3(i * 0.3, 1.25, 0);
    const bMat = new StandardMaterial(`bMat_${i}`, scene);
    bMat.diffuseColor = new Color3(0.23, 0.51, 0.98);
    bMat.emissiveColor = new Color3(0.1, 0.3, 0.6);
    bushing.material = bMat;
  }

  // Energy particles
  const ps = new ParticleSystem("energy", 200, scene);
  ps.createCylinderEmitter(0.5, 0.8, 0, 0);
  ps.emitter = body;
  ps.minSize = 0.01;
  ps.maxSize = 0.03;
  ps.minLifeTime = 0.5;
  ps.maxLifeTime = 1.5;
  ps.emitRate = 60;
  ps.color1 = new Color4(0.23, 0.76, 0.37, 0.8);
  ps.color2 = new Color4(0.37, 0.63, 0.98, 0.8);
  ps.colorDead = new Color4(0, 0, 0, 0);
  ps.minEmitPower = 0.3;
  ps.maxEmitPower = 0.8;
  ps.updateSpeed = 0.01;
  ps.gravity = new Vector3(0, 0.5, 0);
  ps.start();

  // Slow rotation
  const rotAnim = new Animation(
    "bodyRot",
    "rotation.y",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  );
  rotAnim.setKeys([
    { frame: 0, value: 0 },
    { frame: 600, value: Math.PI * 2 },
  ]);
  body.animations.push(rotAnim);
  scene.beginAnimation(body, 0, 600, true);
}

export const BabylonCanvas: React.FC<BabylonCanvasProps> = ({
  className,
  height = "300px",
  scene: sceneType,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const initScene = useCallback(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.06, 0.09, 0.16, 1);

    // Camera
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 6, Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 10;
    camera.wheelPrecision = 50;

    // Lights
    const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.4;
    hemiLight.diffuse = new Color3(0.6, 0.7, 0.8);

    const pointLight = new PointLight("pointLight", new Vector3(0, 3, 0), scene);
    pointLight.intensity = 1.5;
    pointLight.diffuse = new Color3(0.23, 0.51, 0.98);

    // Glow layer
    const gl = new GlowLayer("glow", scene);
    gl.intensity = 0.6;

    // Create scene based on type
    switch (sceneType) {
      case "powerGrid":
        createPowerGridScene(scene);
        break;
      case "electricArc":
        createElectricArcScene(scene);
        break;
      case "transformer":
        createTransformerScene(scene);
        break;
    }

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [sceneType]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const cleanup = initScene();
    return cleanup;
  }, [initScene, prefersReducedMotion]);

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
      <canvas ref={canvasRef} className="h-full w-full" style={{ outline: "none" }} />
    </div>
  );
};
