import React, { useState, useEffect, useRef } from 'react';

// --- Virtual Filesystem Definition ---
// This filesystem simulates a container deployment with an "app" folder, "logs", "bin", and a hidden file.
// You can extend these objects with real attributes if desired.
const fileSystem = {
  '/': {
    type: 'dir',
    children: {
      'app': {
        type: 'dir',
        children: {
          'main.py': { 
            type: 'file', 
            content: 'print("Hello, World!")\n# App started...\n' 
          },
          'requirements.txt': { 
            type: 'file', 
            content: 'Flask\nSQLAlchemy\n' 
          },
          'Dockerfile': { 
            type: 'file', 
            content: 'FROM python:3.8-slim\nCOPY . /app\nCMD ["python", "main.py"]\n' 
          },
        },
      },
      'logs': {
        type: 'dir',
        children: {
          'app.log': { 
            type: 'file', 
            content: 'WARNING: Suspicious behavior detected...\nMalicious module loaded: ominous_malware\n' 
          },
        },
      },
      'bin': {
        type: 'dir',
        children: {
          'vi': { 
            type: 'file', 
            content: 'read-only: vi editor (system file)' 
          },
        },
      },
      '.malicious': {
        type: 'file',
        content: 'malware payload: evil.exe executed\n',
      },
    },
  },
};

// --- Utility Functions ---
// resolvePath: given a (possibly relative) path and current directory, returns the corresponding node.
function resolvePath(path, currentDir) {
  const parts = path.startsWith('/')
    ? path.split('/').filter(Boolean)
    : currentDir.split('/').filter(Boolean).concat(path.split('/').filter(Boolean));
  let node = fileSystem['/'];
  for (let part of parts) {
    if (!node.children || !node.children[part]) {
      return null;
    }
    node = node.children[part];
  }
  return node;
}
// getPathString: returns the absolute path string from the currentPath.
function getPathString(currentPath) {
  return currentPath === '' ? '/' : '/' + currentPath;
}

