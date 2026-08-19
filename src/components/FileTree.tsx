'use client';

import { useState, FC } from 'react';
import { FaChevronDown, FaChevronRight, FaFolder, FaFile } from 'react-icons/fa';

// Defines the structure for a single item in the file tree.
export type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[]; // Only present for folders.
};

// Defines the props for the FileTree component.
type FileTreeProps = {
  // The root array of FileNode objects to display.
  tree: FileNode[];
  // An optional callback function triggered when a file is clicked.
  onFileClick?: (fileId: string) => void;
};

// A recursive component that displays a file system-like tree structure.
const FileTree: FC<FileTreeProps> = ({ tree, onFileClick }) => {
  // State to track which folders are currently expanded, using their ID as the key.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Toggles the expanded state for a given folder ID.
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Recursively renders the file tree nodes.
  const renderTree = (nodes: FileNode[], level = 0): JSX.Element => {
    return (
      <ul className="space-y-1">
        {nodes.map((node) => {
          // Checks if the current node is expanded, defaulting to false.
          const isExpanded = expanded[node.id] ?? false;
          // Checks if the node is a folder and has children to display.
          const hasChildren = node.type === 'folder' && node.children?.length;

          return (
            <li key={node.id} className={`ml-${level * 4}`}>
              <div className="flex items-center gap-1 cursor-pointer">
                {/* Renders the expand/collapse chevron for folders with children. */}
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(node.id)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                  </button>
                )}
                {/* Placeholder span for files or empty folders to ensure alignment. */}
                {!hasChildren && <span className="w-[12px]" />}{' '}
                {/* Ensures proper alignment with icons. */}
                {/* Renders the file/folder icon and name. */}
                <span
                  // Triggers the onFileClick callback only if the node is a file.
                  onClick={() => node.type === 'file' && onFileClick?.(node.id)}
                  className={`flex items-center gap-1 ${
                    node.type === 'file' ? 'hover:text-blue-500' : ''
                  }`}
                >
                  {/* Renders the appropriate icon (folder or file). */}
                  {node.type === 'folder' ? <FaFolder /> : <FaFile />}
                  {node.name}
                </span>
              </div>

              {/* Recursively calls renderTree to display children if the folder is expanded. */}
              {hasChildren && isExpanded && renderTree(node.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    // The main container for the file tree component with basic styling.
    <div className="p-4 w-full max-w-xs bg-gray-50 dark:bg-gray-800 rounded-md">
      {renderTree(tree)}
    </div>
  );
};

export default FileTree;

// Example usage
// const fileTreeData: FileNode[] = [
//   {
//     id: '1',
//     name: 'src',
//     type: 'folder',
//     children: [
//       {
//         id: '1-1',
//         name: 'components',
//         type: 'folder',
//         children: [
//           { id: '1-1-1', name: 'Header.mdx', type: 'file' },
//           { id: '1-1-2', name: 'Footer.mdx', type: 'file' },
//         ],
//       },
//       {
//         id: '1-2',
//         name: 'pages',
//         type: 'folder',
//         children: [
//           { id: '1-2-1', name: 'index.mdx', type: 'file' },
//           {
//             id: '1-2-2',
//             name: 'blog',
//             type: 'folder',
//             children: [
//               { id: '1-2-2-1', name: 'post1.mdx', type: 'file' },
//               { id: '1-2-2-2', name: 'post2.mdx', type: 'file' },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

// <FileTree
//   tree={fileTreeData}
//   onFileClick={(id) => console.log('Clicked file', id)}
// />;
