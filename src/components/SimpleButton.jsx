import React, { useState } from 'react';

const SimpleButton = ({ children, onClick, style = {} }) => {
  const [active, setActive] = useState(false);

  const baseStyle = {
    type: 'button',
    outline: 'none',
    border: 'none',
    WebkitTapHighlightColor: 'transparent',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.2s ease',
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 0,
  };

  const mergedStyle = {
    ...baseStyle,
    backgroundColor: active ? '#222' : baseStyle.backgroundColor,
    ...style,
  };

  return (
    <button
      type="button"
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      onClick={onClick}
      style={mergedStyle}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
