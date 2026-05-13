import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { pointer } from '../pointerStore';

const MARGIN = 0.06;
const DRAG_CLICK_MAX_PX = 14;
const DRAG_CLICK_MAX_MS = 420;
const K_NEIGHBORS = 3;
const FLOAT_SPEED = 0.00011;

function hashUnit(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (Math.abs(h) % 10000) / 10000;
}

function clamp01(v, lo = MARGIN, hi = 1 - MARGIN) {
  return Math.min(hi, Math.max(lo, v));
}

function distSq(a, b, w, h) {
  const dx = (a.nx - b.nx) * w;
  const dy = (a.ny - b.ny) * h;
  return dx * dx + dy * dy;
}

function computeEdges(nodes, w, h) {
  const n = nodes.length;
  if (n < 2) return [];
  const maxD = Math.min(w, h) * 0.48;
  const maxDSq = maxD * maxD;
  const set = new Set();

  for (let i = 0; i < n; i++) {
    const others = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d2 = distSq(nodes[i], nodes[j], w, h);
      if (d2 <= maxDSq) others.push({ j, d2 });
    }
    others.sort((a, b) => a.d2 - b.d2);
    for (let k = 0; k < Math.min(K_NEIGHBORS, others.length); k++) {
      const j = others[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      set.add(key);
    }
  }

  return [...set].map((key) => {
    const [a, b] = key.split('-').map(Number);
    return { a, b, key };
  });
}

function initNodes(artworks) {
  return artworks.map((artwork) => {
    let nx = clamp01(hashUnit(`${artwork.id}|nx`) * 0.86 + 0.07);
    let ny = clamp01(hashUnit(`${artwork.id}|ny`) * 0.86 + 0.07);
    nx = clamp01(nx + (hashUnit(`${artwork.id}|jx`) - 0.5) * 0.06);
    ny = clamp01(ny + (hashUnit(`${artwork.id}|jy`) - 0.5) * 0.06);
    return {
      id: artwork.id,
      artwork,
      nx,
      ny,
      phx: hashUnit(`${artwork.id}|phx`) * Math.PI * 2,
      phy: hashUnit(`${artwork.id}|phy`) * Math.PI * 2
    };
  });
}

