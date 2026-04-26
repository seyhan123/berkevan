"use client";
import { useState, useCallback, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import type { Person } from "@/lib/types";

const NODE_W = 155;
const NODE_H = 62;
const H_GAP = 20;
const V_GAP = 80;

interface TreeNode {
  id: string;
  name: string;
  nickname?: string | null;
  gender: string;
  birth_year?: number | null;
  death_year?: number | null;
  children: TreeNode[];
}

function buildTree(people: Person[]): TreeNode[] {
  const map: Record<string, TreeNode> = {};
  people.forEach((p) => { map[p.id] = { ...p, children: [] }; });
  const roots: TreeNode[] = [];
  people.forEach((p) => {
    if (p.father_id && map[p.father_id]) map[p.father_id].children.push(map[p.id]);
    else if (!p.father_id) roots.push(map[p.id]);
  });
  return roots;
}

function subtreeWidth(node: TreeNode, expanded: Set<string>): number {
  if (!expanded.has(node.id) || node.children.length === 0) return NODE_W;
  const childrenWidth = node.children.reduce(
    (sum, child) => sum + subtreeWidth(child, expanded) + H_GAP, -H_GAP
  );
  return Math.max(NODE_W, childrenWidth);
}

interface LayoutNode {
  id: string; name: string; nickname?: string | null;
  gender: string; birth_year?: number | null; death_year?: number | null;
  x: number; y: number;
  parentX?: number; parentY?: number;
  hasChildren: boolean;
}

function layoutNodes(
  node: TreeNode, expanded: Set<string>, depth: number,
  xCenter: number, parentX?: number, parentY?: number
): LayoutNode[] {
  const y = depth * (NODE_H + V_GAP) + 20;
  const x = xCenter - NODE_W / 2;
  const result: LayoutNode[] = [{
    id: node.id, name: node.name, nickname: node.nickname,
    gender: node.gender, birth_year: node.birth_year, death_year: node.death_year,
    x, y, parentX, parentY, hasChildren: node.children.length > 0,
  }];
  if (!expanded.has(node.id) || node.children.length === 0) return result;

  const totalW = node.children.reduce(
    (sum, child) => sum + subtreeWidth(child, expanded) + H_GAP, -H_GAP
  );
  let curX = xCenter - totalW / 2;
  node.children.forEach((child) => {
    const sw = subtreeWidth(child, expanded);
    const childCenter = curX + sw / 2;
    layoutNodes(child, expanded, depth + 1, childCenter, xCenter, y + NODE_H)
      .forEach((n) => result.push(n));
    curX += sw + H_GAP;
  });
  return result;
}

function NodeCard({ node, isExpanded, onToggle }: {
  node: LayoutNode; isExpanded: boolean; onToggle: (id: string) => void;
}) {
  const isM = node.gender === "m";
  const isDead = !!node.death_year;
  const [hovered, setHovered] = useState(false);

  const bg = hovered ? "#2d5a3d" : isM ? "#eff6ff" : "#fff1f2";
  const borderColor = hovered ? "#2d5a3d" : isM ? "#93c5fd" : "#fda4af";
  const textColor = hovered ? "#fff" : "#111";
  const mutedColor = hovered ? "#bbf7d0" : "#9ca3af";
  const nickColor = hovered ? "#bbf7d0" : "#c9a96e";

  return (
    <g>
      {node.parentX !== undefined && node.parentY !== undefined && (
        <path
          d={`M${node.parentX},${node.parentY} C${node.parentX},${node.y - V_GAP / 2} ${node.x + NODE_W / 2},${node.y - V_GAP / 2} ${node.x + NODE_W / 2},${node.y}`}
          fill="none" stroke="#2d5a3d" strokeWidth={1.5} strokeOpacity={0.35}
        />
      )}
      <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={8}
        fill={bg} stroke={borderColor} strokeWidth={hovered ? 2 : 1} />
      <rect x={node.x} y={node.y} width={NODE_W} height={3} rx={4}
        fill={isM ? "#3b82f6" : "#f43f5e"} />
      <text x={node.x + 10} y={node.y + 20} fontSize={11} fontWeight="600"
        fill={textColor} fontFamily="Plus Jakarta Sans, system-ui, sans-serif">
        {node.name.length > 17 ? node.name.slice(0, 16) + "…" : node.name}
      </text>
      {node.nickname && (
        <text x={node.x + 10} y={node.y + 33} fontSize={9.5} fill={nickColor}
          fontStyle="italic" fontFamily="Plus Jakarta Sans, system-ui, sans-serif">
          "{node.nickname.length > 18 ? node.nickname.slice(0, 17) + "…" : node.nickname}"
        </text>
      )}
      <text x={node.x + 10} y={node.y + (node.nickname ? 47 : 38)}
        fontSize={9} fill={mutedColor} fontFamily="Plus Jakarta Sans, system-ui, sans-serif">
        {node.birth_year ?? "?"} — {node.death_year ?? "•"}{isDead ? " †" : ""}
      </text>
      <a href={`/people/${node.id}`}>
        <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} fill="transparent"
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          style={{ cursor: "pointer" }} />
      </a>
      {node.hasChildren && (
        <g onClick={() => onToggle(node.id)} style={{ cursor: "pointer" }}>
          <circle cx={node.x + NODE_W / 2} cy={node.y + NODE_H + 14} r={11}
            fill={isExpanded ? "#2d5a3d" : "#fff"}
            stroke={isExpanded ? "#2d5a3d" : "#d1d5db"} strokeWidth={1.5} />
          <text x={node.x + NODE_W / 2} y={node.y + NODE_H + 19}
            fontSize={14} fontWeight="bold" textAnchor="middle"
            fill={isExpanded ? "#fff" : "#6b7280"}
            style={{ userSelect: "none", pointerEvents: "none" }}>
            {isExpanded ? "−" : "+"}
          </text>
        </g>
      )}
    </g>
  );
}

