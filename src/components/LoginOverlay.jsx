import React from 'react';

const LoginOverlay = ({ time, password, setPassword, error, onSubmit, onClose }) => {
  const loginOverlayStyle = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 2000,
    backgroundImage: 'url("background.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'Lato, sans-serif',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '42px',
    height: '42px',
    background: 'transparent',
    color: '#000',
    border: '2px solid #000',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  };

  const dateStyle = {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '500',
  };

  const hintStyle = {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '300',
    marginBottom: '16px',
  };

  const timeStyle = {
    marginBottom: '300px',
    fontSize: '5rem',
    fontWeight: '500',
  };

  const loginFormStyle = {
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    // width: '90%',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // padding: '24px',
    // borderRadius: '8px',
    // borderRadius: 0,
  };

  const loginInputStyle = {
    width: '256px',
    padding: '8px 12px',
    fontSize: '16px', // Prevent mobile zoom
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    height: '22px',
    textAlign: 'center',
    marginRight: '8px',
    borderRadius: 0,
  };

  const loginButtonStyle = {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: '#fff',
    height: '42px',
    border: '2px solid rgba(255, 255, 255, .6)',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: 0,
  };

  const errorStyle = { color: 'red', marginTop: '8px' };

  return (
    <div className="computer-os" style={loginOverlayStyle}>
      <button onClick={onClose} style={closeButtonStyle}>
      ✕
      </button>
      <h2 style={dateStyle}>
        {time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
      </h2>
      <h1 style={timeStyle}>
        {time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </h1>
      <h2 style={hintStyle}>
        Password hint: 12345
      </h2>
      <form onSubmit={onSubmit} style={loginFormStyle}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <input
            className="noFocus"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={loginInputStyle}
          />
          <button type="submit"
            className="noFocus"
            style={loginButtonStyle}>
            Login
          </button>
        </div>
        {error && <div style={errorStyle}>{error}</div>}
      </form>
    </div>
  );
};

export default LoginOverlay;
