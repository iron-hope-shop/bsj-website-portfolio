import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleButton from './SimpleButton';

const StartMenu = ({ onLogout, onLogin, links = [], clearOpenWindows }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/computer');
  };

  // Position the start menu fixed relative to the viewport,
  // anchored at the bottom-left above the taskbar.
  const startMenuStyle = {
    position: 'fixed',
    bottom: 'calc(40px + env(safe-area-inset-bottom))',
    left: 0,
    width: '180px',
    backgroundColor: '#222',
    border: '1px solid #444',
    borderRadius: 0,
    boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
    zIndex: 150,
  };

  const menuItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #444',
    color: '#fff',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
  };

  return (
    <div style={startMenuStyle}>
      {onLogin && <div style={menuItemStyle} onClick={onLogin}>Login</div>}
      {clearOpenWindows && (
        <div style={menuItemStyle} onClick={clearOpenWindows}>
          Clear All Windows
        </div>
      )}
      {onLogout && <div style={menuItemStyle} onClick={handleLogout}>Logout</div>}
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...menuItemStyle, textDecoration: 'none', color: '#fff' }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default StartMenu;
