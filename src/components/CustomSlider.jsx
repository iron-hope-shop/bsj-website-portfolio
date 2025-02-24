import React, { useRef, useEffect, useCallback } from 'react';

function CustomSlider({ sliderValue, setSliderValue }) {
  const sliderRef = useRef(null);

  // Update the slider value based on the x-coordinate relative to the slider element.
  const updateValue = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let relativeX = clientX - rect.left;
    relativeX = Math.max(0, Math.min(rect.width, relativeX));
    const percentage = relativeX / rect.width;
    // Map percentage [0,1] to slider range [-0.1, 0.1]
    const newValue = -0.1 + percentage * 0.2;
    setSliderValue(newValue);
  };

  // --- Drag Handlers ---
  const handleMouseDown = (e) => {
    updateValue(e.clientX);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    updateValue(e.touches[0].clientX);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    updateValue(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  // --- Scroll Wheel Handler ---
  const handleWheel = useCallback((e) => {
    // Prevent default scroll behavior
    e.preventDefault();
    const sensitivity = 0.001; // Adjust as needed for speed
    const delta = e.deltaY;
    setSliderValue(prev => Math.max(-0.1, Math.min(0.1, prev + delta * sensitivity)));
  }, [setSliderValue]);

  // Attach global wheel event listener when component is mounted.
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Calculate the horizontal position of the slider handle.
  const handleLeftPosition = `${((sliderValue + 0.1) / 0.2) * 100}%`;

  // Responsive width for mobile devices.
  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 500px)').matches;

  return (
    <div
      ref={sliderRef}
      style={{
        position: 'relative',
        marginLeft: '16px',
        width: isMobile ? '90%' : '100%',
        height: '40px',
      }}
    >
      {/* Slider track */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '4px',
          background: '#76ABAE',
          transform: 'translateY(-50%)',
        }}
      />
      {/* Draggable slider handle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: handleLeftPosition,
          transform: 'translate(-50%, -50%)',
          width: '38px',
          height: '38px',
          background: '#000',
          border: '2px solid #76ABAE',
          color: '#76ABAE',
          display: 'flex',
          fontSize: '14px',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        Pan
      </div>
    </div>
  );
}

export default CustomSlider;
