import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

function InfoOverlay({ showInfo, progress, setShowInfo }) {
  const markdownContent = `
  ![me](/me.png)
  <h2 style="text-align: center;">Brad Jackson</h2>
  Software Architect, Computer Systems Engineer, & Cybersecurity Specialist with 7 years of experience dominating the tech scene with, scalable, cost-saving cloud and automation solutions.  

  This project was built using the following technologies:
  - **React (JS)** for the frontend
  - **Three.js** for the 3D scene
  - **React Three Fiber** for the Three.js bindings
  - **React Markdown** for the info overlay
  - **Vite** for the build tool
  - **Google Cloud Platform App Engine** for deployment  

  ## Quick Links
  [💻 GitHub](https://github.com/iron-hope-shop)  
  [🔗 LinkedIn](https://www.linkedin.com/in/bradley-jackson-a73a92191/)  
  [📧 Email](mailto:me@brad-jackson.com)  
  [📄 Resume](https://raw.githubusercontent.com/iron-hope-shop/iron-hope-shop/refs/heads/main/resumes/jackson_brad_resume_02_18_2025.pdf)  

  ## Scene Navigation
  - Use the fixed view buttons to change camera perspectives.
  - _**Mouse**_ over objects (desktop) to see short descriptions.
  - _**Touch objects**_ (mobile) to see short descriptions.
  - Use the slider to pan left and right when viewing the _**Bookshelf**_ or _**Gallery**_.
  - Navigate to the _**Computer**_ view to see in-depth details about my projects.
  
  ## About Me
  - Currently: Founder, CEO & CTO at Bharo, LLC - leading projects like a loan tracking app.
  - Previously: Senior Cybersecurity Engineer at Walmart Global Tech, where I leveraged machine learning, automation, and microservices to drive innovative security solutions.
  - Certifications: GIAC OSINT, GIAC GWEB, Security+, plus specialized training in Nutanix, Python, and more.

  <!-- Check out my [GitHub repositories](https://github.com/iron-hope-shop) for more projects, code samples, and the source code for this frontend.  -->
  
  <br/>
  
  ---

  © 2025 Brad Jackson  

`;

  return (
    <div
      style={{
        position: 'absolute',
        overflowY: 'auto',
        top: showInfo ? '0px' : '-2000px',
        left: 0,
        right: 0,
        background: showInfo ? 'rgba(0,0,0,0.9)' : '',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        transition: 'top 0.3s ease',
        fontSize: '0.9rem',
        zIndex: 11,
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          textAlign: 'left',
          maxWidth: '600px',
          marginBottom: '4rem', // extra margin to avoid overlap with the button
        }}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            ul: ({ children }) => (
              <ul style={{ paddingLeft: '1.2em', margin: '0.5em 0' }}>
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: '0.4em' }}>{children}</li>
            ),
            a: ({ node, ...props }) => {
              // Force PDF links to open in a new tab.
              const isPdf = props.href.endsWith('.pdf');
              const isExternal = props.href.startsWith('http') || isPdf;
              return (
                <a
                  {...props}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                />
              );
            },
            img: ({ node, ...props }) => (
              <div style={{ textAlign: 'center' }}>
                <img {...props} style={{ width: '128px', borderRadius: 100, border: '1px solid white' }} />
              </div>
            ),
            div: ({ node, ...props }) => (
              <div {...props} />
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default InfoOverlay;