import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html
      center
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#000',
          padding: '2rem',
          border: '1px solid #76ABAE',
          borderRadius: 0,
          textAlign: 'center',
          color: '#76ABAE',
          minWidth: '300px',
        }}
      >
        <h1 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>Loading</h1>
        <p style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>
          {progress.toFixed(0)}% loaded
        </p>
        <div
          style={{
            width: '100%',
            height: '10px',
            background: '#333',
            border: '1px solid #76ABAE',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#76ABAE',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </Html>
  );
};

export default Loader;
