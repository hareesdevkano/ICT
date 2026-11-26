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
  background: string;
  card: string;
  border: string;
};

const readPalette = (): Palette | null => {
  const styles = getComputedStyle(document.documentElement);
  const readColor = (token: string) => {
    const value = styles.getPropertyValue(token).trim();
    return value ? `hsl(${value.replace(/\s+/g, ", ")})` : "";
  };

  const primary = readColor("--primary");
  const secondary = readColor("--secondary");
  const foreground = readColor("--foreground");
  const background = readColor("--background");
  const card = readColor("--card");
  const border = readColor("--border");

  return primary && secondary && foreground && background && card && border
    ? { primary, secondary, foreground, background, card, border }
    : null;
};

const buildNetwork = () => {
  const count = 32;
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

const FloatingPanel = ({
  kind,
  palette,
  reducedMotion,
}: {
  kind: "web" | "software";
  palette: Palette;
  reducedMotion: boolean;
}) => {
  const group = useRef<THREE.Group>(null);
  const isWeb = kind === "web";
  const width = 1.52;
  const height = isWeb ? 1.8 : 1.5;
  const basePosition: Point = isWeb ? [-1.64, 0.48, 0.54] : [1.63, -0.45, 0.72];
  const baseRotation: Point = isWeb ? [0.08, 0.34, -0.045] : [-0.08, -0.31, 0.055];
  const phase = isWeb ? 0 : 1.7;

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const time = state.clock.elapsedTime + phase;
    group.current.position.y = basePosition[1] + Math.sin(time * 0.55) * 0.045;
    group.current.rotation.y = baseRotation[1] + Math.sin(time * 0.3) * 0.025;
  });

  return (
    <group ref={group} position={basePosition} rotation={baseRotation} scale={0.72}>
      <mesh>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={palette.border} roughness={0.62} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[width - 0.055, height - 0.055, 0.015]} />
        <meshBasicMaterial color={palette.background} />
      </mesh>
      <mesh position={[0, height / 2 - 0.105, 0.07]}>
        <boxGeometry args={[width - 0.1, 0.16, 0.02]} />
        <meshBasicMaterial color={palette.card} />
      </mesh>
      <mesh position={[-0.58, height / 2 - 0.105, 0.09]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshBasicMaterial color={palette.secondary} />
      </mesh>
      <mesh position={[-0.42, height / 2 - 0.105, 0.09]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshBasicMaterial color={palette.primary} />
      </mesh>
      {isWeb ? (
        <>
          <mesh position={[0.31, 0.69, 0.09]}>
            <boxGeometry args={[0.48, 0.025, 0.018]} />
            <meshBasicMaterial color={palette.foreground} transparent opacity={0.45} />
          </mesh>
          <mesh position={[0, 0.25, 0.09]}>
            <boxGeometry args={[1.22, 0.5, 0.025]} />
            <meshBasicMaterial color={palette.primary} transparent opacity={0.2} />
          </mesh>
          <mesh position={[-0.23, -0.16, 0.1]}>
            <boxGeometry args={[0.68, 0.045, 0.02]} />
            <meshBasicMaterial color={palette.foreground} transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.2, -0.27, 0.1]}>
            <boxGeometry args={[0.62, 0.025, 0.02]} />
            <meshBasicMaterial color={palette.foreground} transparent opacity={0.35} />
          </mesh>
          <mesh position={[-0.46, -0.53, 0.1]}>
            <boxGeometry args={[0.38, 0.1, 0.025]} />
            <meshBasicMaterial color={palette.secondary} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.54, -0.02, 0.09]}>
            <boxGeometry args={[0.18, 1.12, 0.02]} />
            <meshBasicMaterial color={palette.card} />
          </mesh>
          <mesh position={[0.2, 0.34, 0.1]}>
            <boxGeometry args={[0.84, 0.22, 0.025]} />
            <meshBasicMaterial color={palette.primary} transparent opacity={0.2} />
          </mesh>
          <mesh position={[-0.05, -0.2, 0.1]}>
            <boxGeometry args={[0.72, 0.38, 0.025]} />
            <meshBasicMaterial color={palette.card} />
          </mesh>
          <mesh position={[-0.23, -0.31, 0.13]}>
            <boxGeometry args={[0.09, 0.15, 0.025]} />
            <meshBasicMaterial color={palette.secondary} />
          </mesh>
          <mesh position={[-0.08, -0.27, 0.13]}>
            <boxGeometry args={[0.09, 0.23, 0.025]} />
            <meshBasicMaterial color={palette.primary} />
          </mesh>
          <mesh position={[0.08, -0.22, 0.13]}>
            <boxGeometry args={[0.09, 0.33, 0.025]} />
            <meshBasicMaterial color={palette.secondary} />
          </mesh>
          <mesh position={[0.24, -0.17, 0.13]}>
            <boxGeometry args={[0.09, 0.43, 0.025]} />
            <meshBasicMaterial color={palette.primary} />
          </mesh>
        </>
      )}
    </group>
  );
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
          camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 100 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          frameloop={reducedMotion ? "demand" : "always"}
        >
          <ambientLight intensity={0.9} />
          <pointLight color={palette.primary} intensity={1.2} position={[3, 2, 5]} />
          <pointLight color={palette.secondary} intensity={0.7} position={[-3, -2, 2]} />
          <Globe palette={palette} reducedMotion={reducedMotion} />
          <FloatingPanel kind="web" palette={palette} reducedMotion={reducedMotion} />
          <FloatingPanel kind="software" palette={palette} reducedMotion={reducedMotion} />
          <ReadySignal onReady={() => setReady(true)} />
        </Canvas>
      )}
      <span className="absolute bottom-5 left-5 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:bottom-8 sm:left-8">
        Software / web systems · Kano
      </span>
    </div>
  );
};

export default NetworkGlobe;