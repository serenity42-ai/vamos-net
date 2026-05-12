"use client";

import { useEffect, useRef } from "react";

/**
 * AnimatedNetLogo — Canvas 2D mesh that ripples like wind through a padel
 * court net. A wordmark (default: "V") is rendered as a stencil cut out of
 * the mesh — only cells whose coverage by the glyph exceeds `coverage`
 * get the accent fill. The rest stays as plain mesh.
 *
 * Source of truth: brand handoff's "VAMOS.NET Animated Logo.html" study.
 * The defaults below are the values Alex locked in that study after a
 * round of tweaks (word=V, speed=1.85×, amp=15px, tension=tight, density=low,
 * coverage=42%, net=paper, accent=lime, bg=ink).
 *
 * Renders into a parent of the component's choice; the canvas auto-sizes
 * to the provided width/height props and respects devicePixelRatio (capped
 * at 2 to keep the redraw cheap on Retina screens).
 *
 * Keep this client-only — Canvas API, refs, and rAF are all browser-side.
 */

interface Props {
  /**
   * Display width in CSS px. When `responsive` is true, this is treated as
   * the *intrinsic* aspect-ratio width and the canvas auto-sizes to the
   * container's measured width.
   */
  width: number;
  /**
   * Display height in CSS px. When `responsive` is true, this is treated as
   * the *intrinsic* aspect-ratio height and the canvas auto-sizes to the
   * container's measured height.
   */
  height: number;
  /**
   * When true, the canvas fills its parent container and re-renders on
   * resize. width/height become aspect-ratio hints only. Default false.
   */
  responsive?: boolean;
  /** Wordmark stenciled into the mesh. Default "V". */
  word?: "V" | "V." | "VAMOS" | "VAMOS!" | "NET";
  /** Wave speed multiplier (1 = baseline). Default 1.85. */
  speed?: number;
  /** Wave amplitude in px at the center of the net. Default 15. */
  amplitude?: number;
  /** Net tension 0–1. Higher = stiffer / smaller-feeling waves. Default 0.84. */
  tension?: number;
  /** Mesh density: low (40×16) / med (56×20) / high (72×26). Default "low". */
  density?: "low" | "medium" | "high";
  /** Fraction (0–1) of a cell that must be covered by the glyph to light up. */
  coverage?: number;
  /** Mesh line colour. Default brand paper. */
  netColor?: string;
  /** Glyph fill colour. Default brand lime. */
  accent?: string;
  /** Canvas background. Default brand ink. Use "transparent" to inherit. */
  background?: string;
  /** Show the top tape strip across the net. Default true. */
  showTape?: boolean;
  /** Show the side poles holding the net up. Default true. */
  showPoles?: boolean;
  /** Optional className for layout positioning. */
  className?: string;
}

const DENSITY_MAP = {
  low: [40, 16],
  medium: [56, 20],
  high: [72, 26],
} as const;

