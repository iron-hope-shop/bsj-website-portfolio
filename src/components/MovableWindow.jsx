import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

// Global variable for z-index management.
let highestZIndex = 1;

// Utility to truncate a string.
const truncate = (str, maxLength) =>
  str.length > maxLength ? str.substring(0, maxLength) + '…' : str;

// Sanitize title to a valid CSS class name.
const sanitizeClassName = (title) => {
  return (
    'movable-window-' +
    title.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')
  );
};

const MovableWindow = ({
  title,
  icon,
  onClose,
  onMinimize,
  minimized,
  children,
  defaultSize,
}) => {
  const safeClassName = sanitizeClassName(title);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // --- Common Styles ---
  const windowStyleBase = {
    position: 'absolute',
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #444',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };

  const windowHeaderStyle = {
    backgroundColor: '#111',
    color: '#fff',
    padding: '4px 8px',
    cursor: 'move',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    minHeight: '32px',
  };

  const windowHeaderLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const windowLogoStyle = {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  };

  const windowTitleStyle = {
    fontSize: '1rem',
    whiteSpace: 'nowrap',
  };

  const windowButtonStyle = {
    background: '#222',
    color: '#000',
    border: '1px solid #444',
    borderRadius: '0',
    padding: '3px 8px',
    cursor: 'pointer',
    marginLeft: '8px',
    fontSize: '0.8rem',
  };

  const windowContentStyle = {
    flex: 1,
    // padding: '8px',
    overflow: 'auto',
    boxSizing: 'border-box',
  };

  const resizeHandleStyle = {
    position: 'absolute',
    width: '16px',
    height: '16px',
    bottom: 0,
    right: 0,
    cursor: 'nwse-resize',
    borderTop: '1px solid #444',
    borderLeft: '1px solid #444',
    backgroundColor: 'transparent',
  };

  // --- Mobile Behavior: full-screen (minus taskbar) ---
  if (isMobile) {
    if (minimized) return null;
    return (
      <div
        className={safeClassName}
        style={{
          ...windowStyleBase,
          left: 0,
          top: 0,
          width: '100vw',
          height: 'calc(100vh - 40px)', // adjust for your taskbar height
        }}
      >
        <div style={windowHeaderStyle}>
          <div style={windowHeaderLeftStyle}>
            {icon && <img src={icon} alt="logo" style={windowLogoStyle} />}
            <span style={windowTitleStyle}>{title}</span>
          </div>
          <div>
            <button
              style={{ ...windowButtonStyle, backgroundColor: 'rgb(254, 188, 46)' }}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            >
              &mdash;
            </button>
            <button
              style={{ ...windowButtonStyle, backgroundColor: 'rgb(254, 95, 87)' }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              ✕
            </button>
          </div>
        </div>
        <div style={windowContentStyle}>{children}</div>
      </div>
    );
  }

  // --- Desktop Behavior: draggable, resizable, etc. ---
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState(defaultSize || { width: 500, height: 450 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
  });

  // Maximize/restore
  const [maximized, setMaximized] = useState(false);
  const [prevState, setPrevState] = useState({ position: null, size: null });

  // --- z-index state ---
  const [zIndex, setZIndex] = useState(++highestZIndex);

  const bringToFront = () => {
    highestZIndex++;
    setZIndex(highestZIndex);
  };

  const handleMouseDown = (e) => {
    bringToFront();
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    bringToFront();
    setResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    const handleResizeMouseMove = (e) => {
      if (resizing) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        const newWidth = Math.max(150, resizeStart.width + dx);
        const newHeight = Math.max(100, resizeStart.height + dy);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleResizeMouseUp = () => {
      if (resizing) setResizing(false);
    };

    if (resizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
    } else {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [resizing, resizeStart]);

  const toggleMaximize = () => {
    if (!maximized) {
      setPrevState({ position, size });
      setPosition({ x: 16, y: 16 });
      setSize({
        width: window.innerWidth - 32,
        height: window.innerHeight - 40 - 32,
      });
      setMaximized(true);
    } else {
      if (prevState.position && prevState.size) {
        setPosition(prevState.position);
        setSize(prevState.size);
      }
      setMaximized(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      `.${safeClassName}`,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [safeClassName]);

  if (minimized) return null;

  return (
    <div
      className={safeClassName}
      onMouseDown={bringToFront}
      style={{
        ...windowStyleBase,
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
        minWidth: '300px',
        minHeight: '200px',
      }}
    >
      <div style={windowHeaderStyle} onMouseDown={handleMouseDown}>
        <div style={windowHeaderLeftStyle}>
          {icon && <img src={icon} alt="logo" style={windowLogoStyle} />}
          <span style={windowTitleStyle}>{title}</span>
        </div>
        <div>
          <button
            style={{ ...windowButtonStyle, backgroundColor: 'rgb(254, 188, 46)' }}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            &mdash;
          </button>
          <button
            style={{ ...windowButtonStyle, backgroundColor: 'rgb(40, 200, 64)' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
          >
            {maximized ? '❐' : '❐'}
          </button>
          <button
            style={{ ...windowButtonStyle, backgroundColor: 'rgb(254, 95, 87)' }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={windowContentStyle}>{children}</div>

      <div style={resizeHandleStyle} onMouseDown={handleResizeMouseDown} />
    </div>
  );
};

export default MovableWindow;
