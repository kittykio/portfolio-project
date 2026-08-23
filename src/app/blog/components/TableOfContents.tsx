'use client';

import React, { Dispatch, SetStateAction, useState, useMemo } from 'react';
import type { Heading } from '@/types/HeadingType';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { TbListTree } from 'react-icons/tb';
import LikeButton from '@/components/LikeButton';
import { PostDetailType } from '@/types/PostType';
import { updateLike } from '@/lib/blogAction';

type TOCProps = {
  headings: Heading[];
  postItem: PostDetailType;
  setPostItem: Dispatch<SetStateAction<PostDetailType>>;
};

type HeadingNode = Heading & { children: HeadingNode[] };

export const TableOfContents = ({ headings, postItem, setPostItem }: TOCProps) => {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string>('');

  // -------------------------
  // Build heading tree by depth
  // -------------------------

  function buildTree(headings: Heading[]): HeadingNode[] {
    const root: HeadingNode[] = [];
    const stack: HeadingNode[] = [];

    for (const h of headings) {
      const node: HeadingNode = { ...h, children: [] };

      // Pop until stack top is a parent (smaller depth)
      while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) {
        stack.pop();
      }

      if (stack.length === 0) {
        // no parent → push to root
        root.push(node);
      } else {
        // parent is stack top
        stack[stack.length - 1].children.push(node);
      }

      stack.push(node);
    }

    return root;
  }

  const tree = buildTree(headings);

  // -------------------------
  // Scrollspy (detect active heading)
  // -------------------------
  useMemo(() => {
    const handleScroll = () => {
      let currentId = '';
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top <= 100) {
          currentId = heading.id;
        }
      }
      setActiveId(currentId);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // -------------------------
  // Expand toggle
  // -------------------------
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  // -------------------------
  // Recursive render
  // -------------------------
  const renderTree = (nodes: HeadingNode[]): JSX.Element => (
    <ul className="space-y-1 whitespace-normal break-words">
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded[node.id] ?? true;
        const isActive = activeId === node.id;

        return (
          <li key={node.id} className="ml-4 whitespace-normal break-words">
            <div className="flex items-center gap-1">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(node.id)}
                  className="text-content-muted hover:text-flame-500 transition"
                >
                  {isExpanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                </button>
              )}
              <a
                href={`#${node.id}`}
                className={`block whitespace-normal break-words transition-colors duration-150 ${
                  isActive ? 'text-flame-500 font-bodyBold' : 'hover:text-flame-500'
                }`}
              >
                {node.title}
              </a>
            </div>
            {hasChildren && isExpanded && renderTree(node.children)}
          </li>
        );
      })}
    </ul>
  );

  // -------------------------
  // Render TOC
  // -------------------------
  if (!headings || headings.length === 0) return null;

  return (
    <aside className="relative max-h-fit min-w-[200px]">
      <div className="overflow-y-auto isolate bg-surface-glass-strong backdrop-blur-xl border border-border/20 rounded-xl shadow-md px-4 py-8 text-sm shadow-[inset_1px_1px_2px_var(--shadow-inset-light),inset_-1px_-1px_2px_var(--shadow-inset-dark)] drop-shadow-[0_4px_12px_var(--shadow)]">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bodyBold text-content-muted flex items-center gap-2">
            <TbListTree size={16} /> On this page
          </p>
          <button
            onClick={() => setOpen(!open)}
            className="text-content-muted hover:text-flame-500 transition"
          >
            {open ? <FaChevronDown size={18} /> : <FaChevronRight size={18} />}
          </button>
        </div>

        {open && renderTree(tree)}
      </div>
      <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 z-10 hidden lg:block">
        <LikeButton
          likeItem={postItem}
          setLikeItem={setPostItem}
          updateLike={updateLike}
          activate
          size={28}
        />
      </div>
    </aside>
  );
};

export default TableOfContents;
