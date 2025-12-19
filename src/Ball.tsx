import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

function BingoSphere({ spinning, color, result, showResult }) {
  const meshRef = useRef();
  const { camera } = useThree();

  // Continuous spin during random
  useFrame(() => {
    if (meshRef.current && spinning) {
      meshRef.current.rotation.y += 0.08;
      meshRef.current.rotation.x += 0.06;
      camera.position.x = Math.sin(meshRef.current.rotation.x) * 2.5;
      camera.position.y = Math.sin(meshRef.current.rotation.x) * 2.5;
      camera.lookAt(0, 0, 0);
    }
  });

  // Align camera after spin finishes
  useEffect(() => {
    if (!spinning && result) {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    }
  }, [spinning, result, camera]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.35, 64, 64]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} />

      {showResult && result && (
        <Html center transform distanceFactor={1.4}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center select-none"></div>
        </Html>
      )}
    </mesh>
  );
}

const getLetterAndColor = (num) => {
  if (num <= 15) return { letter: 'B', color: '#2563eb' };
  if (num <= 30) return { letter: 'I', color: '#dc2626' };
  if (num <= 45) return { letter: 'N', color: '#16a34a' };
  if (num <= 60) return { letter: 'G', color: '#ca8a04' };
  return { letter: 'O', color: '#7c3aed' };
};

export default function BingoBallGame() {
  const [resultInfo, setResultInfo] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const play = () => {
    if (spinning) return;

    setSpinning(true);
    setResultInfo(null);

    setTimeout(() => {
      const n = Math.floor(Math.random() * 75) + 1;
      const info = getLetterAndColor(n);
      setResultInfo({ ...info, number: n });
      setSpinning(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="w-96 h-96">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -4, -5]} intensity={0.6} />

          <BingoSphere
            spinning={spinning}
            color={spinning ? '#9ca3af' : resultInfo?.color || '#9ca3af'}
            result={resultInfo}
            showResult={!spinning && !!resultInfo}
          />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <div
        className="flex flex-col text-xl text-white bg-black"
        style={{
          position: 'absolute',
          top: 'calc(50vh - 50px)',
          zIndex: 999999999999,
          backgroundColor: 'transparent',
          fontWeight: 'bold',
        }}
      >
        <div>{resultInfo?.letter}</div>
        <div>{resultInfo?.number}</div>
      </div>

      <div className="flex gap-4">
        <Button onClick={play} disabled={spinning}>
          Play
        </Button>
        <Button
          onClick={() => {
            setResultInfo(null);
            setSpinning(false);
          }}
        >
          Reload
        </Button>
      </div>
    </div>
  );
}
