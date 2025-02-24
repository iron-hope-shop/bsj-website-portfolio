import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraUpdater = ({ cameraRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera, cameraRef]);

  return null;
};

export default CameraUpdater;
