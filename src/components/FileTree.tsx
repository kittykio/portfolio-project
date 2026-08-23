'use client';

import { useState, FC } from 'react';
import { FaChevronDown, FaChevronRight, FaFolder, FaFile } from 'react-icons/fa';

export type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

type FileTreeProps = {
  tree?: FileNode[];
  onFileClick?: (fileId: string) => void;
};

/** Renders arbitrarily nested file data while keeping expansion state local to each node ID. */
const FileTree: FC<FileTreeProps> = ({ tree = [], onFileClick }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (nodes: FileNode[] = [], level = 0): JSX.Element => {
    return (
      <ul className="space-y-1">
        {nodes.map((node) => {
          const isExpanded = expanded[node.id] ?? false;
          const hasChildren = node.type === 'folder' && node.children?.length;

          return (
            // Tailwind cannot discover arbitrary computed indentation classes; callers should
            // keep trees shallow enough for the generated spacing scale used by this component.
            <li key={node.id} className={`ml-${level * 4}`}>
              <div className="flex items-center gap-1 cursor-pointer">
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(node.id)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                  </button>
                )}
                {!hasChildren && <span className="w-[12px]" />}{' '}
                <span
                  onClick={() => node.type === 'file' && onFileClick?.(node.id)}
                  className={`flex items-center gap-1 ${
                    node.type === 'file' ? 'hover:text-blue-500' : ''
                  }`}
                >
                  {node.type === 'folder' ? <FaFolder /> : <FaFile />}
                  {node.name}
                </span>
              </div>

              {hasChildren && isExpanded && renderTree(node.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="p-4 w-full max-w-xs bg-gray-50 dark:bg-gray-800 rounded-md">
      {renderTree(tree)}
    </div>
  );
};

export default FileTree;
