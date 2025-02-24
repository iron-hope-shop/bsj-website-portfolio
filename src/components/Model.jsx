import React, { useEffect, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import * as THREE from 'three';
import { useIsMobileDevice } from './useIsMobileDevice.jsx';

const Model = ({
  cameraRef,
  onComputerScreenClick,
  isComputerView,
  isComputerOSOpen,
  setShowDesktopTime,
  showDesktopTime,
  setTooltip, // callback to update tooltip text in App
  showInfo,
  hideOverlays
}) => {
  const { scene } = useGLTF('/postscene.gltf');
  const [screenData, setScreenData] = useState(null);
  const [time, setTime] = useState(new Date());
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);

  // Strict mobile check using matchMedia
  const isMobile = useIsMobileDevice();


  // Traverse the scene for tooltips and screenData, etc.
  useEffect(() => {
    scene.traverse((child) => {
      // Disable raycasting for the object named "Home"
      if (child.name === 'Home') {
        child.raycast = () => { };
      }
      // Set up the computer screen ("Home043")
      if (child.name === 'Home043') {
        const box = new Box3().setFromObject(child);
        const center = new Vector3();
        box.getCenter(center);
        setScreenData({
          position: center,
          size: [box.max.x - box.min.x, box.max.y - box.min.y],
          object: child,
        });
      }
      // Assign tooltips for interactive objects.
      if (child.isMesh) {
        child.userData = child.userData || {};
        child.userData.tooltip = getTooltipForName(child.name);
      }
      // Update materials for consistent rendering.
      if (child.isMesh && child.material) {
        const updateMaterial = (mat) => {
          mat.side = THREE.DoubleSide;
          mat.depthTest = true;
          mat.depthWrite = true;
          mat.needsUpdate = true;
        };
        if (Array.isArray(child.material)) {
          child.material.forEach(updateMaterial);
        } else {
          updateMaterial(child.material);
        }
      }
    });
  }, [scene]);

  const getTooltipForName = (name) => {
    const tooltips = {
      Home025: 'Good to Great by Jim Collins. This book demonstrates how continuous, well-informed decision-making can transform an organization from merely good to truly great. The examples highlight how sustained excellence and disciplined leadership pave the way for outstanding performance.',
      Home026: 'The Attention Merchants by Tim Wu. Wu\'s work reveals how the competition for our attention exploits our predictable behaviors, showing that our focus is a prized commodity in today\'s media landscape. The narrative prompts us to reflect on how competition shapes the way our attention is captured and used.',
      Home027: 'Needful Things by Stephen King. In this novel, King vividly uses devil imagery and motifs to underscore the perilous allure of human desire and unchecked greed. The narrative\'s dark symbolism serves as a stark warning about the moral costs of succumbing to our baser impulses.',
      Home028:
        'The Misbehavior of Markets: A Fractal View of Financial Turbulence by Mandelbrot and Hudson. This book challenges conventional economic theories by applying fractal geometry to explain the seemingly chaotic behavior of financial markets.',
      Home029: 'How to Win Friends and Influence People by Dale Carnegie. This classic offers timeless advice on effective communication and relationship-building, emphasizing empathy, active listening, and genuine interest in others as keys to success. Its enduring principles remain relevant in both personal and professional contexts.',
      Home030: 'Faust by Johann Wolfgang von Goethe. Goethe delves into the eternal struggle between good and evil, employing devilish imagery and themes to highlight the allure of unchecked ambition. It challenges us to confront the moral costs of our desires.',
      Home031: 'The Complete Calvin and Hobbes: Book One by Bill Watterson. I was captivated by Calvin and Hobbes because its blend of humor and philosophical musings challenged me to see everyday experiences in a new, imaginative light. The comic strip not only entertained me but also reshaped my thinking by encouraging a playful curiosity about life\'s deeper questions.',
      Home032: 'The Hobbit by J.R.R. Tolkien. This book resonates with me as a celebration of the courage to step outside one\'s comfort zone and embrace the unknown. Its narrative of unexpected challenges and personal growth continues to inspire my own journey toward discovering hidden strengths.',
      Home080: 'A strange fossilized creature. It appears to be a crocodile with wings. For fun: https://crocoducks.com',
      Home079: 'A print of Waterfall (1961) by M.C. Escher. The interplay between structure and illusion, optical trickery and mathematical construction, reminds me of the abstractions that simplify the complexities of software architecture.',
      Home078:
        'Bradley Shawn Jackson has been awarded a Bachelor of Science in Computer Science, Summa Cum Laude, by Southern New Hampshire University on August 1, 2024, in recognition of fulfilling all requirements with honors and privileges.',
      Home077: 'Google Cloud Platform is what I use for all of my applications (including this one). I have 7 years of professional experience with GCP and VPCs as well. I am highly skilled in cloud architecture, IAM, and web application security.',
      Home076: 'A frame with two certifications: The GIAC Open Source Intelligence (GOSI) certification confirms that practitioners have a strong foundation in OSINT methodologies and frameworks and are well-versed in data collection, reporting, and analyzing targets. The GIAC Web Application Defender (GWEB) certification allows candidates to demonstrate mastery of the security knowledge and skills needed to deal with common web application errors that lead to most security problems. GWEB candidates have the knowledge, skills, and abilities to secure web applications and recognize and mitigate security weaknesses in existing web applications.',
      Home075: 'A movie poster for Disney\'s TRON (1982). Tron is depicted as a security program designed to protect the digital realm.',
      Home074: '"WELCOME TO TEXAS NOW GO HOME"',
      Home073: 'A banner with the Octocat logo. I have been using GitHub for 10 years and have a deep understanding of Git and version control.',
      Home072: 'Hackers (1995) is a movie about a group of young hackers who are framed for a cybercrime they did not commit. It is a cult classic and has inspired many to pursue careers in cybersecurity.',
      Home071: 'Murphy\'s Laws are a collection of aphorisms with the motif that if anything can go wrong, it inevitably will. With such phrases as, "In order to get a loan, you must first prove you don\'t need it" or, "Never argue with a fool, people might not know the difference," Murphy\'s Laws are a reminder that life is unpredictable.',
      Home070: 'A comic panel from Calvin and Hobbes by Bill Watterson. In the image, Calvin sits alone and says, "Given the pace of technology, I propose we leave math to the machines and go play outside." Technology is a tool and not a replacement for human experience.',
      Home069: 'The logo for the Python Software Foundation. I have been using Python for over 7 years professionally and have a deep understanding of the language, the standard library, and popular packages. I use Python to create performance-enhancing scripts almost daily. I also use Python for data analysis, machine learning, and web development.',
      Home089: 'Nothing interesting here...',
      Home087: 'I love lamp.',
      Home088: 'I love lamp.',
      Home085: 'I love lamp.',
      Home086: 'I love lamp.',
      Home083: 'A precious succulent named "Spike".',
      Home082: "Spike's fragile home.",
      Home111: 'PASSWORD: 12345',
      Home110: 'Click the screen!',
      Home051: 'A hard-looking pillow.',
      Home050: 'A hard-looking pillow.',
      Home048:
        'If you make your bed every morning, you will have accomplished the first task of the day.',
      Home068: "It's locked.",
      Home095: "It's locked.",
      Home096: "It's locked.",
      Home097: "It's locked.",
      Home098: "It's locked.",
      Home052: "It's locked.",
      Home091: "It's locked.",
      Home092: "It's locked.",
      Home093: "It's locked.",
      Home094: "It's locked.",
      Home053: 'A simple chair.',
      Home054: 'A simple chair.',
      Home055: 'A simple chair.',
      Home056: 'A simple chair.',
      Home057: 'A simple chair.',
      Home058: 'A simple chair.',
      Home033: 'A rickety desk from Amazon.',
      Home034: 'A rickety desk from Amazon.',
      Home035: 'A rickety desk from Amazon.',
      // Home036: 'A rickety desk from Amazon.',
      Home037: 'A rickety desk from Amazon.',
      Home038: 'A rickety desk from Amazon.',
      Home039: 'A rickety desk from Amazon.',
      Home040: 'A rickety desk from Amazon.',
      Home041: 'A rickety desk from Amazon.',
      Home044: 'A keyboard with no keys. Useful.',
      Home045: 'AAH@! A MOUSE!',
      Home059: 'This rug really ties the room together, man.',
    };
    return tooltips[name] || null;
  };

  // Update the clock every second.
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);


  // Handlers for pointer events and clicks.
  const handleClick = (event) => {
    const clickedObject = event.object;
    console.log('Clicked object id:', clickedObject.id);

    // If the clicked object is Home043, run existing computer screen logic.
    if (
      clickedObject.name === 'Home043' &&
      isComputerView &&
      onComputerScreenClick
    ) {
      onComputerScreenClick(screenData);
    }
    // If the clicked object has a tooltip (i.e. is in our tooltips list), open the overlay.
    else if (clickedObject.userData && clickedObject.userData.tooltip) {
      setOverlayVisible(true);
      setOverlayContent(clickedObject.userData.tooltip);
      // setShowDesktopTime(false);
    } else {
      setTooltip('');
    }
  };

  const handleTouch = (event) => {
    if (event.pointerType !== 'touch') return;
    const obj = event.object;
    if (obj.name === 'Home043' && isComputerView && onComputerScreenClick) {
      onComputerScreenClick(screenData);
    } else if (obj.userData && obj.userData.tooltip) {
      setTooltip((prev) =>
        prev === obj.userData.tooltip ? '' : obj.userData.tooltip
      );
    } else {
      setTooltip('');
    }
  };

  const handlePointerOver = (event) => {
    if (event.pointerType === 'touch') return;
    const obj = event.object;
    if (obj.userData && obj.userData.tooltip) {
      setTooltip(obj.userData.tooltip);
    }
  };

  const handlePointerOut = () => setTooltip('');

  return (
    <>
      <primitive
        object={scene}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') {
            handleTouch(e);
          } else {
            handleClick(e);
          }
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={(e) => {
          if (!e.intersections.length || !e.object.userData?.tooltip) {
            setTooltip('');
          }
        }}
      />

      {/* Existing computer screen overlay */}
      {!isComputerOSOpen && screenData && showDesktopTime && !hideOverlays && (
        <Html
          transform
          position={[
            screenData.position.x,
            screenData.position.y + (isMobile ? 0.75 : 0.03),
            screenData.position.z + 0.01,
          ]}
          center
          distanceFactor={1.2}
          style={{
            pointerEvents: isComputerView ? 'auto' : 'none',
            zIndex: 10,
            display: !showInfo ? 'block' : 'none',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (isComputerView && onComputerScreenClick) {
                onComputerScreenClick(screenData);
              }
            }}
            style={{
              color: 'white',
              width: '150px',
              height: '70px',
              textAlign: 'center',
              fontFamily: 'monospace',
              background: 'transparent',
              border: 'none',
              cursor: isComputerView ? 'pointer' : 'default',
              userSelect: 'none',
              display: showDesktopTime ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Lato',
                fontWeight: '400',
                textAlign: 'center',
                marginTop: isMobile ? '210px' : '-16px',
              }}
            >
              <div style={{ fontSize: '.4rem' }}>
                {time.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div style={{ fontSize: '1.2rem' }}>
                {time.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export default Model;
