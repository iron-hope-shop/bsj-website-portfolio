import React, { useState, useEffect, useRef } from 'react';
import SimpleButton from './SimpleButton';
import StartMenu from './StartMenu';

const Taskbar = ({
  time,
  onLogout,
  onLogin,
  openWindows,
  onWindowToggle,
  clearOpenWindows,
  startMenuLinks,
}) => {
  const formattedTime = time.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const [menuOpen, setMenuOpen] = useState(false);

  // Create refs for the StartMenu container and a wrapping container for the menu button.
  const menuRef = useRef(null);
  const menuButtonContainerRef = useRef(null);

  // Close the start menu when clicking outside of both the menu and the button.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonContainerRef.current &&
        !menuButtonContainerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Utility to truncate window names.
  const truncate = (str, maxLength) =>
    str.length > maxLength ? str.substring(0, maxLength) + '…' : str;

  const taskbarStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 'calc(40px + env(safe-area-inset-bottom))',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
    boxSizing: 'border-box',
    zIndex: 100,
  };

  // Left container is scrollable horizontally.
  const taskbarLeftContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    WebkitOverflowScrolling: 'touch',
    flexGrow: 1,
    minWidth: 0,
    position: 'relative',
    marginLeft: '40px', // Adjust margin to account for fixed menu button
  };

  const taskbarWindowsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const taskbarWindowButtonStyle = {
    padding: '4px 8px',
    maxWidth: '80px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const taskbarRightStyle = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    gap: '10px',
    flexShrink: 0,
  };

  const menuButtonStyle = {
    padding: '4px 8px',
  };

  return (
    <div style={taskbarStyle}>
      {/* Wrap the menu button in a div that has its own ref */}
      <div ref={menuButtonContainerRef} style={{ position: 'absolute', left: '10px' }}>
        <SimpleButton style={menuButtonStyle} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </SimpleButton>
      </div>
      {menuOpen && (
        <div ref={menuRef}>
          <StartMenu
            onLogout={onLogout}
            onLogin={onLogin}
            links={startMenuLinks}
            clearOpenWindows={
              clearOpenWindows
                ? () => {
                    clearOpenWindows();
                    setMenuOpen(false);
                  }
                : undefined
            }
          />
        </div>
      )}
      <div style={taskbarLeftContainerStyle}>
        <div style={taskbarWindowsStyle}>
          {openWindows.map((win) => (
            <SimpleButton
              key={win.id}
              style={taskbarWindowButtonStyle}
              onClick={() => onWindowToggle(win.id)}
              title={win.name}
            >
              {win.name}
            </SimpleButton>
          ))}
        </div>
      </div>
      <div style={taskbarRightStyle}>
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};

export default Taskbar;
