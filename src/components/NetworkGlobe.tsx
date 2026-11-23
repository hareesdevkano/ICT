import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import heroImg from "@/assets/hero-network.jpg";

type Point = [number, number, number];

type Palette = {
  primary: string;
  secondary: string;
  foreground: string;
};

const readPalette = (): Palette | null => {
  const styles = getComputedStyle(document.documentElement);
  const readColor = (token: string) => {
    const value = styles.getPropertyValue(token).trim();
    return value ? `hsl(${value})` : "";
  };

  const primary = readColor("--primary");
  const secondary = readColor("--secondary");
  const foreground = readColor("--foreground");

  return primary && secondary && foreground ? { primary, secondary, foreground } : null;
};

const buildNetwork = () => {
  const count = 24;
  const radius = 1.48;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const nodes: Point[] = Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const ringRadius = Math.sqrt(1 - y * y);
    const angle = goldenAngle * index;
    return [Math.cos(angle) * ringRadius * radius, y * radius, Math.sin(angle) * ringRadius * radius];
  });

  const linePoints: THREE.Vector3[] = [];
  nodes.forEach((point, index) => {
    const nearest = nodes
      .map((candidate, candidateIndex) => ({
        candidate,
        candidateIndex,
        distance: Math.hypot(
          point[0] - candidate[0],
          point[1] - candidate[1],
          point[2] - candidate[2],
        ),
      }))
      .filter(({ candidateIndex }) => candidateIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    nearest.forEach(({ candidate, candidateIndex }) => {
      if (index < candidateIndex) {
        linePoints.push(new THREE.Vector3(...point), new THREE.Vector3(...candidate));
      }
    });
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
  return { nodes, geometry };
};

const ReadySignal = ({ onReady }: { onReady: () => void }) => {
  const hasSignaled = useRef(false);

  useFrame(() => {
    if (!hasSignaled.current) {
      hasSignaled.current = true;
      onReady();
    }
  });

  return null;
};

const Globe = ({ palette, reducedMotion }: { palette: Palette; reducedMotion: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const network = useMemo(buildNetwork, []);

  useEffect(() => () => network.geometry.dispose(), [network.geometry]);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    const frameDelta = Math.min(delta, 0.05);
    group.current.rotation.y += frameDelta * 0.09;
    const tilt = -state.pointer.y * 0.14;
    group.current.rotation.x += (tilt - group.current.rotation.x) * Math.min(1, frameDelta * 2.5);
  });

  return (
    <group ref={group} rotation={[-0.08, 0.15, 0]}>
      <mesh>
        <sphereGeometry args={[1.48, 40, 28]} />
        <meshBasicMaterial color={palette.foreground} transparent opacity={0.035} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.48, 32, 24]} />
        <meshBasicMaterial color={palette.primary} wireframe transparent opacity={0.22} />
      </mesh>
      <lineSegments geometry={network.geometry}>
        <lineBasicMaterial color={palette.primary} transparent opacity={0.62} />
      </lineSegments>
      {network.nodes.map((point, index) => (
        <mesh key={index} position={point} scale={index % 6 === 0 ? 1.7 : 1}>
          <sphereGeometry args={[0.027, 10, 8]} />
          <meshBasicMaterial color={index % 6 === 0 ? palette.secondary : palette.primary} />
        </mesh>
      ))}
      <mesh rotation={[0.62, 0.16, 0.3]}>
        <torusGeometry args={[2.04, 0.008, 4, 128]} />
        <meshBasicMaterial color={palette.secondary} transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[1.21, 0.74, 0.06]}>
        <torusGeometry args={[1.83, 0.005, 4, 128]} />
        <meshBasicMaterial color={palette.foreground} transparent opacity={0.28} />
      </mesh>
      <mesh position={[1.91, 0.66, 0.21]}>
        <sphereGeometry args={[0.06, 12, 10]} />
        <meshBasicMaterial color={palette.secondary} />
      </mesh>
      <mesh position={[-1.72, -0.92, -0.12]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshBasicMaterial color={palette.primary} />
      </mesh>
    </group>
  );
};

const NetworkGlobe = () => {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    setPalette(readPalette());
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      data-scene-ready={ready ? "true" : "false"}
      aria-hidden="true"
    >
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
        width={1920}
        height={1088}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/20 to-background/70" />
      {palette && (
        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.4]}
          camera={{ position: [0, 0, 6.2], fov: 40, near: 0.1, far: 100 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          frameloop={reducedMotion ? "demand" : "always"}
        >
          <ambientLight intensity={0.9} />
          <pointLight color={palette.primary} intensity={1.2} position={[3, 2, 5]} />
          <Globe palette={palette} reducedMotion={reducedMotion} />
          <ReadySignal onReady={() => setReady(true)} />
        </Canvas>
      )}
      <span className="absolute bottom-5 left-5 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:bottom-8 sm:left-8">
        Connected systems / Kano
      </span>
    </div>
  );
};

export default NetworkGlobe;