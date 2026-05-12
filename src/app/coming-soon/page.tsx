"use client";

import { useEffect, useRef } from "react";
import styles from "./coming-soon.module.css";

/**
 * Soft-launch splash for vamos.net.
 *
 * Faithful React port of the brand-handoff standalone HTML ("Wind on the
 * Net" v0.2 was the earlier study; this one is the locked-in design). The
 * hero is a slowly rotating padel ball with a felt-textured radial body,
 * a wavy white seam, drifting clouds, and five leader-line callouts that
 * fade in and out as their anchor passes the front face.
 *
 * Page chrome: corner register marks (tl/tr/bl/br), eyebrow + wordmark +
 * Instrument Serif tagline at the top, italic "coming soon." plus a build
 * meter at the bottom, and a starfield + vignette wash across the body.
 *
 * Lives outside the (site) route group so it renders standalone — no
 * Header / Footer / MatchModalProvider. The page styles are in a CSS
 * module so the night-theme variable overrides don't leak into the rest
 * of the app, which uses the editorial palette.
 */
export default function ComingSoon() {
  // Refs for everything the animation script touches. Wiring them via refs
  // (vs document.getElementById in a useEffect) keeps the component
  // self-contained and survives re-mounting in dev mode.
  const seamRef = useRef<SVGPathElement | null>(null);
  const seamShRef = useRef<SVGPathElement | null>(null);
  const cloudsRef = useRef<SVGGElement | null>(null);
  const labelsRef = useRef<SVGGElement | null>(null);
  const hudCoordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const R = 250;

    const seamEl = seamRef.current;
    const seamShEl = seamShRef.current;
    const cloudsEl = cloudsRef.current;
    const labelsEl = labelsRef.current;
    const hudCoord = hudCoordRef.current;
    if (!seamEl || !seamShEl || !cloudsEl || !labelsEl) return;

    // ── Surface features ─────────────────────────────────────────────
    // Tennis/padel seam — a sinusoidal latitude that wraps the ball
    // twice per revolution. The amplitude controls how visually deep the
    // seam dips below/above the equator.
    const SEAM_AMP = 38;
    const seamPts: Array<{ lon: number; lat: number }> = [];
    for (let i = 0; i <= 240; i++) {
      const lon = (i / 240) * 360;
      const lat = SEAM_AMP * Math.sin((2 * lon * Math.PI) / 180);
      seamPts.push({ lon, lat });
    }

    // Cloud blobs scattered around the surface. Each has a longitude/
    // latitude, a radius, and a base opacity. They rotate slightly slower
    // than the ball so the layers parallax against each other.
    const clouds = [
      { lon: 18, lat: 28, s: 58, o: 0.55 },
      { lon: 62, lat: -14, s: 42, o: 0.42 },
      { lon: 105, lat: 42, s: 70, o: 0.5 },
      { lon: 138, lat: -28, s: 36, o: 0.46 },
      { lon: 178, lat: 8, s: 64, o: 0.52 },
      { lon: 212, lat: -42, s: 48, o: 0.4 },
      { lon: 248, lat: 18, s: 56, o: 0.48 },
      { lon: 288, lat: -8, s: 44, o: 0.42 },
      { lon: 322, lat: 36, s: 60, o: 0.5 },
      { lon: 350, lat: -22, s: 38, o: 0.4 },
    ];

    // The five "sections" of vamos.net that get called out on the ball
    // with leader lines, anchor dots, and mono coordinate labels. Order
    // matches the displayed numbering (Ø 01 → Ø 05).
    const labelDefs = [
      { name: "live scores", lon: 10, lat: 22 },
      { name: "latest news", lon: 82, lat: -12 },
      { name: "rankings", lon: 154, lat: 28 },
      { name: "reviews", lon: 226, lat: -22 },
      { name: "academy", lon: 298, lat: 6 },
    ];

    // Build label DOM once and reuse the elements on every frame. Each
    // label has: anchor dot (red, on the ball surface), ring (white
    // outline around the anchor), leader polyline, end-cap dot, plus
    // three text lines (Ø NN, name, coord).
    type LabelEls = {
      g: SVGGElement;
      anchor: SVGCircleElement;
      ring: SVGCircleElement;
      lead: SVGPolylineElement;
      endCap: SVGCircleElement;
      num: SVGTextElement;
      name: SVGTextElement;
      coord: SVGTextElement;
    };
    const labelEls: LabelEls[] = labelDefs.map((L, i) => {
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", styles.label);
      g.style.opacity = "0";

      const anchor = document.createElementNS(SVG_NS, "circle");
      anchor.setAttribute("r", "3.5");
      anchor.setAttribute("fill", "#C1443A");
      anchor.setAttribute("stroke", "#FDFCEF");
      anchor.setAttribute("stroke-width", "1.2");
      g.appendChild(anchor);

      const ring = document.createElementNS(SVG_NS, "circle");
      ring.setAttribute("r", "10");
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "#FDFCEF");
      ring.setAttribute("stroke-width", "0.8");
      ring.setAttribute("opacity", "0.6");
      g.appendChild(ring);

      const lead = document.createElementNS(SVG_NS, "polyline");
      lead.setAttribute("fill", "none");
      lead.setAttribute("stroke", "#F3EEE4");
      lead.setAttribute("stroke-width", "1");
      lead.setAttribute("opacity", "0.85");
      g.appendChild(lead);

      const endCap = document.createElementNS(SVG_NS, "circle");
      endCap.setAttribute("r", "2");
      endCap.setAttribute("fill", "#F3EEE4");
      g.appendChild(endCap);

      // Children's classes don't scope through CSS modules (the label
      // children sit inside SVG, so we can't compose their classes the
      // same way we do for HTML). Inline the typography directly so
      // styling survives without depending on a module class match.
      const num = document.createElementNS(SVG_NS, "text");
      num.setAttribute("font-size", "10");
      num.setAttribute("fill", "#C1443A");
      num.setAttribute("font-family", "var(--mono)");
      num.setAttribute("letter-spacing", "0.16em");
      num.setAttribute("text-transform", "uppercase");
      num.textContent = "Ø " + String(i + 1).padStart(2, "0");
      g.appendChild(num);

      const name = document.createElementNS(SVG_NS, "text");
      name.setAttribute("font-size", "24");
      name.setAttribute("fill", "#F3EEE4");
      name.setAttribute("font-family", "var(--sans)");
      name.setAttribute("font-weight", "800");
      name.setAttribute("font-style", "italic");
      name.setAttribute("letter-spacing", "-0.02em");
      name.setAttribute("text-transform", "lowercase");
      name.textContent = L.name;
      g.appendChild(name);

      const coord = document.createElementNS(SVG_NS, "text");
      coord.setAttribute("font-size", "9");
      coord.setAttribute("fill", "rgba(243,238,228,0.55)");
      coord.setAttribute("font-family", "var(--mono)");
      coord.setAttribute("letter-spacing", "0.16em");
      coord.setAttribute("text-transform", "uppercase");
      g.appendChild(coord);

      labelsEl.appendChild(g);
      return { g, anchor, ring, lead, endCap, num, name, coord };
    });

    // ── Projection ───────────────────────────────────────────────────
    // Map a (lon, lat) on the sphere to 2D screen coords by treating the
    // ball as a unit sphere of radius R viewed straight on (no tilt).
    // The Z value is preserved so we can do simple front/back culling.
    function project(lon: number, lat: number, r: number) {
      const lo = (lon * Math.PI) / 180;
      const la = (lat * Math.PI) / 180;
      const cL = Math.cos(la);
      return {
        x: r * cL * Math.sin(lo),
        y: -r * Math.sin(la),
        z: r * cL * Math.cos(lo),
      };
    }

    function ss(edge0: number, edge1: number, x: number) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    function formatCoord(lat: number, lon: number) {
      const ns = lat >= 0 ? "N" : "S";
      const ew = lon >= 0 && lon < 180 ? "E" : "W";
      const absLat = Math.abs(lat);
      const absLon = lon > 180 ? 360 - lon : lon;
      const latD = Math.floor(absLat);
      const latM = Math.floor((absLat - latD) * 60);
      const lonD = Math.floor(absLon);
      const lonM = Math.floor((absLon - lonD) * 60);
      return (
        ns +
        " " +
        String(latD).padStart(2, "0") +
        "°" +
        String(latM).padStart(2, "0") +
        "′  " +
        ew +
        " " +
        String(lonD).padStart(3, "0") +
        "°" +
        String(lonM).padStart(2, "0") +
        "′"
      );
    }

    // ── Animation loop ───────────────────────────────────────────────
    // Speeds: ball at 7°/s (≈51s per revolution); clouds slightly slower
    // so they parallax against the body. Stored as let so we can pause
    // on prefers-reduced-motion.
    let theta = 0;
    let last = performance.now();
    const ROT_SPEED = 7;
    const CLOUD_SPEED = 5.2;
    let rafId = 0;
    let cancelled = false;

    // Honour user motion preferences — if reduced motion is requested,
    // render a single static frame and stop. The page still looks like
    // the brand splash, just without rotation.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame(now: number) {
      if (cancelled) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!prefersReducedMotion) {
        theta = (theta + dt * ROT_SPEED) % 360;
      }
      const cloudTheta = (theta * (CLOUD_SPEED / ROT_SPEED)) % 360;

      // ── Seam ──
      // Walk the seam points in order. Each point is projected; if the
      // point sits on the front hemisphere (z>4 with a tiny epsilon to
      // avoid stitching artefacts at the rim) we emit a line command,
      // otherwise we pen-up and pick up on the next visible run.
      let d = "";
      let dSh = "";
      let pen = false;
      for (const p of seamPts) {
        const pr = project(p.lon + theta, p.lat, R);
        if (pr.z > 4) {
          const cmd = pen ? "L" : "M";
          d += cmd + pr.x.toFixed(1) + " " + pr.y.toFixed(1) + " ";
          // Slight down-right offset for the darker shadow stroke.
          dSh +=
            cmd + (pr.x + 1.5).toFixed(1) + " " + (pr.y + 2).toFixed(1) + " ";
          pen = true;
        } else {
          pen = false;
        }
      }
      seamEl!.setAttribute("d", d);
      seamShEl!.setAttribute("d", dSh);

      // ── Clouds ──
      // Re-rendered as innerHTML once per frame; ten ellipses isn't enough
      // to make per-element diffing worthwhile, and a single string write
      // beats ten setAttribute calls.
      let cloudHTML = "";
      for (const c of clouds) {
        const pr = project(c.lon + cloudTheta, c.lat, R);
        if (pr.z > 0) {
          const front = pr.z / R;
          const op = c.o * Math.pow(front, 0.6);
          const scaleX = 0.55 + 0.45 * front;
          cloudHTML +=
            '<ellipse cx="' +
            pr.x.toFixed(1) +
            '" cy="' +
            pr.y.toFixed(1) +
            '" rx="' +
            (c.s * scaleX).toFixed(1) +
            '" ry="' +
            (c.s * 0.55).toFixed(1) +
            '" fill="#FDFCEF" opacity="' +
            op.toFixed(2) +
            '"/>';
        }
      }
      cloudsEl!.innerHTML = cloudHTML;

      // ── Labels ──
      // Each label fades in only when its anchor is BOTH front-facing AND
      // far enough to the side that the leader line has a useful angle.
      // The label with the highest z value (most "central") drives the
      // HUD coord readout in the bottom-left corner.
      let pickedHud: string | null = null;
      let pickedZ = -1;
      labelDefs.forEach((L, i) => {
        const el = labelEls[i];
        const lonAdj = L.lon + theta;
        const pr = project(lonAdj, L.lat, R);
        const front = pr.z / R;
        const sideAbs = Math.abs(pr.x) / R;

        const visFront = ss(0.1, 0.55, front);
        const visSide = ss(0.32, 0.55, sideAbs);
        const o = visFront * visSide;
        el.g.style.opacity = o.toFixed(2);

        // Position. The leader line starts at the anchor, kinks outward
        // along the radial direction, then runs horizontally to the
        // label text. Direction (left vs right) flips based on pr.x sign
        // so callouts always trail away from the ball.
        const dir = pr.x >= 0 ? 1 : -1;
        const sx = pr.x;
        const sy = pr.y;
        const radial = R + 18;
        const ang = Math.atan2(sy, sx);
        const rx = Math.cos(ang) * radial;
        const ry = Math.sin(ang) * radial;
        const ext = 70 + 30 * sideAbs;
        const ex = rx + dir * ext;
        const ey = ry;

        el.anchor.setAttribute("cx", String(sx));
        el.anchor.setAttribute("cy", String(sy));
        el.ring.setAttribute("cx", String(sx));
        el.ring.setAttribute("cy", String(sy));

        el.lead.setAttribute(
          "points",
          sx + "," + sy + " " + rx + "," + ry + " " + ex + "," + ey
        );
        el.endCap.setAttribute("cx", String(ex));
        el.endCap.setAttribute("cy", String(ey));

        const txAnchor = dir > 0 ? "start" : "end";
        const tx = ex + dir * 8;
        el.num.setAttribute("x", String(tx));
        el.num.setAttribute("y", String(ey - 12));
        el.num.setAttribute("text-anchor", txAnchor);
        el.name.setAttribute("x", String(tx));
        el.name.setAttribute("y", String(ey + 8));
        el.name.setAttribute("text-anchor", txAnchor);
        el.coord.setAttribute("x", String(tx));
        el.coord.setAttribute("y", String(ey + 24));
        el.coord.setAttribute("text-anchor", txAnchor);
        el.coord.textContent = formatCoord(
          L.lat,
          ((lonAdj % 360) + 360) % 360
        );

        if (o > 0.3 && pr.z > pickedZ) {
          pickedZ = pr.z;
          pickedHud = el.coord.textContent;
        }
      });

      // HUD coord readout: when a label is on-screen, mirror its coord;
      // otherwise fall back to a scanning-style "lat 00°00′ · lon NNN°00′"
      // that ticks with the rotation.
      if (hudCoord) {
        hudCoord.textContent = pickedHud
          ? (pickedHud as string).toLowerCase()
          : "lat 00°00′ · lon " +
            String(Math.floor(theta)).padStart(3, "0") +
            "°00′";
      }

      if (prefersReducedMotion) return; // single static frame
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      // Clean up any label nodes we appended so HMR / route changes
      // don't accumulate duplicates.
      while (labelsEl.firstChild) {
        labelsEl.removeChild(labelsEl.firstChild);
      }
    };
  }, []);

  return (
    <main className={styles.scope}>
      {/* Corner register marks — newsroom/instrument flavour. Hidden on
          narrow viewports via the module's @media query. */}
      <div className={`${styles.corner} ${styles.tl}`}>
        <span className={styles.line}>
          vamos<span className={styles.accent}>.</span>net
        </span>
        <span className={styles.line}>stn · 01</span>
      </div>
      <div className={`${styles.corner} ${styles.tr}`}>
        <span className={styles.line}>sector · padel</span>
        <span className={styles.line}>v 2026.05</span>
      </div>
      <div className={`${styles.corner} ${styles.bl}`}>
        <span className={styles.line}>
          <span className={styles.blink}>●</span> live · scanning
        </span>
        <span className={styles.line} ref={hudCoordRef}>
          lat 00°00′ · lon 000°00′
        </span>
      </div>
      <div className={`${styles.corner} ${styles.br}`}>
        <span className={styles.line}>push · q4 2026</span>
        <span className={styles.line}>
          build · <span className={styles.accent}>b-014</span>
        </span>
      </div>

      <div className={styles.stage}>
        {/* Header — eyebrow / wordmark / tagline */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span>vamos</span>
            <span className={styles.dot}></span>
            <span>est. 2026</span>
          </div>
          <div className={styles.wordmark}>
            <span>vamos</span>
            <span className={styles.wordmarkDot}>.</span>
            <span className={styles.wordmarkNet}>net</span>
          </div>
          <div className={styles.tagline}>
            The <span className={styles.em}>world</span> of padel
            <span style={{ color: "var(--red)" }}>.</span>
          </div>
        </div>

        {/* Hero — the rotating padel ball. */}
        <div className={styles.ballWrap}>
          <svg
            className={styles.ballSvg}
            viewBox="-400 -400 800 800"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="vamos.net — coming soon"
          >
            <defs>
              {/* Felt body — radial yellow-green with five stops so the
                  shading reads as a properly lit sphere rather than a
                  flat circle. */}
              <radialGradient id="csBallBody" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#F4FF92" />
                <stop offset="35%" stopColor="#D8F04A" />
                <stop offset="70%" stopColor="#A4C620" />
                <stop offset="92%" stopColor="#5A7A10" />
                <stop offset="100%" stopColor="#2D3F08" />
              </radialGradient>
              {/* Diffuse top-left highlight — soft, not glossy. */}
              <radialGradient id="csHilite" cx="32%" cy="24%" r="45%">
                <stop offset="0%" stopColor="rgba(255,255,235,0.22)" />
                <stop offset="55%" stopColor="rgba(255,255,235,0.06)" />
                <stop offset="100%" stopColor="rgba(255,255,235,0)" />
              </radialGradient>
              {/* Terminator — darker side of the sphere, multiplied. */}
              <radialGradient id="csTerminator" cx="70%" cy="78%" r="55%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="55%" stopColor="rgba(0,0,0,0.20)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
              </radialGradient>
              {/* Felt nap — fractal noise composited over the ball gives
                  the surface its slightly fuzzy padel-ball texture. */}
              <filter id="csFeltNoise" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="1.6"
                  numOctaves="2"
                  seed="3"
                />
                <feColorMatrix
                  values="0 0 0 0 0.95
                          0 0 0 0 1.0
                          0 0 0 0 0.4
                          0 0 0 0.45 0"
                />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
              {/* Cloud blur — softens the cloud ellipses so they read as
                  atmospheric drift rather than hard shapes. */}
              <filter id="csCloudBlur">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              {/* Outer atmosphere ring — faint lime glow at the rim. */}
              <radialGradient id="csAtmos" cx="50%" cy="50%" r="50%">
                <stop offset="85%" stopColor="rgba(212,255,58,0)" />
                <stop offset="95%" stopColor="rgba(212,255,58,0.25)" />
                <stop offset="100%" stopColor="rgba(212,255,58,0)" />
              </radialGradient>
              <clipPath id="csBallClip">
                <circle cx="0" cy="0" r="250" />
              </clipPath>
            </defs>

            {/* Atmosphere halo */}
            <circle cx="0" cy="0" r="278" fill="url(#csAtmos)" />
            {/* Ball body */}
            <circle cx="0" cy="0" r="250" fill="url(#csBallBody)" />
            {/* Felt nap noise overlay */}
            <circle
              cx="0"
              cy="0"
              r="250"
              filter="url(#csFeltNoise)"
              opacity="0.6"
            />

            {/* Animated surface, clipped to the ball circle so seam + clouds
                can't draw outside the body. */}
            <g clipPath="url(#csBallClip)">
              <path
                ref={seamShRef}
                fill="none"
                stroke="#3A4A08"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.32"
              />
              <path
                ref={seamRef}
                fill="none"
                stroke="#FDFCEF"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.92"
              />
              <g ref={cloudsRef} filter="url(#csCloudBlur)" />
            </g>

            {/* Terminator shading — multiplied to darken the lower-right */}
            <circle
              cx="0"
              cy="0"
              r="250"
              fill="url(#csTerminator)"
              style={{ mixBlendMode: "multiply" }}
            />
            {/* Soft top-left highlight */}
            <circle cx="0" cy="0" r="250" fill="url(#csHilite)" />

            {/* Equator + axis ticks — subtle technical overlay */}
            <g opacity="0.2" stroke="#FDFCEF" fill="none">
              <ellipse
                cx="0"
                cy="0"
                rx="250"
                ry="6"
                strokeWidth="0.6"
                strokeDasharray="3 5"
              />
              <line x1="0" y1="-260" x2="0" y2="-244" strokeWidth="1" />
              <line x1="0" y1="244" x2="0" y2="260" strokeWidth="1" />
            </g>

            {/* Leader lines + labels, populated by the animation effect. */}
            <g ref={labelsRef} />
          </svg>
        </div>

        {/* Footer — italic 'coming soon.' + a build meter. */}
        <div className={styles.footer}>
          <div className={styles.coming}>coming soon</div>
          <div className={styles.meter}>
            <span>build</span>
            <span className={styles.bar}></span>
            <span>58%</span>
          </div>
        </div>
      </div>
    </main>
  );
}
