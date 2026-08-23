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
      meshRef.current.rotation.y = time * 0.18;
      meshRef.current.position.y = Math.sin(time * 0.7) * 0.08;
    }
    if (topStoneRef.current) {
      topStoneRef.current.rotation.y = -time * 0.35;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.25, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Base Terracotta Platform */}
      <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.4, 32]} />
        <meshStandardMaterial
          color="#5C1D06"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative Antique Gold Rim Ring */}
      <mesh position={[0, -0.45, 0]}>
        <torusGeometry args={[2.22, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#C89B3C"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Bottom Grinding Stone */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 2.0, 0.5, 32]} />
        <meshStandardMaterial
          color="#7C2D12"
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* Top Rotating Grinding Stone */}
      <mesh ref={topStoneRef} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.85, 0.5, 32]} />
        <meshStandardMaterial
          color="#9A3412"
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* Central Grain Hopper (Brass / Antique Gold) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.3, 24]} />
        <meshStandardMaterial
          color="#C89B3C"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Wooden Turning Handle (Traditional Hatha) */}
      <mesh position={[1.2, 0.9, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.9, 16]} />
        <meshStandardMaterial
          color="#2B170F"
          roughness={0.9}
        />
      </mesh>

      {/* Golden Grain Aura / Central Essence Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <MeshDistortMaterial
            color="#D4AF37"
            emissive="#9A781E"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            distort={0.35}
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
      new THREE.Color('#C89B3C'), // Antique Gold
      new THREE.Color('#E5BE6C'), // Golden Turmeric
      new THREE.Color('#9A3412'), // Terracotta
      new THREE.Color('#FAF6EE'), // Sandalwood Cream
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
      pointsRef.current.rotation.y = time * 0.04;
      pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.08;
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

// 2D Fallback Visual
function FallbackHeroVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-heritage-maroon/20 via-heritage-gold/20 to-transparent blur-3xl" />
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-heritage-gold/40 flex items-center justify-center p-6 animate-spin-slow">
        <div className="w-full h-full rounded-full border-4 border-heritage-gold/60 flex items-center justify-center bg-heritage-darkMaroon/30 backdrop-blur-sm shadow-2xl">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-heritage-maroon via-heritage-richRed to-heritage-darkMaroon flex flex-col items-center justify-center shadow-inner text-cream-100 p-4 text-center border border-heritage-gold/40">
            <span className="font-serif font-black text-3xl sm:text-4xl text-heritage-gold">AA</span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-cream-200 mt-1">
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
      if (!gl) setHasWebGL(false);
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
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 5]} intensity={1.3} color="#FFFDF5" castShadow />
        <pointLight position={[-4, 2, -2]} intensity={0.8} color="#C89B3C" />
        <spotLight
          position={[0, 6, 2]}
          angle={0.6}
          penumbra={0.8}
          intensity={1.2}
          color="#FDEFB3"
        />

        <TraditionalChakkiMesh />
        <FloatingParticles count={75} />
      </Canvas>
    </div>
  );
};
