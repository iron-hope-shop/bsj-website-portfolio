import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const RetroSky = () => {
  const { scene } = useThree();

  useEffect(() => {
    // Create a large sphere geometry that encloses the scene.
    const geometry = new THREE.SphereGeometry(1000, 32, 15);
    geometry.scale(-1, 1, 1); // Invert the sphere to view from inside

    // Create a custom ShaderMaterial for a vertical gradient.
    const material = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color('#000000') }, // black at the top
        bottomColor: { value: new THREE.Color('#4B0082') }, // retro indigo near the horizon
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    const skyMesh = new THREE.Mesh(geometry, material);
    scene.add(skyMesh);

    // Clean up on unmount
    return () => {
      geometry.dispose();
      material.dispose();
      scene.remove(skyMesh);
    };
  }, [scene]);

  return null;
};

export default RetroSky;
