import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, OrbitControls } from '@react-three/drei';
import { Loader } from 'lucide-react';

const PCModel = () => {
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {/* Main Case Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 2]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Glass Panel Tint */}
      <mesh position={[0.51, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2, 1.8]} />
        <meshPhysicalMaterial 
          color="#000" 
          transparent 
          opacity={0.3} 
          roughness={0} 
          metalness={1}
          side={2}
        />
      </mesh>
      
      {/* Internal Components */}
      <mesh position={[0, 0.5, 0]}>
         <boxGeometry args={[0.8, 1.8, 1.8]} />
         <meshStandardMaterial color="#333" wireframe />
      </mesh>
      
      {/* RGB Lighting Effect */}
      <pointLight position={[0, 0.5, 0]} intensity={2} color="#00ff88" distance={3} />
      <pointLight position={[0, -0.5, 0]} intensity={1.5} color="#ff0088" distance={2.5} />
    </group>
  );
};

const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
    <Loader className="w-8 h-8 text-primary-600 animate-spin" />
    <p className="text-sm text-gray-500">Loading 3D viewer...</p>
  </div>
);

const ErrorFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-4">
    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
      <span className="text-2xl">⚠️</span>
    </div>
    <p className="text-sm font-medium text-gray-700">3D viewer unavailable</p>
    <p className="text-xs text-gray-500">Your browser may not support WebGL</p>
  </div>
);

const ProductViewer3D = ({ modelUrl }) => {
  const canvasRef = useRef();
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Only render on client-side to prevent SSR issues
  useEffect(() => {
    setIsClient(true);
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup WebGL context on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current.querySelector('canvas');
        if (canvas) {
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        }
      }
    };
  }, []);

  // Error handler for Canvas
  const handleError = (error) => {
    console.error('3D Canvas Error:', error);
    setHasError(true);
    setIsLoading(false);
  };

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden flex items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }

  // Show fallback if error occurred
  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
        <ErrorFallback />
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef} 
      className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden relative"
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <LoadingFallback />
        </div>
      )}
      
      <Canvas 
        dpr={[1, 2]}
        shadows
        camera={{ fov: 45, position: [0, 0, 5], near: 0.1, far: 1000 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          if (!gl || !gl.getParameter) {
            handleError(new Error('WebGL context creation failed'));
          } else {
            setIsLoading(false);
          }
        }}
        onError={handleError}
      >
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.8} 
            polar={[-0.3, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 1, tension: 170, friction: 26 }}
          >
            <ambientLight intensity={0.5} />
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.15} 
              penumbra={1} 
              intensity={1}
              castShadow
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <PCModel />
          </PresentationControls>
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-medium text-white border border-white/20 pointer-events-none">
        <span className="hidden md:inline">Drag to rotate • Scroll to zoom</span>
        <span className="md:hidden">Touch to interact</span>
      </div>
    </div>
  );
};

export default ProductViewer3D;
