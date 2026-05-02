'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { courses, type Course } from '@/config/courses';
import { getOnlineCourseLink } from '@/lib/course-mapping';

// Emerald solar system: the flagship course is the central sun, the
// remaining 8 courses orbit on emerald rings at varied speeds. Click a
// planet → the camera cinematically zooms in toward it and a HUD info
// card overlays with quick stats + deep-link into that course's
// syllabus on its dedicated page.
interface OrbitConfig {
  radius: number;
  speed: number;
  size: number;
  phase: number;
}

const ORBIT_CONFIG: OrbitConfig[] = [
  { radius: 0,   speed: 0,    size: 0.55, phase: 0 },     // sun (flagship)
  { radius: 1.3, speed: 1.10, size: 0.17, phase: 0.4 },
  { radius: 1.7, speed: 0.85, size: 0.22, phase: 1.8 },
  { radius: 2.1, speed: 0.70, size: 0.16, phase: 3.2 },
  { radius: 2.6, speed: 0.55, size: 0.24, phase: 0.9 },
  { radius: 3.0, speed: 0.45, size: 0.20, phase: 4.1 },
  { radius: 3.5, speed: 0.55, size: 0.18, phase: 2.6 },
  { radius: 4.0, speed: 0.28, size: 0.26, phase: 5.4 },
  { radius: 4.5, speed: 0.20, size: 0.22, phase: 1.1 },
];

function shorten(title: string): string {
  return title
    .replace(' for Beginners', '')
    .replace(' — 8-Week Program', '')
    .replace(' — 90 Day Program', '')
    .replace(' for School Kids', '')
    .replace(' in 15 Days', '')
    .replace('Generative AI & ', '');
}

// Planetary order derived from price: most expensive course is the
// sun, remaining 8 orbit in price-descending order (inner orbits =
// pricier, outer = entry-level). Tie-breaker is originalPrice so the
// premium flagship still anchors when two courses share a headline
// number. Derived at build time from the single source of truth, so
// the galaxy stays in sync if prices change.
const PLANETS = [...courses]
  .sort((a, b) => b.price - a.price || (b.originalPrice ?? 0) - (a.originalPrice ?? 0))
  .slice(0, ORBIT_CONFIG.length)
  .map((course, i) => ({
    slug: course.slug,
    title: course.title,
    shortTitle: shorten(course.title),
    price: course.price,
    ...ORBIT_CONFIG[i],
  }));

interface PlanetProps {
  data: (typeof PLANETS)[number];
  dimmed: boolean;
  emphasized: boolean;
  autoLabeled: boolean;
  onSelect: (position: THREE.Vector3) => void;
  onHoverChange: (hovered: boolean) => void;
}

