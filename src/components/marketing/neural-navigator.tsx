'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Float, Line, MeshDistortMaterial, OrbitControls, Sphere, Text } from '@react-three/drei';
import { courses } from '@/config/courses';
import { getOnlineCourseLink } from '@/lib/course-mapping';

// Fixed aesthetic positions around the origin — the center node (index 0)
// anchors the graph, the other 8 spread out. Matches the designer's layout
// rather than computing sphere coords programmatically so the composition
// reads intentionally.
const NODE_POSITIONS: [number, number, number][] = [
  [0, 0, 0],          // center — flagship
  [-2, 1.2, 0.5],
  [-2.5, -0.8, -1],
  [2, 1.5, -0.5],
  [2.2, -0.6, 1],
  [1, -1.8, 1.2],
  [-1.2, -2, 0.8],
  [-0.5, 2, -1.5],
  [3, 0, -2],
];

// Map real course configs to the 9 node slots. Central node is the
// flagship Master AI Builder; the rest follow the order they appear in
// the courses config so it feels stable.
const NODES = courses.slice(0, NODE_POSITIONS.length).map((course, i) => ({
  slug: course.slug,
  title: course.title,
  shortTitle: shorten(course.title),
  price: course.price,
  position: NODE_POSITIONS[i],
}));

function shorten(title: string): string {
  // The course titles are long enough that 3D text overlaps the node at
  // normal sizes. Strip marketing suffixes ("for Beginners", "— 8-Week
  // Program") so the floating label stays one line.
  return title
    .replace(' for Beginners', '')
    .replace(' — 8-Week Program', '')
    .replace(' for School Kids', '')
    .replace(' in 15 Days', '')
    .replace('Generative AI & ', '');
}

interface Selected {
  slug: string;
  title: string;
  price: number;
}

interface NodeProps {
  position: [number, number, number];
  title: string;
  onSelect: () => void;
}

function Node({ position, title, onSelect }: NodeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere
        args={[0.22, 32, 32]}
        position={position}
        onClick={onSelect}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <MeshDistortMaterial
          color={hovered ? '#10b981' : '#059669'}
          speed={4}
          distort={0.3}
          emissive="#059669"
          emissiveIntensity={hovered ? 2 : 0.5}
        />
      </Sphere>
      {hovered && (
        <Text
          position={[position[0], position[1] + 0.45, position[2]]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      )}
    </Float>
  );
}

export function NeuralNavigator() {
  const [selected, setSelected] = useState<Selected | null>(null);

  // Connection lines from center node to every outer node. Memoized so
  // the Line meshes aren't recreated on every re-render.
  const lines = useMemo(
    () =>
      NODES.slice(1).map((n) => ({
        start: [0, 0, 0] as [number, number, number],
        end: n.position,
      })),
    []
  );

  const selectedOnlineLink = selected ? getOnlineCourseLink(selected.slug) : null;
  const enrollHref = selected ? `/courses/${selected.slug}` : '#';

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#020617] sm:h-[520px] lg:h-[560px]">
      {/* Selection panel — appears when a node is clicked. Absolute-positioned
          over the canvas so the 3D scene stays live in the background. */}
      {selected && (
        <div className="absolute top-4 left-4 z-10 max-w-[calc(100%-2rem)] rounded-2xl border border-emerald-500/30 bg-white/5 p-5 backdrop-blur-xl sm:max-w-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Course selected
          </p>
          <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">{selected.title}</h3>
          <p className="mt-2 text-sm text-white/70">
            Starts at <span className="font-bold text-white">₹{selected.price.toLocaleString('en-IN')}</span>
            {selectedOnlineLink && (
              <>
                {' '}· or <span className="font-bold text-emerald-300">₹{selectedOnlineLink.price.toLocaleString('en-IN')} online</span>
              </>
            )}
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={enrollHref}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
            >
              Explore →
            </Link>
            {selectedOnlineLink && (
              <Link
                href={selectedOnlineLink.href}
                className="rounded-lg border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10"
              >
                Buy ₹999
              </Link>
            )}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/15"
              aria-label="Close course details"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#059669" />

        <group>
          {NODES.map((node) => (
            <Node
              key={node.slug}
              position={node.position}
              title={node.shortTitle}
              onSelect={() =>
                setSelected({ slug: node.slug, title: node.title, price: node.price })
              }
            />
          ))}

          {lines.map((l, i) => (
            <Line
              key={i}
              points={[l.start, l.end]}
              color="#059669"
              lineWidth={0.6}
              transparent
              opacity={0.25}
            />
          ))}
        </group>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.6}
          makeDefault
          enablePan={false}
        />
      </Canvas>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
        Click a node to explore TARAhut courses
      </p>
    </div>
  );
}
