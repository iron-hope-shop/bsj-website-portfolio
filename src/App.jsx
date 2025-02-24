import React, { Suspense, useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, useProgress, Wireframe } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

import Loader from './components/Loader';
import CameraUpdater from './components/CameraUpdater';
import TargetedDirectionalLight from './components/TargetedDirectionalLight';
import Model from './components/Model';
import ComputerOS from './components/ComputerOS';
import ErrorBoundary from './components/ErrorBoundary';
import CustomSlider from './components/CustomSlider';
import InfoOverlay from './components/InfoOverlay';
import Desktop from './components/Desktop';
import WireframeSphere from './components/WireframeSphere';

function App() {
  // Routing hooks
  const location = useLocation();
  const navigate = useNavigate();
  const hideOverlays = location.pathname === '/desktop';

  // State and refs
  const cameraRef = useRef();
  const cameraTarget = useRef(new THREE.Vector3(0, 1, 0));
  // Instead of: const [showInfo, setShowInfo] = useState(true);
  const [showInfo, setShowInfo] = useState(() => {
    // If localStorage has a "visited" flag, don't show the overlay; otherwise, show it.
    return localStorage.getItem('visited') ? false : true;
  });

  useEffect(() => {
    if (!showInfo) {
      localStorage.setItem('visited', 'true');
    }
  }, [showInfo]);

  const [mode, setMode] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [isComputerOSOpen, setComputerOSOpen] = useState(false);
  const [tooltip, setTooltip] = useState('');
  const [showDesktopTime, setShowDesktopTime] = useState(true);
  const [loaded, setLoaded] = useState(false); // New state to indicate scene is ready

  const cameraViews = {
    default: { position: [-5, 2, 5], target: [0, 1, 0] },
    leftWall: { position: [-0.8, 1.75, 0.05], target: [2, 1.5, 0.05] },
    rightWall: { position: [-0.7, 1.8, 0.95], target: [-0.7, 1.65, -5] },
    closeUp: { position: [-0.785, 1.2, 0.23], target: [-0.785, 0.5, -5] },
  };

  const animateCameraTo = (view, duration = 1) => {
    const cam = cameraRef.current;
    if (!cam) return;
    gsap.to(cam.position, {
      x: view.position[0],
      y: view.position[1],
      z: view.position[2],
      duration,
      ease: 'power2.inOut',
    });
    const currentTarget = {
      x: cameraTarget.current.x,
      y: cameraTarget.current.y,
      z: cameraTarget.current.z,
    };
    gsap.to(currentTarget, {
      x: view.target[0],
      y: view.target[1],
      z: view.target[2],
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        cameraTarget.current.set(
          currentTarget.x,
          currentTarget.y,
          currentTarget.z
        );
        cam.lookAt(cameraTarget.current);
      },
      onComplete: () => {
        cameraTarget.current.set(...view.target);
      },
    });
  };

  const resetAndAnimate = (targetView, newMode) => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: cameraViews.default.position[0],
        y: cameraViews.default.position[1],
        z: cameraViews.default.position[2],
        duration: 0.01,
        onComplete: () => {
          setMode(newMode);
          setSliderValue(0);
          animateCameraTo(targetView, 1.0);
        },
      });
    }
  };

  const handleLeftClick = () => {
    console.log("Navigating to /gallery");
    navigate('/gallery');
    resetAndAnimate(cameraViews.leftWall, 'left');
  };

  const handleRightClick = () => {
    console.log("Navigating to /bookshelf");
    navigate('/bookshelf');
    resetAndAnimate(cameraViews.rightWall, 'right');
  };

  const handleComputerClick = () => {
    console.log("Navigating to /computer");
    navigate('/computer');
    setMode('computer');
    animateCameraTo(cameraViews.closeUp, 1.0);
  };

  const handleCloseView = () => {
    console.log("Navigating to default /");
    navigate('/');
    setMode(null);
    setSliderValue(0);
    animateCameraTo(cameraViews.default, 1.0);
  };

  const handleComputerScreenClick = (screenData) => {
    handleComputerClick();
    setComputerOSOpen(true);
  };

    const handleCloseComputerOS = () => {
    setComputerOSOpen(false);
    setLoaded(false); // Trigger re-render
  };

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 500px)').matches;

  const { progress } = useProgress();

  // Only run routing logic once the scene (and camera) is loaded
  useEffect(() => {
    if (!loaded) return;
    console.log('Current pathname:', location.pathname);
    const path = location.pathname.replace(/\/$/, ''); // Remove trailing slash
    if (path === '/gallery') {
      resetAndAnimate(cameraViews.leftWall, 'left');
    } else if (path === '/bookshelf') {
      resetAndAnimate(cameraViews.rightWall, 'right');
    } else if (path === '/desktop') {
      // For /desktop, shift to computer view but do not open any overlay.
      setMode('computer');
      animateCameraTo(cameraViews.closeUp, 1.0);
    } else if (path === '/computer') {
      // This branch remains unchanged.
      handleComputerClick();
    } else {
      setMode(null);
      animateCameraTo(cameraViews.default, 1.0);
    }
  }, [location.pathname, loaded]);


  // Update camera when sliderValue or mode changes (for left/right panning)
  useEffect(() => {
    if ((mode === 'left' || mode === 'right') && cameraRef.current) {
      if (sliderValue === 0) return;
      if (mode === 'left') {
        const panRange = 6;
        const basePos = cameraViews.leftWall.position;
        const baseTarget = cameraViews.leftWall.target;
        const newPos = [...basePos];
        const newTarget = [...baseTarget];
        newPos[2] = basePos[2] + sliderValue * panRange;
        newTarget[2] = baseTarget[2] + sliderValue * panRange;
        cameraRef.current.position.set(...newPos);
        cameraTarget.current.set(...newTarget);
        cameraRef.current.lookAt(cameraTarget.current);
      } else if (mode === 'right') {
        const panRange = 6;
        const basePos = cameraViews.rightWall.position;
        const baseTarget = cameraViews.rightWall.target;
        const newPos = [...basePos];
        const newTarget = [...baseTarget];
        newPos[0] = basePos[0] + sliderValue * panRange;
        newTarget[0] = baseTarget[0] + sliderValue * panRange;
        cameraRef.current.position.set(...newPos);
        cameraTarget.current.set(...newTarget);
        cameraRef.current.lookAt(cameraTarget.current);
      }
    }
  }, [sliderValue, mode]);

  return (
    <ErrorBoundary>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#222',
          overflow: 'hidden',
        }}
      >
        <Canvas
          camera={{
            position: cameraViews.default.position,
            fov: 45,
            near: 0.1,
            far: 5000,
          }}
          onCreated={({ camera, scene, gl }) => {
            camera.position.set(...cameraViews.default.position);
            cameraTarget.current.set(...cameraViews.default.target);
            camera.lookAt(cameraTarget.current);
            // scene.background = new THREE.Color('#000000');
            gl.setClearColor('#000000');
            setLoaded(true); // Mark the scene as loaded once the camera is ready
          }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true }}
        >
          <CameraUpdater cameraRef={cameraRef} />
          <ambientLight intensity={0.3} />
          <TargetedDirectionalLight
            position={[-5, 2, 5]}
            intensity={3}
            target={[0, 1, 0]}
          />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[1000, 1000]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <gridHelper
            args={[1000, 100, '#76ABAE', '#76ABAE']}
            position={[0, 0.02, 0]}
          />
          <WireframeSphere />
          {!isComputerOSOpen && (
            <Suspense fallback={hideOverlays ? null : <Loader />}>
            <Model
              showInfo={showInfo}
              cameraRef={cameraRef}
              onComputerScreenClick={handleComputerScreenClick}
              isComputerView={mode === 'computer'}
              isComputerOSOpen={isComputerOSOpen}
              setShowDesktopTime={setShowDesktopTime}
              showDesktopTime={showDesktopTime}
              setTooltip={setTooltip}
              hideOverlays={hideOverlays} // This flag can be used within Model if needed.
            />
            <Environment preset="sunset" background={false} />
          </Suspense>
          )}
        </Canvas>

        {/* UI Overlay (only visible when ComputerOS is closed) */}
        {!isComputerOSOpen && !hideOverlays && (
          <div
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            <button
              onClick={() => setShowInfo((prev) => !prev)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#000',
                color: '#76ABAE',
                border: '2px solid #76ABAE',
                width: '42px',
                height: '42px',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {showInfo ? '✕ Close' : '? Help'}
            </button>

            <InfoOverlay
              showInfo={showInfo}
              progress={progress}
              setShowInfo={setShowInfo}
            />

            {tooltip && (
              <div
                style={{
                  position: 'fixed',
                  top: '-32px',
                  left: '-32px',
                  margin: '48px',
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: '#76ABAE',
                  border: '2px solid #76ABAE',
                  padding: '36px 24px 40px 40px',
                  // paddingLeft: '40px',
                  borderRadius: 0,
                  fontSize: '14px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingRight: '2rem',
                  width: '224px',
                }}
              >
                {isMobile && (
                  <button
                    onClick={() => setTooltip('')}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: '#000',
                      color: '#76ABAE',
                      border: '1px solid #76ABAE',
                      borderRadius: 0,
                      fontSize: '8px',
                      width: '23px',
                      height: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                )}
                <span>{tooltip}</span>
              </div>
            )}

            {mode ? (
              mode === 'computer' ? (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 9,
                    width: '80%',
                    justifyContent: 'flex-start',
                  }}
                >
                  <button
                    onClick={handleCloseView}
                    style={{
                      width: '42px',
                      height: '42px',
                      background: '#000',
                      color: '#76ABAE',
                      border: '2px solid #76ABAE',
                      fontSize: '14px',
                      cursor: 'pointer',
                      outline: 'none',
                      borderRadius: 0,
                      display: showInfo ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 11,
                    }}
                  >
                    ✕ Back
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    zIndex: 9,
                    width: '80%',
                  }}
                >
                  <button
                    onClick={handleCloseView}
                    style={{
                      width: '42px',
                      height: '42px',
                      background: '#000',
                      color: '#76ABAE',
                      border: '2px solid #76ABAE',
                      fontSize: '14px',
                      cursor: 'pointer',
                      outline: 'none',
                      borderRadius: 0,
                      display: showInfo ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 11,
                    }}
                  >
                    ✕ Back
                  </button>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <CustomSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
                  </div>
                </div>
              )
            ) : (
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: showInfo ? 'none' : 'flex',
                  height: '42px',
                  gap: '0.5rem',
                  zIndex: 9,
                }}
              >
                <button
                  onClick={handleComputerClick}
                  className="noFocus"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#000',
                    color: '#76ABAE',
                    border: '2px solid #76ABAE',
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderRadius: 0,
                  }}
                >
                  Computer
                </button>
                <button
                  onClick={handleRightClick}
                  className="noFocus"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#000',
                    color: '#76ABAE',
                    border: '2px solid #76ABAE',
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderRadius: 0,
                  }}
                >
                  Bookshelf
                </button>
                <button
                  onClick={handleLeftClick}
                  className="noFocus"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#000',
                    color: '#76ABAE',
                    border: '2px solid #76ABAE',
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderRadius: 0,
                  }}
                >
                  Gallery
                </button>
              </div>
            )}
          </div>
        )}

        {/* Conditionally render based on the current route */}
        {location.pathname === '/desktop' ? (
          // Directly render the Desktop component for /desktop (auto‑logged in)
          <Desktop time={new Date()} onLogout={handleCloseComputerOS} />
        ) : (
          // Otherwise, if the overlay is open, render ComputerOS (which shows login if needed)
          isComputerOSOpen && <ComputerOS onClose={handleCloseComputerOS} />
        )}

      </div>
    </ErrorBoundary>
  );
}

export default App;