const Terminal = () => {
  // --- Editor Mode State ---
  const [editor, setEditor] = useState({
    active: false,
    filename: '',
    content: '',
  });
  
  // --- Terminal State ---
  const [output, setOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  
  // Dynamic prompt based on current path and storyline.
  const prompt = `root@ominous_container:${getPathString(currentPath)}$ `;
  
  // --- Refs for auto-scrolling and focus ---
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const editorInputRef = useRef(null);
  
  // --- Story Banner ---
  const bannerLines = [
    "==============[Work in Progress]==============",
    "      Connecting to docker container",
    "      'ominous_container' ...",
    "      Establishing secure session...",
    "      WARNING: Unusual activity detected!",
    "      Welcome, Agent. Your mission awaits.",
    "==============================================",
  ];
  
  useEffect(() => {
    inputRef.current.focus();
    setOutput(bannerLines);
  }, []);
  
  // Auto-scroll whenever output (or editor state) updates.
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output, editor]);
  
  // --- Command Handling ---
  const handleCommand = (cmd) => {
    const newOutput = [];
    if (cmd.trim() !== '') {
      newOutput.push(prompt + cmd);
    }
    
    const parts = cmd.trim().split(/\s+/);
    const baseCmd = parts[0] || '';
    const args = parts.slice(1);
    
    if (!baseCmd) return newOutput;
    
    if (baseCmd === 'help') {
      newOutput.push(
        "Available commands:",
        "  ls [-l] [-a] [-r]       List directory contents",
        "  cd <dir>               Change directory",
        "  cat <file>             Display file contents",
        "  vi <file>              Edit file (basic vi simulation)",
        "  docker ps              List running containers",
        "  docker logs            Show container logs",
        "  clear                  Clear the terminal",
        "  help                   Show this help message",
        "",
        "Your mission: Investigate the anomalies in this container."
      );
    } else if (baseCmd === 'clear') {
      return [];
    } else if (baseCmd === 'ls') {
      const flagString = args.filter(arg => arg.startsWith('-')).join('');
      const dirNode = resolvePath(getPathString(currentPath), '');
      if (!dirNode || dirNode.type !== 'dir') {
        newOutput.push("ls: cannot access: Not a directory");
      } else {
        let items = Object.entries(dirNode.children).map(([name, node]) => ({ name, ...node }));
        if (!flagString.includes('a')) {
          items = items.filter(item => !item.name.startsWith('.'));
        }
        if (flagString.includes('r')) {
          items.reverse();
        }
        if (flagString.includes('l')) {
          // For each item, simulate long listing details.
          items.forEach(item => {
            // File type and permissions.
            const perms = item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
            const links = item.type === 'dir' ? 2 : 1;
            const owner = "root";
            const group = "root";
            // For files, use content length as size; for directories, use fixed size.
            const size = item.type === 'dir' ? 4096 : (item.content ? item.content.length : 0);
            const modDate = "Jan 01 00:00"; // You can randomize or simulate different dates if desired.
            newOutput.push(`${perms} ${links} ${owner} ${group} ${size} ${modDate} ${item.name}`);
          });
        } else {
          items.forEach(item => newOutput.push(item.name));
        }
      }
    } else if (baseCmd === 'cd') {
      if (args.length === 0) {
        setCurrentPath('');
      } else {
        const target = args[0];
        let newPath;
        if (target === '..') {
          const parts = currentPath.split('/').filter(Boolean);
          parts.pop();
          newPath = parts.join('/');
        } else if (target.startsWith('/')) {
          newPath = target.slice(1);
        } else {
          newPath = currentPath ? `${currentPath}/${target}` : target;
        }
        const node = resolvePath('/' + newPath, '');
        if (node && node.type === 'dir') {
          setCurrentPath(newPath);
        } else {
          newOutput.push(`cd: ${target}: No such directory`);
        }
      }
    } else if (baseCmd === 'cat') {
      if (args.length === 0) {
        newOutput.push("Usage: cat <file>");
      } else {
        const target = args[0];
        const fullPath = getPathString(currentPath) + (currentPath.endsWith('/') ? '' : '/') + target;
        const node = resolvePath(fullPath, '');
        if (node && node.type === 'file') {
          newOutput.push(node.content);
        } else {
          newOutput.push(`cat: ${target}: No such file`);
        }
      }
    } else if (baseCmd === 'vi') {
      if (args.length === 0) {
        newOutput.push("Usage: vi <file>");
      } else {
        const target = args[0];
        // Prevent editing the vi executable in /bin
        if (currentPath === 'bin' && target === 'vi') {
          newOutput.push("vi: Permission denied. Cannot edit system binary.");
        } else {
          const fullPath = getPathString(currentPath) + (currentPath.endsWith('/') ? '' : '/') + target;
          const node = resolvePath(fullPath, '');
          if (node && node.type === 'file') {
            setEditor({
              active: true,
              filename: target,
              content: node.content,
            });
            newOutput.push(`Entering vi editor for ${target}... (type :wq on a new line to save and exit)`);
          } else if (!node) {
            setEditor({
              active: true,
              filename: target,
              content: '',
            });
            newOutput.push(`Creating new file ${target} in vi editor... (type :wq to save and exit)`);
          } else {
            newOutput.push(`vi: ${target} is not a file`);
          }
        }
      }
    } else if (baseCmd === 'docker') {
      if (args[0] === 'ps') {
        newOutput.push(
          "CONTAINER ID   IMAGE               STATUS",
          "abc123         ominous_container   Up 5 minutes"
        );
      } else if (args[0] === 'logs') {
        const logsNode = resolvePath('/logs', '');
        if (logsNode && logsNode.type === 'dir' && logsNode.children['app.log']) {
          newOutput.push(logsNode.children['app.log'].content);
        } else {
          newOutput.push("docker logs: No logs available");
        }
      } else {
        newOutput.push(`docker: Unknown command ${args[0]}`);
      }
    } else {
      newOutput.push(`command not found: ${cmd}`);
    }
    
    return newOutput;
  };
  
  const handleKeyDown = (e) => {
    if (editor.active) return;
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = command;
      const commandOutput = handleCommand(trimmed);
      setOutput(prev => [...prev, ...commandOutput]);
      setCommand('');
    }
  };
  
  // --- Editor Mode Handlers ---
  const handleEditorInputChange = (e) => {
    setEditor(prev => ({ ...prev, content: e.target.value }));
  };
  
  const handleEditorInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const lines = editor.content.split('\n');
      const lastLine = lines[lines.length - 1].trim();
      if (lastLine === ':wq') {
        e.preventDefault();
        lines.pop();
        const newContent = lines.join('\n');
        // Save file into our virtual filesystem.
        const fullPath = getPathString(currentPath) + (currentPath.endsWith('/') ? '' : '/') + editor.filename;
        const parts = fullPath.split('/').filter(Boolean);
        let node = fileSystem['/'];
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!node.children[part]) {
            node.children[part] = { type: 'dir', children: {} };
          }
          node = node.children[part];
        }
        const fileName = parts[parts.length - 1];
        node.children[fileName] = { type: 'file', content: newContent };
        setEditor({ active: false, filename: '', content: '' });
        setOutput(prev => [...prev, `Saved ${editor.filename}`]);
      }
    }
  };
  
  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
        color: "#0f0",
        fontFamily: "monospace",
        padding: "8px",
        overflowY: "auto",
      }}
      onClick={() => {
        if (editor.active) {
          editorInputRef.current.focus();
        } else {
          inputRef.current.focus();
        }
      }}
    >
      {output.map((line, index) => (
        <div key={index} style={{ whiteSpace: "pre" }}>
          {line}
        </div>
      ))}
      {editor.active ? (
        <div>
          <div style={{ marginBottom: "4px" }}>
            -- VI EDITOR: {editor.filename} (type :wq on a new line to save and exit) --
          </div>
          <textarea
            ref={editorInputRef}
            value={editor.content}
            onChange={handleEditorInputChange}
            onKeyDown={handleEditorInputKeyDown}
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#000",
              color: "#0f0",
              fontFamily: "monospace",
              border: "1px solid #0f0",
            }}
            />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <span>{prompt}</span>
          <input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              background: "none",
              border: "none",
              color: "#0f0",
              outline: "none",
              fontFamily: "monospace",
              flex: 1
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Terminal;