export default function TreeClient({ people }: { people: Person[] }) {
  const { t } = useLang();
  const roots = buildTree(people);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 40 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const allNodes: LayoutNode[] = [];
  let curX = 0;
  roots.forEach((root) => {
    const sw = subtreeWidth(root, expanded);
    layoutNodes(root, expanded, 0, curX + sw / 2)
      .forEach((n) => allNodes.push(n));
    curX += sw + H_GAP * 3;
  });

  const maxX = Math.max(...allNodes.map((n) => n.x + NODE_W), 400) + 80;
  const maxY = Math.max(...allNodes.map((n) => n.y + NODE_H + 30), 200) + 80;

  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("a, circle")) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }
  function onMouseUp() { isDragging.current = false; }

  // Zoom towards mouse cursor
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.min(2.5, Math.max(0.15, zoom + delta));
    // Adjust pan so the point under cursor stays fixed
    setPan((p) => ({
      x: mouseX - (mouseX - p.x) * (newZoom / zoom),
      y: mouseY - (mouseY - p.y) * (newZoom / zoom),
    }));
    setZoom(newZoom);
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 60, y: 40 });
    setExpanded(new Set());
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-title mb-1">{t.tree.title}</h1>
          <p className="text-xs text-stone-400">
            {people.length} kişi · Karta tıkla detay gör · <span className="font-semibold text-[#2d5a3d]">+</span> ile çocukları aç · Sürükle & scroll ile gez
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            const newZoom = Math.min(2.5, zoom + 0.15);
            const rect = containerRef.current!.getBoundingClientRect();
            const cx = rect.width / 2; const cy = rect.height / 2;
            setPan((p) => ({ x: cx - (cx - p.x) * (newZoom / zoom), y: cy - (cy - p.y) * (newZoom / zoom) }));
            setZoom(newZoom);
          }} className="btn-secondary w-8 h-8 flex items-center justify-center font-bold text-lg">+</button>
          <span className="text-xs text-stone-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => {
            const newZoom = Math.max(0.15, zoom - 0.15);
            const rect = containerRef.current!.getBoundingClientRect();
            const cx = rect.width / 2; const cy = rect.height / 2;
            setPan((p) => ({ x: cx - (cx - p.x) * (newZoom / zoom), y: cy - (cy - p.y) * (newZoom / zoom) }));
            setZoom(newZoom);
          }} className="btn-secondary w-8 h-8 flex items-center justify-center font-bold text-lg">−</button>
          <button onClick={resetView} className="btn-secondary text-xs px-3 h-8">Sıfırla</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="card overflow-hidden"
        style={{ height: "78vh", cursor: isDragging.current ? "grabbing" : "grab", userSelect: "none", background: "#f7f4ef" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          display: "inline-block",
        }}>
          <svg width={maxX} height={maxY} style={{ display: "block", overflow: "visible" }}>
            {allNodes.map((node) => (
              <NodeCard key={node.id} node={node}
                isExpanded={expanded.has(node.id)} onToggle={toggle} />
            ))}
          </svg>
        </div>
      </div>

      <div className="flex gap-6 mt-3 text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-blue-400 inline-block mt-0.5" />Erkek
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 rounded-full bg-rose-400 inline-block mt-0.5" />Kadın
        </span>
        <span>† = Vefat</span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#2d5a3d] inline-flex items-center justify-center text-white font-bold" style={{fontSize:"11px"}}>+</span>
          Çocukları göster
        </span>
      </div>
    </div>
  );
}
