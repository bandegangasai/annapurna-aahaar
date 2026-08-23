import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Traditional Mill / Chakki & Grain Vessel Mesh
function TraditionalChakkiMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const topStoneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.1;
    }
    if (topStoneRef.current) {
      topStoneRef.current.rotation.y = -time * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.3, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Base Foundation Platform */}
      <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.4, 32]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative Gold Rim Ring */}
      <mesh position={[0, -0.45, 0]}>
        <torusGeometry args={[2.22, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Bottom Grinding Stone */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 2.0, 0.5, 32]} />
        <meshStandardMaterial
          color="#A0522D"
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Top Rotating Grinding Stone */}
      <mesh ref={topStoneRef} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.85, 0.5, 32]} />
        <meshStandardMaterial
          color="#C68B59"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Central Grain Hopper (Opening where grains enter) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.3, 24]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Wooden Turning Handle (Traditional Hatha) */}
      <mesh position={[1.2, 0.9, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.9, 16]} />
        <meshStandardMaterial
          color="#5C2C16"
          roughness={0.9}
        />
      </mesh>

      {/* Golden Grain Aura / Central Essence Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <MeshDistortMaterial
            color="#FBBF24"
            emissive="#D97706"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

// 3D Floating Grain & Spice Particles
function FloatingParticles({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#F59E0B'), // Gold Turmeric
      new THREE.Color('#FDE68A'), // Light Wheat
      new THREE.Color('#D97706'), // Saffron
      new THREE.Color('#FEF3C7'), // Cream
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 8;
      pos[i3 + 1] = (Math.random() - 0.5) * 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;

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
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
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
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

// 2D Fallback Component for environments without WebGL or with reduced motion
function FallbackHeroVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      {/* Radiant Glowing Background */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-turmeric-600/30 via-amber-500/20 to-transparent blur-3xl animate-pulse" />
      
      {/* Decorative Rotating Mandala Emblem */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-turmeric-500/40 flex items-center justify-center p-6 animate-spin-slow">
        <div className="w-full h-full rounded-full border-4 border-turmeric-600/60 flex items-center justify-center bg-heritage-maroon/20 backdrop-blur-sm shadow-2xl">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-turmeric-500 via-amber-700 to-heritage-maroon flex flex-col items-center justify-center shadow-inner text-cream-100 p-4 text-center">
            <span className="font-serif font-black text-3xl sm:text-4xl text-amber-200">AA</span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-cream-200 mt-1">
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

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <FallbackHeroVisual />;
  }

  return (
    <div className="w-full h-[380px] sm:h-[480px] lg:h-[540px] relative">
      <Canvas
        camera={{ position: [0, 1.2, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        {/* Warm Indian Atmosphere Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#FFFBEB" castShadow />
        <pointLight position={[-4, 2, -2]} intensity={0.8} color="#F59E0B" />
        <spotLight
          position={[0, 6, 2]}
          angle={0.6}
          penumbra={0.8}
          intensity={1.2}
          color="#FDE68A"
        />

        {/* 3D Model & Dynamic Particle System */}
        <TraditionalChakkiMesh />
        <FloatingParticles count={80} />
      </Canvas>
    </div>
  );
};