function Planet({ data, dimmed, emphasized, autoLabeled, onSelect, onHoverChange }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isSun = data.radius === 0;
  const showLabel = (hovered || autoLabeled) && !dimmed;

  useFrame(({ clock }) => {
    if (isSun || !groupRef.current) return;
    const t = clock.getElapsedTime() * data.speed + data.phase;
    groupRef.current.position.set(
      Math.cos(t) * data.radius,
      0,
      Math.sin(t) * data.radius
    );
  });

  const coreColor = hovered ? '#34d399' : emphasized ? '#34d399' : '#10b981';
  const haloColor = hovered ? '#6ee7b7' : emphasized ? '#a7f3d0' : '#34d399';
  const dimFactor = dimmed ? 0.3 : 1;
  // Role-aware emphasis — when the active hero variant flags this
  // course's slug, double the halo opacity and emissive intensity so
  // the visitor's eye lands on the recommended planets first.
  const emphasisBoost = emphasized && !dimmed ? 2.0 : 1;

  return (
    <>
      {!isSun && <OrbitRing radius={data.radius} active={hovered || emphasized} dimmed={dimmed} />}

      <group ref={groupRef}>
        <mesh raycast={() => null}>
          <sphereGeometry args={[data.size * (emphasized ? 3.6 : 3), 20, 20]} />
          <meshBasicMaterial
            color={coreColor}
            transparent
            opacity={(hovered ? 0.2 : isSun ? 0.14 : 0.08) * dimFactor * emphasisBoost}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh raycast={() => null}>
          <sphereGeometry args={[data.size * (emphasized ? 2.0 : 1.7), 20, 20]} />
          <meshBasicMaterial
            color={haloColor}
            transparent
            opacity={(hovered ? 0.4 : isSun ? 0.3 : 0.22) * dimFactor * emphasisBoost}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh
          onClick={(e) => {
            e.stopPropagation();
            const pos = groupRef.current
              ? groupRef.current.position.clone()
              : new THREE.Vector3();
            onSelect(pos);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            onHoverChange(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            onHoverChange(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <MeshDistortMaterial
            color={coreColor}
            speed={isSun ? 2 : 3}
            distort={isSun ? 0.45 : 0.25}
            emissive={coreColor}
            emissiveIntensity={
              (hovered ? 1.4 : isSun ? 1.1 : 0.7) *
              (dimmed ? 0.4 : 1) *
              emphasisBoost
            }
            transparent
            opacity={dimmed ? 0.5 : 1}
          />
        </mesh>

        {showLabel && (
          <Html
            center
            position={[0, data.size + 0.35, 0]}
            style={{ pointerEvents: 'none' }}
            zIndexRange={[20, 10]}
          >
            <span className="animate-in fade-in zoom-in-95 duration-300 whitespace-nowrap rounded border border-emerald-400/40 bg-black/75 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/95 shadow-[0_0_14px_rgba(16,185,129,0.45)]">
              {data.shortTitle}
            </span>
          </Html>
        )}
      </group>
    </>
  );
}

function OrbitRing({
  radius,
  active,
  dimmed,
}: {
  radius: number;
  active: boolean;
  dimmed: boolean;
}) {
  // Thicker rings + higher baseline opacity so the paths read as real
  // structure on the dark canvas — at 2px baseline they faded into the
  // grid and gave the impression of broken UI rather than an orbital
  // plane.
  const thickness = active ? 0.022 : 0.012;
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
      <ringGeometry args={[radius - thickness, radius + thickness, 128]} />
      <meshBasicMaterial
        color={active ? '#34d399' : '#10b981'}
        transparent
        opacity={(active ? 0.85 : 0.42) * (dimmed ? 0.35 : 1)}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    // Softer parallax — prior values swung the outer orbits past the
    // rounded container's clip on wide screens. 0.08/0.06 keeps the
    // depth illusion without clipping.
    const targetY = state.pointer.x * 0.08;
    const targetX = -state.pointer.y * 0.06;
    g.rotation.y += (targetY - g.rotation.y) * 0.05;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

// Minimal shape of drei's OrbitControls ref we actually touch — avoids
// pulling in three-stdlib types just for the ref.
interface OrbitRef {
  target: THREE.Vector3;
  autoRotate: boolean;
  update: () => void;
}

// Cinematic camera zoom. When a planet is selected, lerps the camera
// toward a spot on the radial line through that planet (just past it,
// slightly elevated) and pauses auto-rotate so the HUD reads clean.
// When deselected, flies back to the default "whole galaxy" framing.
function CameraController({
  target,
  orbitRef,
}: {
  target: THREE.Vector3 | null;
  orbitRef: React.RefObject<OrbitRef | null>;
}) {
  const { camera } = useThree();
  // Pulled back + slightly higher so the outer orbit (radius 4.5)
  // sits comfortably within the rounded container's clip on all
  // viewports. Prior z=12 was too tight; outer orbits kissed the
  // edge and auto-rotate + parallax clipped them.
  const defaultPos = useMemo(() => new THREE.Vector3(0, 3.5, 14), []);
  const defaultLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    let desiredPos: THREE.Vector3;
    let desiredLookAt: THREE.Vector3;

    if (target) {
      // Sit camera radially outward from the planet (away from the sun)
      // so the planet fills the foreground with the sun behind it.
      const radial =
        target.length() > 0.01
          ? target.clone().normalize().multiplyScalar(2.0)
          : new THREE.Vector3(0, 0, 3.0);
      desiredPos = target.clone().add(radial).add(new THREE.Vector3(0, 1.0, 0));
      desiredLookAt = target;
    } else {
      desiredPos = defaultPos;
      desiredLookAt = defaultLookAt;
    }

    camera.position.lerp(desiredPos, 0.06);

    const o = orbitRef.current;
    if (o) {
      o.target.lerp(desiredLookAt, 0.06);
      o.autoRotate = !target;
      o.update();
    }
  });

  return null;
}

interface StatProps {
  label: string;
  value: string;
}

function HudStat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/70">
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

interface NavigatorProps {
  // Slugs to glow brighter — driven by the role-aware hero variant
  // (biz owners get marketing + builder; freelancers get creative;
  // students get prompt + builder).
  emphasizedSlugs?: string[];
}

export function NeuralNavigator({ emphasizedSlugs = [] }: NavigatorProps = {}) {
  const emphasizedSet = useMemo(
    () => new Set(emphasizedSlugs),
    [emphasizedSlugs]
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
  const orbitRef = useRef<OrbitRef>(null);

  // Auto-spotlight: cycle a course label across the planets every
  // 2.5s so the galaxy reads as a course menu even at rest. Pauses on
  // real hover (hover takes over) or when a planet is selected (HUD
  // owns the focus).
  const [autoIndex, setAutoIndex] = useState(0);
  const [hoverActive, setHoverActive] = useState(false);
  const autoActive = !selectedSlug && !hoverActive;
  useEffect(() => {
    if (!autoActive) return;
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % PLANETS.length);
    }, 2500);
    return () => clearInterval(id);
  }, [autoActive]);
  const autoSlug = autoActive ? PLANETS[autoIndex].slug : null;

  const selectedCourse: Course | null = useMemo(
    () => (selectedSlug ? courses.find((c) => c.slug === selectedSlug) ?? null : null),
    [selectedSlug]
  );
  const selectedOnlineLink = selectedSlug ? getOnlineCourseLink(selectedSlug) : null;

  function handleSelect(slug: string, position: THREE.Vector3) {
    setSelectedSlug(slug);
    setCameraTarget(position);
  }

  function handleClose() {
    setSelectedSlug(null);
    setCameraTarget(null);
  }

  return (
    <div className="relative h-[460px] w-full sm:h-[560px] lg:h-[600px]">
      <div className="relative z-[1] h-full w-full">
        {/* HUD info card — thin glowing emerald border on dark glass.
            Appears top-left with corner brackets to read as a
            heads-up-display rather than a standard web popup. */}
        {selectedCourse && (
          <div className="absolute top-4 left-4 z-20 w-[calc(100%-2rem)] sm:max-w-sm">
            <div className="relative rounded-2xl border border-[#059669] bg-black/45 p-5 backdrop-blur-xl shadow-[0_0_32px_rgba(16,185,129,0.35)]">
              {/* HUD corner brackets */}
              <span className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-emerald-400" />
              <span className="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-emerald-400" />
              <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-emerald-400" />
              <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-emerald-400" />

              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close course details"
              >
                ✕
              </button>

              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                &gt; Target acquired
              </p>
              <h3 className="mt-1 pr-8 font-['Space_Grotesk',sans-serif] text-xl font-bold leading-tight text-white sm:text-2xl">
                {selectedCourse.title}
              </h3>
              {selectedCourse.shortDescription && (
                <p className="mt-1.5 text-xs leading-relaxed text-white/60 line-clamp-2">
                  {selectedCourse.shortDescription}
                </p>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2 border-y border-emerald-500/20 py-3">
                <HudStat
                  label="Sessions"
                  value={`${selectedCourse.syllabus.reduce((n, m) => n + m.topics.length, 0)}`}
                />
                <HudStat label="Duration" value={selectedCourse.duration} />
                <HudStat label="Level" value={selectedCourse.level} />
              </div>

              {/* Pricing row — real price from courses config, with the
                  original crossed through when there's a discount.
                  Separate from the stat grid so the ₹ number reads as
                  the commercial anchor, not just another data point. */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/70">
                  Offline
                </span>
                <span className="text-xl font-bold text-white">
                  ₹{selectedCourse.price.toLocaleString('en-IN')}
                </span>
                {selectedCourse.originalPrice && selectedCourse.originalPrice > selectedCourse.price && (
                  <span className="text-xs text-white/40 line-through">
                    ₹{selectedCourse.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/courses/${selectedCourse.slug}#syllabus`}
                  className="flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.8)]"
                >
                  Explore {selectedCourse.syllabus.reduce((n, m) => n + m.topics.length, 0)}-Session Journey →
                </Link>
                {selectedOnlineLink ? (
                  <Link
                    href={selectedOnlineLink.href}
                    className="flex items-center justify-center rounded-lg border border-emerald-400/40 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10"
                  >
                    Start with free lesson · ₹{selectedOnlineLink.price.toLocaleString('en-IN')} online
                  </Link>
                ) : (
                  <Link
                    href="/learn"
                    className="flex items-center justify-center rounded-lg border border-emerald-400/40 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/10"
                  >
                    Start Free Lesson
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <Canvas camera={{ position: [0, 3.2, 16], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 0, 0]} intensity={2.2} color="#10b981" />
          <pointLight position={[6, 6, 6]} intensity={0.6} color="#34d399" />

          <ParallaxGroup>
            {PLANETS.map((p) => (
              <Planet
                key={p.slug}
                data={p}
                dimmed={selectedSlug !== null && selectedSlug !== p.slug}
                emphasized={emphasizedSet.has(p.slug) && selectedSlug === null}
                autoLabeled={autoSlug === p.slug}
                onSelect={(position) => handleSelect(p.slug, position)}
                onHoverChange={setHoverActive}
              />
            ))}
          </ParallaxGroup>

          <OrbitControls
            ref={orbitRef as unknown as React.RefObject<never>}
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.25}
            makeDefault
          />

          <CameraController target={cameraTarget} orbitRef={orbitRef} />
        </Canvas>

      </div>
    </div>
  );
}