export default function AnimatedNetLogo({
  width,
  height,
  responsive = false,
  word = "V",
  speed = 1.85,
  amplitude = 15,
  tension = 0.84,
  density = "low",
  coverage = 0.42,
  netColor = "#F3EEE4",
  accent = "#D4FF3A",
  background = "#151210",
  showTape = true,
  showPoles = true,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const [cols, rows] = DENSITY_MAP[density];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Track the current logical canvas size in CSS px. When `responsive` is
    // on, this updates whenever the parent resizes.
    let cssW = width;
    let cssH = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas || !ctx) return;
      if (responsive) {
        const parent = canvas.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            cssW = rect.width;
            cssH = rect.height;
          }
        }
      }
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = responsive ? "100%" : `${cssW}px`;
      canvas.style.height = responsive ? "100%" : `${cssH}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before re-scaling
      ctx.scale(dpr, dpr);
    }
    resize();

    let resizeObserver: ResizeObserver | null = null;
    if (responsive && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    }

    // ---------------------------------------------------------------
    // Build the stencil mask. Each mesh cell is sampled at SS×SS supersample;
    // a cell is lit if `coverage` fraction of its sub-pixels falls inside the
    // glyph. For the single-letter "V" / "V." we skip glyph rendering and
    // build the mask directly from two diagonal stroke bands — cleaner edges
    // than relying on a font that may not yet be loaded when the splash
    // mounts.
    // ---------------------------------------------------------------
    let mask = new Uint8Array(cols * rows);

    function buildMaskV() {
      mask = new Uint8Array(cols * rows);
      const padCols = Math.max(1, Math.floor(cols * 0.14));
      const topRow = Math.max(0, Math.floor(rows * 0.1));
      const botRow = Math.min(rows - 1, Math.floor(rows * 0.9));
      const leftCol = padCols;
      const rightCol = cols - padCols - 1;
      const tipCol = (leftCol + rightCol) / 2;
      const strokeCells = Math.max(2, Math.round(cols * 0.085));
      const span = botRow - topRow;
      for (let j = topRow; j <= botRow; j++) {
        const t = (j - topRow) / span;
        const leftCenter = leftCol + (tipCol - leftCol) * t;
        const rightCenter = rightCol + (tipCol - rightCol) * t;
        for (let i = 0; i < cols; i++) {
          const distL = Math.abs(i - leftCenter);
          const distR = Math.abs(i - rightCenter);
          if (distL < strokeCells / 2 || distR < strokeCells / 2) {
            mask[j * cols + i] = 1;
          }
        }
        if (t > 0.85) {
          const apex = Math.round(tipCol);
          if (apex >= 0 && apex < cols) mask[j * cols + apex] = 1;
        }
      }
      if (word === "V.") {
        const dotCol = rightCol + 1;
        const dotRow = botRow;
        if (dotCol < cols) mask[dotRow * cols + dotCol] = 1;
      }
    }

    function buildMaskGlyph() {
      // Font-based path for multi-letter words. Render into an offscreen
      // canvas at supersampled resolution, then sample coverage per cell.
      const SS = 6;
      const W = cols * SS;
      const H = rows * SS;
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const oc = off.getContext("2d");
      if (!oc) return;
      oc.fillStyle = "#000";
      oc.fillRect(0, 0, W, H);
      oc.fillStyle = "#fff";

      // Binary-search font size that fits the target box.
      const targetW = W * 0.88;
      const targetH = H * 0.78;
      let lo = 4;
      let hi = H * 1.2;
      let pick = lo;
      oc.textBaseline = "alphabetic";
      while (lo <= hi) {
        const mid = (lo + hi) / 2;
        oc.font = `900 ${mid}px "Archivo Black", Archivo, Helvetica, sans-serif`;
        const m = oc.measureText(word);
        const tw = m.width;
        const th =
          (m.actualBoundingBoxAscent || mid * 0.7) +
          (m.actualBoundingBoxDescent || mid * 0.1);
        if (tw <= targetW && th <= targetH) {
          pick = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      oc.font = `900 ${pick}px "Archivo Black", Archivo, Helvetica, sans-serif`;
      oc.textAlign = "center";
      oc.textBaseline = "middle";
      oc.save();
      oc.translate(W / 2, H / 2);
      oc.transform(1, 0, -0.09, 1, 0, 0); // italic skew
      oc.fillText(word, 0, 0);
      oc.restore();

      const img = oc.getImageData(0, 0, W, H).data;
      const cellArea = SS * SS;
      mask = new Uint8Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let filled = 0;
          for (let dy = 0; dy < SS; dy++) {
            for (let dx = 0; dx < SS; dx++) {
              const px = x * SS + dx;
              const py = y * SS + dy;
              const i = (py * W + px) * 4;
              if (img[i] > 128) filled++;
            }
          }
          mask[y * cols + x] = filled / cellArea >= coverage ? 1 : 0;
        }
      }
    }

    if (word === "V" || word === "V.") {
      buildMaskV();
    } else {
      buildMaskGlyph();
    }

    // ---------------------------------------------------------------
    // Per-node wave displacement. Multiple sine waves at different
    // frequencies sum to give the net an organic, wind-blown feel; the
    // tension parameter scales global amplitude (tight nets barely move).
    // Edges damp so the net stays attached to the poles.
    // ---------------------------------------------------------------
    function displacement(ex: number, ey: number, t: number) {
      const damp = 0.25 + (1 - tension) * 0.75;
      const a = amplitude * damp;
      const w1 = Math.sin((ex * 2.8 + t * 0.9) * Math.PI) * a;
      const w2 = Math.sin((ex * 5.4 - t * 1.3 + ey * 1.2) * Math.PI) * (a * 0.4);
      const w3 = Math.cos((ex * 1.2 + t * 0.55 - ey * 0.6) * Math.PI) * (a * 0.35);
      const h1 = Math.sin((ey * 3.2 + t * 0.7) * Math.PI) * (a * 0.25);
      const env = 1 - Math.abs(ey - 0.5) * 0.4;
      return { dx: h1 * env, dy: (w1 + w2 + w3) * env };
    }

    let time = 0;
    let last = performance.now();
    let rafId = 0;
    let cancelled = false;

    function draw() {
      if (!ctx) return;
      const w = cssW;
      const h = cssH;
      ctx.clearRect(0, 0, w, h);
      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }

      const padX = w * 0.08;
      const padY = h * 0.22;
      const innerW = w - padX * 2;
      const innerH = h - padY * 2;
      const t = time;

      const nodes = new Array<{ x: number; y: number }>(
        (cols + 1) * (rows + 1)
      );
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          const ex = i / cols;
          const ey = j / rows;
          const baseX = padX + ex * innerW;
          const baseY = padY + ey * innerH;
          const { dx, dy } = displacement(ex, ey, t);
          nodes[j * (cols + 1) + i] = { x: baseX + dx, y: baseY + dy };
        }
      }

      // Top tape — two parallel strokes above the mesh
      if (showTape) {
        ctx.save();
        ctx.strokeStyle = netColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const n = nodes[i];
          const y = n.y - 6;
          if (i === 0) ctx.moveTo(n.x, y);
          else ctx.lineTo(n.x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const n = nodes[i];
          const y = n.y - 2;
          if (i === 0) ctx.moveTo(n.x, y);
          else ctx.lineTo(n.x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Horizontal mesh lines (slight vertical opacity ramp so the net
      // feels heavier toward the bottom)
      ctx.lineWidth = 1.1;
      for (let j = 0; j <= rows; j++) {
        ctx.strokeStyle = netColor;
        ctx.globalAlpha = 0.55 + (j / rows) * 0.35;
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const n = nodes[j * (cols + 1) + i];
          if (i === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        }
        ctx.stroke();
      }

      // Vertical mesh lines (uniform opacity)
      for (let i = 0; i <= cols; i++) {
        ctx.strokeStyle = netColor;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        for (let j = 0; j <= rows; j++) {
          const n = nodes[j * (cols + 1) + i];
          if (j === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Stencil — fill each lit cell with accent. The cell's four nodes
      // already move with the wave, so the letter ripples with the net.
      ctx.fillStyle = accent;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          if (!mask[j * cols + i]) continue;
          const a = nodes[j * (cols + 1) + i];
          const b = nodes[j * (cols + 1) + i + 1];
          const c = nodes[(j + 1) * (cols + 1) + i + 1];
          const d = nodes[(j + 1) * (cols + 1) + i];
          const cx = (a.x + b.x + c.x + d.x) / 4;
          const cy = (a.y + b.y + c.y + d.y) / 4;
          const s = 0.76;
          const A = { x: cx + (a.x - cx) * s, y: cy + (a.y - cy) * s };
          const B = { x: cx + (b.x - cx) * s, y: cy + (b.y - cy) * s };
          const C = { x: cx + (c.x - cx) * s, y: cy + (c.y - cy) * s };
          const D = { x: cx + (d.x - cx) * s, y: cy + (d.y - cy) * s };
          ctx.beginPath();
          ctx.moveTo(A.x, A.y);
          ctx.lineTo(B.x, B.y);
          ctx.lineTo(C.x, C.y);
          ctx.lineTo(D.x, D.y);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Side poles
      if (showPoles) {
        ctx.strokeStyle = netColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        const leftTop = nodes[0];
        const leftBot = nodes[rows * (cols + 1)];
        const rightTop = nodes[cols];
        const rightBot = nodes[rows * (cols + 1) + cols];
        ctx.beginPath();
        ctx.moveTo(leftTop.x, leftTop.y - 10);
        ctx.lineTo(leftBot.x, leftBot.y + 14);
        ctx.moveTo(rightTop.x, rightTop.y - 10);
        ctx.lineTo(rightBot.x, rightBot.y + 14);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    function tick(now: number) {
      if (cancelled) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      time += dt * speed;
      last = now;
      draw();
      rafId = requestAnimationFrame(tick);
    }

    // Respect prefers-reduced-motion — draw a single frame and stop.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      draw();
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [
    width,
    height,
    responsive,
    word,
    speed,
    amplitude,
    tension,
    density,
    coverage,
    netColor,
    accent,
    background,
    showTape,
    showPoles,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="vamos.net animated logo"
      role="img"
      style={{ display: "block", maxWidth: "100%" }}
    />
  );
}
