import React, { useState } from 'react';

const DesktopIcon = React.forwardRef(({ app, openAppWindow, onDragEnd }, ref) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const offsetX = e.clientX - startPos.x;
    const offsetY = e.clientY - startPos.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handlePointerUp = (e) => {
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) {
      if (app.type === 'link') {
        window.open(app.url, '_blank');
      } else {
        openAppWindow(app);
      }
    }
    setDragging(false);
    setDragOffset({ x: 0, y: 0 });
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (onDragEnd) {
      onDragEnd({ x: e.clientX, y: e.clientY });
    }
  };

  const iconStyle = {
    width: '80px',
    height: '80px',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    boxSizing: 'border-box',
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
  };

  const iconImageStyle = {
    width: '32px',
    height: '32px',
    margin: '0 auto 4px',
    display: 'block',
  };

  const iconLabelStyle = {
    fontSize: '14px',
    color: '#fff',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  return (
    <div
      ref={ref}
      style={iconStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img src={app.icon} alt={app.name} style={iconImageStyle} draggable={false} />
      <div style={iconLabelStyle} title={app.name}>
        {app.name}
      </div>
    </div>
  );
});

export default DesktopIcon;
