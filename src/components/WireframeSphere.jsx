import React from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Custom shader material that computes the gradient using vertex y-position
const GradientWireframeMaterial = shaderMaterial(
  {
    // colorTop: new THREE.Color('#640D5F'),    // Purple at the top
    colorBottom: new THREE.Color('#FFB200'),   // Retro pink/orange at the bottom
    radius: 1000.0,                           // Sphere radius for normalizing y values
  },
  // Vertex Shader: Pass the y coordinate to the fragment shader.
  `
    varying float vY;
    void main() {
      vY = position.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader: Compute a gradient using a smoothstep for a sharper transition around the equator.
  `
    uniform vec3 colorTop;
    uniform vec3 colorBottom;
    uniform float radius;
    varying float vY;
    void main() {
      // Normalize y from [-radius, radius] to [0,1]
      float t = (vY + radius) / (2.0 * radius);
      // Use smoothstep to create a more drastic gradient between t=0.4 and t=0.6
      float gradientFactor = smoothstep(0.3, 0.7, t);
      vec3 color = mix(colorBottom, colorTop, gradientFactor);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ GradientWireframeMaterial });

const WireframeSphere = () => (
  // Inverting the sphere on the X-axis if you're using it as a sky dome.
  <mesh scale={[-1, 1, 1]}>
    {/* Increase subdivisions to add more wireframe lines */}
    <sphereGeometry args={[1000, 1000, 1000]} />
    <gradientWireframeMaterial wireframe={true} />
  </mesh>
);

export default WireframeSphere;
