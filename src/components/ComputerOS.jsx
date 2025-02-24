import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import LoginOverlay from './LoginOverlay';
import Desktop from './Desktop';

const ComputerOS = ({ onClose, autoLogin }) => {
  const [time, setTime] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update clock every second.
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate OS overlay.
  useEffect(() => {
    gsap.fromTo(
      '.computer-os',
      { scale: 0 },
      { scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  // Auto-login effect: if autoLogin is true, mark as logged in immediately.
  useEffect(() => {
    if (autoLogin) {
      setIsLoggedIn(true);
    }
  }, [autoLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '12345') {
      setIsLoggedIn(true);
      // Update the route so that the URL becomes copyable.
      navigate('/desktop');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Desktop time={time} onLogout={onClose} />
      ) : (
        <LoginOverlay
          time={time}
          password={password}
          setPassword={setPassword}
          error={error}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ComputerOS;
