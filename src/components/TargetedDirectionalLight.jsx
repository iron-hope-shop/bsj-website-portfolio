import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const TargetedDirectionalLight = ({ target = [0, 1, 0], ...props }) => {
  const lightRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (lightRef.current) {
      // Set the target's position and add it to the scene.
      lightRef.current.target.position.set(...target);
      scene.add(lightRef.current.target);
    }
  }, [scene, target]);

  return <directionalLight ref={lightRef} {...props} />;
};

export default TargetedDirectionalLight;
