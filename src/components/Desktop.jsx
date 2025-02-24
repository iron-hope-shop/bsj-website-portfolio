import React, { useState, useEffect, useRef } from 'react';
import DesktopIcon from './DesktopIcon';
import MovableWindow from './MovableWindow';
import Taskbar from './Taskbar';
import Terminal from './Terminal';

const Desktop = ({ time, onLogout }) => {
  // Initial apps on the desktop.
  const initialApps = [
    {
      id: 'app1',
      name: 'GitHub',
      type: 'link',
      url: 'https://github.com/iron-hope-shop',
      icon: 'icons/github.png',
    },
    {
      id: 'app2',
      name: 'Runetick',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Runetick V1</h3>
          <a href="https://runetick.com" target="_blank" rel="noopener noreferrer">
            Visit Runetick.com
          </a>
          <h3>Services</h3>
          <p>
            <a href="https://github.com/iron-hope-shop/runetick-v1-services-portfolio" target="_blank" rel="noopener noreferrer">
              Github Repository
            </a>
          </p>
          <ul>
            <li>
              <strong>Backend:</strong> A Node.js/Express server that ingests live GE data, caches it smartly, and
              leverages Firebase Admin for secure SSO.
            </li>
            <li>
              <strong>Frontend:</strong> A React-based UI using Material-UI and React Query for dynamic charts and trade logs.
            </li>
            <li>
              <strong>Cloud:</strong> Deployed on Google Cloud Run with autoscaling to ensure seamless performance.
            </li>
          </ul>
          <h3>ETL Pipeline</h3>
          <p>
            <a href="https://github.com/iron-hope-shop/runetick-v1-etl-portfolio" target="_blank" rel="noopener noreferrer">
              Github Repository
            </a>
          </p>
          <ul>
            <li>Extracts data from RuneScape Wiki APIs and RSS feeds.</li>
            <li>Transforms data into structured Parquet files using Python, Pandas, and PyArrow.</li>
            <li>Loads the processed data into Google Cloud Storage, orchestrated by Cloud Scheduler.</li>
          </ul>
        </div>
      ),
      icon: 'icons/runetick.png',
    },
    {
      id: 'app3',
      name: 'Big ORD Search',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Big Open Reaction Database Search (BORDS)</h3>
          <a href="https://bordsearch.com" target="_blank" rel="noopener noreferrer">
            Explore BORDS
          </a>
          <p>
            Empowering chemical research with high-speed access to millions of reactions from the Open Reaction Database.
          </p>
          <a href="https://github.com/iron-hope-shop/runetick-v1-services-portfolio" target="_blank" rel="noopener noreferrer">
            Github Repository
          </a>
          <ul>
            <li>
              <strong>Tech Stack:</strong> GCP, Elastic Enterprise App Search, React, Python, and Firestore.
            </li>
            <li>
              <strong>Features:</strong> Instantaneous search with rich metadata and dynamic molecule visualization.
            </li>
          </ul>
        </div>
      ),
      icon: 'icons/bords.png',
    },
    {
      id: 'app4',
      name: 'Degree Reflection',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Degree Program Final Reflection</h3>
          <p>
            I attended Southern New Hampshire University, graduating Summa Cum Laude. This is comprehensive reflection on academic and professional growth throughout a rigorous computer science program.
          </p>
          <a href="https://github.com/iron-hope-shop/degree-program-portfolio" target="_blank" rel="noopener noreferrer">
            Github Repository
          </a>
          <ul>
            <li>
              <strong>Key Learnings:</strong> Data Structures, Software Security, and Full Stack Development.
            </li>
            <li>
              <strong>Takeaways:</strong> Emphasis on interdisciplinary integration, secure coding practices, and continuous learning.
            </li>
            <li>
              <strong>Future Trends:</strong> AI/ML, edge computing, cybersecurity, and quantum computing.
            </li>
          </ul>
        </div>
      ),
      icon: 'icons/aplus.png',
    },
    {
      id: 'app5',
      name: 'About me',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Brad Jackson - Profile</h3>
          <p>
            Software Architect and Computer Systems Engineer passionate about scalable cloud solutions,
            cybersecurity, and automation. I have 7 years of professional engineering experience.
          </p>
          <ul>
            <li>Founder, CEO &amp; CTO at Bharo, LLC</li>
            <li>Former roles at Walmart Global Tech</li>
            <li>B.Sc. in Computer Science, Summa Cum Laude</li>
          </ul>
          <p>
            Thanks for visiting my portfolio! Feel free to explore the projects and links on this desktop.
          </p>
        </div>
      ),
      icon: 'icons/about.png',
    },
    {
      id: 'app-resume',
      name: 'Resume',
      type: 'link',
      url: 'https://raw.githubusercontent.com/iron-hope-shop/iron-hope-shop/refs/heads/main/resumes/jackson_brad_resume_02_18_2025.pdf',
      icon: 'icons/pdf.png',
    },
    {
      id: 'app7',
      name: 'Crocoduck Projects',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Crocoduck Clicker</h3>
          <a href="https://github.com/iron-hope-shop/crocoduck-clicker-portfolio" target="_blank" rel="noopener noreferrer">
            Github Repository
          </a>
          <p>
            A quirky clicker game that toggles between a duck and a crocodile, featuring encrypted local storage and playful animations.
          </p>
          <br />
          <h3>
            Crocoducks.com{" "}
            <a href="https://crocoducks.com" target="_blank" rel="noopener noreferrer">
              🔗
            </a>
          </h3>
          <a href="https://github.com/iron-hope-shop/crocoduck-site-portfolio/tree/main" target="_blank" rel="noopener noreferrer">
            Github Repository
          </a>
          <p>
            A satirical deep dive into the legendary Crocoduck, blending faux paleontology with humorous historical analysis.
          </p>
        </div>
      ),
      icon: 'icons/crocoduck.png',
    },
    {
      id: 'app8',
      name: 'Discord Bot SSO',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Discord Bot with Firebase SSO</h3>
          <p>
            A feature-rich Discord bot featuring trivia, RuneScape stats, and stock simulations with secure Firebase SSO integration.
          </p>
          <a href="https://github.com/iron-hope-shop/discord-bot-w-sso-portfolio" target="_blank" rel="noopener noreferrer">
            Github Repository
          </a>
          <ul>
            <li>Interactive commands with dynamic embeds.</li>
            <li>Tech: Python, Flask, Firebase, and Cloud Run.</li>
          </ul>
        </div>
      ),
      icon: 'icons/seer.png',
    },
    {
      id: 'app10',
      name: 'Demos',
      type: 'window',
      content: (
        <div style={{ padding: '16px', paddingTop: 0 }}>
          <h3>Demos &amp; UI Components</h3>
          <a href="https://github.com/iron-hope-shop/tool-demos" target="_blank" rel="noopener noreferrer">
            Github Repository
          </a>
          <p>
            A collection of interactive demos and creative loading screen components showcasing real-time animations and dynamic UI elements.
          </p>
          <img src="images/dna.gif" alt="Loading" style={{ height: "200px", margin: 'auto' }} />
          <ul>
            <li>
              <strong>Machine Learning:</strong> COCO Real-Time Object Detection and Bounding Box Labeling.
            </li>
            <li>
              <strong>Loading Screens:</strong> DNA Annealing, Dot Matrix, Test Tube, Three Ball, and Waveforms.
            </li>
          </ul>
        </div>
      ),
      icon: 'images/wave.gif',
    },
  ];

  // State arrays.
  const [activeApps, setActiveApps] = useState(initialApps);
  const [extraApps, setExtraApps] = useState([]);
  const [openWindows, setOpenWindows] = useState([]);
  const [trashWindowOpen, setTrashWindowOpen] = useState(false);

  // Define the Trash icon.
  const trashIcon = {
    id: 'trash',
    name: 'Trash',
    type: 'trash',
    icon: 'icons/trashbin.png',
  };

  // Grid container style.
  const iconGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '16px',
    padding: '64px 16px 16px',
    overflow: 'auto',
    flex: 1,
  };

  // We'll combine activeApps, then the Trash icon, then extraApps.
  const gridApps = [...activeApps, trashIcon, ...extraApps];

  // Ref for the Trash icon element (for drop detection).
  const trashRef = useRef(null);

  // When an app (except Trash) is dropped, if its pointer's center falls within the Trash icon's bounds,
  // remove it from activeApps and add it to trashedApps.
  const handleIconDragEnd = (app, finalPos) => {
    if (app.id === 'trash') return;
    if (trashRef.current) {
      const rect = trashRef.current.getBoundingClientRect();
      // Assume center of an 80x80 icon.
      const center = { x: finalPos.x + 40, y: finalPos.y + 40 };
      if (
        center.x >= rect.left &&
        center.x <= rect.right &&
        center.y >= rect.top &&
        center.y <= rect.bottom
      ) {
        // If the app is a window-type, close its open window (removing it from the taskbar).
        if (app.type === 'window') {
          setOpenWindows((prev) => prev.filter((win) => win.id !== app.id));
        }
        setActiveApps((prev) => {
          const index = prev.findIndex((a) => a.id === app.id);
          const filtered = prev.filter((a) => a.id !== app.id);
          // No special handling for terminal—restore will reinsert it in activeApps.
          setTrashedApps((tprev) => {
            if (tprev.find((a) => a.id === app.id)) return tprev;
            return [...tprev, { ...app, deletedIndex: index }];
          });
          return filtered;
        });
      }
    }
  };

  // Restore an app from Trash.
  // For all apps, reinsert at the saved index if available.
  const restoreApp = (app) => {
    setTrashedApps((prev) => prev.filter((a) => a.id !== app.id));
    setActiveApps((prev) => {
      const index = app.deletedIndex;
      const newApps = [...prev];
      if (index !== null && index >= 0 && index <= newApps.length) {
        newApps.splice(index, 0, app);
      } else {
        newApps.push(app);
      }
      return newApps;
    });
  };

  // Render Trash window content.
  const renderTrashWindowContent = () => {
    const rowStyle = {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    };

    return (
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: '#fff' }}>Trashed Items</h3>
        {trashedApps.length === 0 ? (
          <p style={{ color: '#fff' }}>Trash is empty.</p>
        ) : (
          trashedApps.map((app) => (
            <div key={app.id} style={rowStyle}>
              <img
                src={app.icon}
                alt={app.name}
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
              <span
                style={{
                  marginLeft: '8px',
                  flex: 1,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={app.name}
              >
                {app.name}
              </span>
              <button
                style={{ marginLeft: '16px', borderRadius: 0 }}
                onClick={() => restoreApp(app)}
              >
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    );
  };

  // When opening a window, if the app is Trash, toggle the Trash window; else open an app window.
  const openAppWindow = (app, spawnPosition) => {
    if (app.id === 'trash') {
      setTrashWindowOpen((prev) => !prev);
    } else {
      const existing = openWindows.find((win) => win.id === app.id);
      if (existing) {
        if (existing.minimized) {
          setOpenWindows((prev) =>
            prev.map((win) =>
              win.id === app.id ? { ...win, minimized: false } : win
            )
          );
        }
      } else {
        let candidatePosition = spawnPosition || { x: 100, y: 100 };
        while (
          openWindows.some(
            (win) =>
              win.defaultPosition &&
              win.defaultPosition.x === candidatePosition.x &&
              win.defaultPosition.y === candidatePosition.y
          )
        ) {
          candidatePosition = { x: candidatePosition.x + 40, y: candidatePosition.y + 40 };
        }
        const newWindow = {
          ...app,
          minimized: false,
          defaultSize: app.defaultSize,
          defaultPosition: candidatePosition,
        };
        setOpenWindows((prev) => [...prev, newWindow]);
      }
    }
  };

  // Terminal app definition.
  const terminalApp = {
    id: 'terminal',
    name: 'Terminal (Unstable)',
    type: 'window',
    content: (
      <Terminal
        items={[...activeApps, ...extraApps]}
        openApp={openAppWindow}
      />
    ),
    icon: 'icons/terminal.png',
    defaultSize: { width: 500, height: 300 },
  };

  // Initialize trashedApps with Terminal also in Trash if needed.
  const [trashedApps, setTrashedApps] = useState([{ ...terminalApp, deletedIndex: null }]);

  const closeAppWindow = (id) => {
    setOpenWindows((prev) => prev.filter((win) => win.id !== id));
    if (id === 'trashWindow') {
      setTrashWindowOpen(false);
    }
  };

  const toggleMinimizeWindow = (id) => {
    setOpenWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, minimized: !win.minimized } : win
      )
    );
  };

  const clearOpenWindows = () => {
    setOpenWindows([]);
    setTrashWindowOpen(false);
  };

  // Main container style.
  const desktopContainerStyle = {
    userSelect: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 10000,
    backgroundColor: '#1e1e1e',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={desktopContainerStyle}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={iconGridStyle}>
          {gridApps.map((app) => (
            <DesktopIcon
              key={app.id}
              app={app}
              openAppWindow={openAppWindow}
              onDragEnd={
                app.id !== 'trash'
                  ? (finalPos) => handleIconDragEnd(app, finalPos)
                  : undefined
              }
              ref={app.id === 'trash' ? trashRef : null}
            />
          ))}
        </div>

        {/* Render open windows */}
        {openWindows.map((win) => (
          <MovableWindow
            key={win.id}
            title={win.name}
            icon={win.icon}
            minimized={win.minimized}
            onMinimize={() => toggleMinimizeWindow(win.id)}
            onClose={() => closeAppWindow(win.id)}
            defaultSize={win.defaultSize}
            defaultPosition={win.defaultPosition}
          >
            {win.content}
          </MovableWindow>
        ))}

        {/* Render Trash window if open */}
        {trashWindowOpen && (
          <MovableWindow
            key="trashWindow"
            title="Trash"
            icon={trashIcon.icon}
            minimized={false}
            onMinimize={() => { }}
            onClose={() => setTrashWindowOpen(false)}
            defaultPosition={{ x: 100, y: 100 }}
          >
            {renderTrashWindowContent()}
          </MovableWindow>
        )}
      </div>
      <Taskbar
        time={time}
        onLogout={onLogout}
        openWindows={openWindows}
        onWindowToggle={toggleMinimizeWindow}
        clearOpenWindows={clearOpenWindows}
      />
    </div>
  );
};

export default Desktop;