export const GalleryWeb = memo(({ artworks, onOpen }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const dragRef = useRef(null);
  const rafRef = useRef(0);
  const pointerCanvasRef = useRef({ mx: 0, my: 0 });
  const [dims, setDims] = useState({ w: 900, h: 560 });

  const DISPLAY_COUNT = 6;
  const [displayArtworks, setDisplayArtworks] = useState(artworks ?? []);
  // n is the number of visible nodes (<= DISPLAY_COUNT)
  const n = displayArtworks.length;

  const tickCounterRef = useRef(0);
  const [tick, setTick] = useState(0);

  // PERF/UX: update line connections less frequently than node drift/hover
  // so we still reconnect to nearest dots, but avoid recomputing edges every frame.
  const edgeCounterRef = useRef(0);
  const [edgeVersion, setEdgeVersion] = useState(0);

  // Randomly swap which artworks are represented by the 6 visible dots.
  useEffect(() => {
    if (!Array.isArray(artworks)) return;

    const pickSubset = () => {
      if (artworks.length <= DISPLAY_COUNT) return artworks;

      // Deterministic-ish shuffle per call using current time as seed.
      const seed = Math.floor(performance.now());
      const arr = artworks.slice();

      // Fisher-Yates shuffle with a simple LCG based on seed
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;

      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, DISPLAY_COUNT);
    };

    setDisplayArtworks(pickSubset());

    if (artworks.length > DISPLAY_COUNT) {
      const id = window.setInterval(() => {
        setDisplayArtworks(pickSubset());
      }, 5200);

      return () => window.clearInterval(id);
    }

    return undefined;
  }, [artworks]);

  // When displayArtworks changes, reset node drift by reinitializing nodes below.
  // (nodesRef is regenerated in the nodes-init effect.)

  const bump = useCallback(() => {
    tickCounterRef.current++;

    // Update node renders for hover scaling at a moderate rate
    if (tickCounterRef.current % 4 === 0) {
      setTick((x) => x + 1);
    }

    // Update edges for "nearest neighbor" feel at a slower rate
    edgeCounterRef.current++;
    if (edgeCounterRef.current % 8 === 0) {
      setEdgeVersion((x) => x + 1);
    }
  }, []);

  // Initialize nodes only once (so switching artworks doesn't reset positions).
  // When displayArtworks changes, we keep nx/ny/phx/phy and only replace the artwork payload.
  useEffect(() => {
    if (!Array.isArray(displayArtworks) || displayArtworks.length === 0) return;

    // First time init
    if (nodesRef.current.length === 0) {
      nodesRef.current = initNodes(displayArtworks);
      bump();
      return;
    }

    // Subsequent updates: preserve node positions and motion params,
    // but swap which artwork each dot represents.
    const nodes = nodesRef.current;
    const next = initNodes(displayArtworks); // to get stable motion seeds + ids, but we only copy artwork+id
    const count = Math.min(nodes.length, next.length);

    for (let i = 0; i < count; i++) {
      nodes[i].id = next[i].id;
      nodes[i].artwork = next[i].artwork;
      nodes[i].nx = nodes[i].nx; // preserve
      nodes[i].ny = nodes[i].ny; // preserve
      nodes[i].phx = nodes[i].phx; // preserve
      nodes[i].phy = nodes[i].phy; // preserve
    }

    bump();
  }, [displayArtworks, bump]);

  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();

      // Fill available area inside the gallery section.
      // Use whatever space the section gives us, while keeping reasonable min/max bounds.
      const availW = Math.max(320, r.width);
      const availH = Math.max(320, r.height);

      // Original art ratio bias:
      const idealHFromW = availW * 0.72;

      const w = Math.floor(availW);
      const h = Math.floor(Math.min(availH, Math.max(420, idealHFromW)));

      setDims({
        w: Math.max(360, w),
        h: Math.max(420, h)
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);

    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { w, h } = dims;

  useEffect(() => {
    if (!n || !w) return undefined;

    const tick = () => {
      const t = performance.now() * 0.001;
      const nodes = nodesRef.current;
      const drag = dragRef.current;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        pointerCanvasRef.current.mx = pointer.x - rect.left;
        pointerCanvasRef.current.my = pointer.y - rect.top;
      }

      for (const node of nodes) {
        if (drag && drag.id === node.id) continue;
        const dnx = Math.sin(t * 0.31 + node.phx) * FLOAT_SPEED;
        const dny = Math.cos(t * 0.27 + node.phy) * FLOAT_SPEED;
        node.nx = clamp01(node.nx + dnx);
        node.ny = clamp01(node.ny + dny);
      }

      rafRef.current = requestAnimationFrame(tick);
      bump();
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [n, w, h, bump]);

  // Recompute edges so that lines reconnect to the nearest moving nodes.
  // This is intentionally rate-limited via edgeVersion to avoid stutter.
  const edges = useMemo(
    () => computeEdges(nodesRef.current, w, h),
    [w, h, n, displayArtworks, edgeVersion]
  );

  const bgStars = useMemo(() => {
    const dots = [];
    const seed = w + h * 0.001;
    for (let i = 0; i < 120; i++) {
      const x = (hashUnit(`star${i}x${seed}`) * 0.92 + 0.04) * w;
      const y = (hashUnit(`star${i}y${seed}`) * 0.92 + 0.04) * h;
      const r = 0.35 + hashUnit(`star${i}r${seed}`) * 1.1;
      const o = 0.08 + hashUnit(`star${i}o${seed}`) * 0.35;
      dots.push({ x, y, r, o, i });
    }
    return dots;
  }, [w, h]);

  const pointerDown = useCallback((e, nodeId) => {
    if (e.button !== 0) return;

    let rect = null;
    try {
      rect = canvasRef.current?.getBoundingClientRect() ?? null;
    } catch {
      rect = null;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    dragRef.current = {
      id: nodeId,
      pointerId: e.pointerId,
      startT: performance.now(),
      moved: 0,
      lastX: e.clientX,
      lastY: e.clientY,
      rect: rect && rect.width > 0 ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null
    };
  }, []);

  const pointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      drag.moved += Math.abs(e.clientX - drag.lastX) + Math.abs(e.clientY - drag.lastY);
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;

      const rect = drag.rect;
      if (!rect) return;

      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      const node = nodesRef.current.find((nd) => nd.id === drag.id);
      if (node) {
        node.nx = clamp01(nx);
        node.ny = clamp01(ny);
        bump();
      }
    },
    [bump]
  );

  const pointerUp = useCallback(
    (e, artwork) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const dt = performance.now() - drag.startT;
      const isClick = drag.moved < DRAG_CLICK_MAX_PX && dt < DRAG_CLICK_MAX_MS;
      dragRef.current = null;
      if (isClick) onOpen(artwork);
      bump();
    },
    [onOpen, bump]
  );

  const pointerCancel = useCallback(
    (e) => {
      if (dragRef.current && e.pointerId === dragRef.current.pointerId) {
        dragRef.current = null;
        bump();
      }
    },
    [bump]
  );

  if (n === 0) {
    return (
      <div className="gallery-web gallery-web--empty">
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>No artwork nodes — add folders under public/ARTWORK/</p>
      </div>
    );
  }

  const nodes = nodesRef.current;
  const { mx, my } = pointerCanvasRef.current;

  return (
    <div ref={wrapRef} className="gallery-web gallery-web--constellation" style={{ width: '100%' }}>
      <p
        className="gallery-web__hint"
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '12px',
          letterSpacing: '1px',
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Constellation view — stars drift slowly. Drag a star to move it; links reconnect to the nearest neighbors. Quick click
        opens the file.
      </p>
      <div
        ref={canvasRef}
        className="gallery-web__universe"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `${w}px`,
          margin: '0 auto',
          height: `${h}px`,
          touchAction: 'none'
        }}
      >
        <svg className="gallery-web__svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} aria-hidden>
          <defs>
            <linearGradient id="const-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--accent-red)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {bgStars.map((s) => (
            <circle key={s.i} cx={s.x} cy={s.y} r={s.r} className="gallery-web__dust" />
          ))}
          {edges.map(({ a, b, key }) => {
            const na = nodes[a];
            const nb = nodes[b];
            if (!na || !nb) return null;
            return (
              <line
                key={key}
                x1={na.nx * w}
                y1={na.ny * h}
                x2={nb.nx * w}
                y2={nb.ny * h}
                className="gallery-web__line"
                stroke="url(#const-line-grad)"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        <div className="gallery-web__nodes" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {nodes.map((node) => {
            const d = Math.hypot(mx - node.nx * w, my - node.ny * h);
            const hover = Math.max(0.78, Math.min(1.12, 0.82 + (1 - Math.min(d, 200) / 200) * 0.28));

            return (
              <button
                key={node.id}
                type="button"
                className="gallery-web__node interactive gallery-web__star"
                style={{
                  position: 'absolute',
                  left: `${node.nx * 100}%`,
                  top: `${node.ny * 100}%`,
                  transform: `translate(-50%, -50%) scale(${hover})`,
                  pointerEvents: 'auto'
                }}
                onPointerDown={(e) => pointerDown(e, node.id)}
                onPointerMove={pointerMove}
                onPointerUp={(e) => pointerUp(e, node.artwork)}
                onPointerCancel={pointerCancel}
                aria-label={`${node.artwork.title} — drag or click`}
              >
                <span className="gallery-web__ring" />
                <span className="gallery-web__img-wrap">
                  <img src={node.artwork.imageThumb || node.artwork.image} alt="" draggable={false} loading="lazy" decoding="async" />
                </span>
                <span className="gallery-web__title">{node.artwork.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
