import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Traditional Brass Thali, Grain Milling Chakki & Golden Haldi Essence
function HeritageComposition() {
  const groupRef = useRef<THREE.Group>(null);
  const chakkiStoneRef = useRef<THREE.Mesh>(null);
  const papadPlateRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
      groupRef.current.position.y = Math.sin(time * 0.6) * 0.06;
    }
    if (chakkiStoneRef.current) {
      chakkiStoneRef.current.rotation.y = -time * 0.3;
    }
    if (papadPlateRef.current) {
      papadPlateRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.15, 1.15, 1.15]}>
      {/* 1. Traditional Indian Brass Thali Base */}
      <mesh position={[0, -0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.3, 2.5, 0.15, 48]} />
        <meshStandardMaterial
          color="#C79A45"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Raised Brass Rim */}
      <mesh position={[0, -0.55, 0]}>
        <torusGeometry args={[2.42, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#DFC17B"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* 2. Traditional Grain Grinding Chakki (Stone & Terracotta Base) */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.8, 0.35, 32]} />
        <meshStandardMaterial
          color="#173F35"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Top Rotating Chakki Stone (Deep Forest / Dark Terracotta) */}
      <mesh ref={chakkiStoneRef} position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.55, 0.45, 32]} />
        <meshStandardMaterial
          color="#A65332"
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>

      {/* Central Brass Grain Hopper */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 0.25, 24]} />
        <meshStandardMaterial
          color="#C79A45"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Traditional Wooden Handle */}
      <mesh position={[0.95, 0.55, 0]} rotation={[0, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.75, 16]} />
        <meshStandardMaterial
          color="#3E2723"
          roughness={0.9}
        />
      </mesh>

      {/* 3. Golden Haldi / Grain Essence Sphere */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.9}>
        <mesh position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <MeshDistortMaterial
            color="#E5A91E"
            emissive="#C79A45"
            emissiveIntensity={0.4}
            roughness={0.25}
            metalness={0.65}
            distort={0.25}
            speed={2}
          />
        </mesh>
      </Float>

      {/* 4. Handcrafted Sun-Dried Papad Disk (Floating Angle) */}
      <group ref={papadPlateRef} position={[1.4, 0.4, 0.5]} rotation={[0.4, 0.2, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.02, 32]} />
          <meshStandardMaterial
            color="#F1E9D5"
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      </group>
    </group>
  );
}

// Floating Golden Grain & Spice Particles
function FloatingHeritageParticles({ count = 55 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#C79A45'), // Antique Gold
      new THREE.Color('#DFC17B'), // Light Gold
      new THREE.Color('#A65332'), // Terracotta
      new THREE.Color('#E5A91E'), // Turmeric Yellow
      new THREE.Color('#F8F3E7'), // Warm Ivory
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 7.5;
      pos[i3 + 1] = (Math.random() - 0.5) * 5.5;
      pos[i3 + 2] = (Math.random() - 0.5) * 5.5;

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.035;
      pointsRef.current.rotation.x = Math.sin(time * 0.025) * 0.06;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// 2D Static High-Quality Fallback for WebGL Unavailable or Reduced Motion
function FallbackHeroVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#173F35]/20 via-[#C79A45]/20 to-transparent blur-3xl" />
      <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-[#C79A45]/50 flex items-center justify-center p-5">
        <div className="w-full h-full rounded-full border-4 border-[#C79A45] flex items-center justify-center bg-[#173F35]/40 backdrop-blur-sm shadow-2xl">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-[#173F35] to-[#0C241E] flex flex-col items-center justify-center shadow-inner text-[#F8F3E7] p-4 text-center border border-[#C79A45]/50">
            <span className="font-serif font-black text-3xl sm:text-4xl text-[#C79A45]">AA</span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#DFC17B] mt-1">
              Annapurna Aahaar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const HeroScene: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    // Check Reduced Motion Preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) setIsReducedMotion(true);

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Viewport Intersection Observer to Pause when scrolled off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!hasWebGL || isReducedMotion) {
    return <FallbackHeroVisual />;
  }

  return (
    <div ref={containerRef} className="w-full h-[360px] sm:h-[460px] lg:h-[520px] relative">
      {isInView && (
        <Canvas
          camera={{ position: [0, 1.1, 4.4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.25} color="#FFFDF5" castShadow />
          <pointLight position={[-4, 2, -2]} intensity={0.8} color="#C79A45" />
          <spotLight
            position={[0, 6, 2]}
            angle={0.6}
            penumbra={0.8}
            intensity={1.2}
            color="#DFC17B"
          />

          <HeritageComposition />
          <FloatingHeritageParticles count={55} />
        </Canvas>
      )}
    </div>
  );
};

export default HeroScene;
