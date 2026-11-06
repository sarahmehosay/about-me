// Original line-art illustrations of the developer (a girl with glasses and long hair).
// Colors come from CSS variables, so both drawings follow the light/dark theme.
const ink = { stroke: 'var(--ink)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
const thin = { ...ink, strokeWidth: 2.2 }

function Gradients({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: 'var(--ill-a)' }} />
        <stop offset="1" style={{ stopColor: 'var(--ill-b)' }} />
      </linearGradient>
    </defs>
  )
}

// Head, hair and face, centered on (cx, cy). Shared by both drawings so the character matches.
function Girl({ cx, cy, gid }) {
  const x = (d) => cx + d
  const y = (d) => cy + d
  return (
    <g>
      {/* long hair behind the shoulders */}
      <path d={`M${x(-46)} ${y(-2)} C${x(-50)} ${y(-62)} ${x(50)} ${y(-62)} ${x(46)} ${y(-2)} L${x(56)} ${y(82)} C${x(40)} ${y(92)} ${x(20)} ${y(88)} ${x(16)} ${y(72)} L${x(12)} ${y(30)} L${x(-12)} ${y(30)} L${x(-16)} ${y(72)} C${x(-20)} ${y(88)} ${x(-40)} ${y(92)} ${x(-56)} ${y(82)} Z`}
        fill="var(--hair)" {...ink} />
      <rect x={x(-11)} y={y(28)} width="22" height="28" rx="7" fill="var(--skin)" {...ink} />
      <circle cx={cx} cy={cy} r="42" fill="var(--skin)" {...ink} />
      {/* side-swept bangs and a hair clip */}
      <path d={`M${x(-42)} ${y(-2)} C${x(-46)} ${y(-44)} ${x(46)} ${y(-50)} ${x(42)} ${y(-4)} C${x(30)} ${y(-22)} ${x(8)} ${y(-30)} ${x(-10)} ${y(-20)} C${x(-22)} ${y(-14)} ${x(-34)} ${y(-8)} ${x(-42)} ${y(-2)} Z`}
        fill="var(--hair)" {...ink} />
      <rect x={x(22)} y={y(-34)} width="16" height="7" rx="3.5" transform={`rotate(28 ${x(30)} ${y(-30)})`} fill={`url(#${gid}-a)`} />
      {/* glasses, eyes, smile, blush, earrings */}
      <circle cx={x(-16)} cy={y(4)} r="10.5" fill="none" {...thin} />
      <circle cx={x(16)} cy={y(4)} r="10.5" fill="none" {...thin} />
      <path d={`M${x(-5.5)} ${y(3)} Q${cx} ${y(0)} ${x(5.5)} ${y(3)}`} fill="none" {...thin} />
      <circle cx={x(-16)} cy={y(5)} r="2.6" fill="var(--ink)" />
      <circle cx={x(16)} cy={y(5)} r="2.6" fill="var(--ink)" />
      <path d={`M${x(-9)} ${y(22)} Q${cx} ${y(30)} ${x(9)} ${y(22)}`} fill="none" {...thin} />
      <circle cx={x(-28)} cy={y(18)} r="5" fill="var(--blush)" />
      <circle cx={x(28)} cy={y(18)} r="5" fill="var(--blush)" />
      <circle cx={x(-42)} cy={y(16)} r="3.5" fill={`url(#${gid}-a)`} />
      <circle cx={x(42)} cy={y(16)} r="3.5" fill={`url(#${gid}-a)`} />
    </g>
  )
}

// A small wavy "point cloud" made of dots.
function PointCloud({ x0, y0, cols = 10, rows = 6, gap = 15 }) {
  const dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * gap + (r % 2) * (gap / 2)
      const y = y0 + r * (gap * 0.8) - 10 * Math.sin((c + r * 0.6) / 2)
      dots.push(<circle key={`${r}-${c}`} cx={x} cy={y} r={2.6} fill="var(--accent)" opacity={0.25 + r * 0.12} />)
    }
  }
  return <g>{dots}</g>
}

function Pin({ x, y, s = 1, gid }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 28C0 28-18 10-18 0a18 18 0 0 1 36 0C18 10 0 28 0 28z" fill={`url(#${gid}-a)`} {...ink} />
      <circle cx="0" cy="0" r="6" fill="var(--surface)" />
    </g>
  )
}

export function HeroIllustration() {
  const g = 'hero-ill'
  return (
    <svg viewBox="0 0 520 420" className="illustration" role="img" aria-label="Illustration of a developer working on a laptop at her desk, with a map and a point cloud around her">
      <Gradients id={g} />
      <ellipse cx="270" cy="235" rx="215" ry="170" fill="var(--accent-soft)" />
      {/* map on the wall */}
      <rect x="52" y="70" width="128" height="96" rx="10" fill="var(--surface)" {...ink} />
      <path d="M66 140c18-14 30 6 48-6s26-18 52-4M66 112c22-10 34 8 54-4s24-12 46-2" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <Pin x={128} y={98} s={0.75} gid={g} />
      {/* point cloud */}
      <PointCloud x0={340} y0={80} />
      {/* chair */}
      <rect x="172" y="190" width="176" height="170" rx="44" fill={`url(#${g}-a)`} {...ink} />
      <Girl cx={260} cy={176} gid={g} />
      {/* body */}
      <path d="M196 304c0-46 18-64 64-64s64 18 64 64z" fill="var(--surface)" {...ink} />
      <path d="M248 240l12 14 12-14" fill="none" {...thin} />
      {/* desk */}
      <rect x="60" y="300" width="400" height="14" rx="7" fill="var(--surface)" {...ink} />
      <path d="M96 314v84M424 314v84M30 398h460" fill="none" {...ink} />
      {/* laptop (back of the lid) with a globe logo */}
      <path d="M206 262c-12 12-14 26-8 34M314 262c12 12 14 26 8 34" fill="none" {...ink} />
      <rect x="216" y="256" width="88" height="46" rx="7" fill={`url(#${g}-a)`} {...ink} />
      <g stroke="var(--on-accent)" strokeWidth="2" fill="none">
        <circle cx="260" cy="279" r="9" /><ellipse cx="260" cy="279" rx="3.6" ry="9" /><path d="M251 279h18" />
      </g>
      <rect x="200" y="298" width="120" height="7" rx="3.5" fill="var(--ink)" />
      <circle cx="206" cy="295" r="8.5" fill="var(--skin)" {...ink} />
      <circle cx="314" cy="295" r="8.5" fill="var(--skin)" {...ink} />
      {/* plant */}
      <path d="M124 268c-14-26-26-32-30-42 16-2 30 14 30 42zM124 268c4-30 16-42 28-46 2 16-10 32-28 46zM124 268c-2-22 0-40 4-54" fill="var(--accent-soft)" {...thin} />
      <path d="M102 300l6-32h32l6 32z" fill={`url(#${g}-a)`} {...ink} />
      {/* cup with a pen and a sticky note */}
      <path d="M372 266h28v34h-28z" fill="var(--surface)" {...ink} />
      <path d="M380 266l-6-22M392 266l8-18" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="414" y="280" width="26" height="20" rx="3" fill="var(--accent-soft)" {...thin} transform="rotate(-8 427 290)" />
      {/* sparkles */}
      <path d="M440 210l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={`url(#${g}-a)`} />
      <path d="M200 70l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="var(--accent)" opacity=".6" />
    </svg>
  )
}

export function AboutIllustration() {
  const g = 'about-ill'
  return (
    <svg viewBox="0 0 440 380" className="illustration" role="img" aria-label="Illustration of the developer holding a tablet with a map, next to a globe">
      <Gradients id={g} />
      <circle cx="240" cy="200" r="160" fill="var(--accent-soft)" />
      {/* globe on a stand */}
      <circle cx="96" cy="196" r="52" fill="var(--surface)" {...ink} />
      <ellipse cx="96" cy="196" rx="22" ry="52" fill="none" {...thin} />
      <path d="M46 180h100M46 212h100" fill="none" {...thin} />
      <path d="M70 162c10-6 22 0 18 10s-16 8-20 0zM104 214c12-4 22 6 14 14s-20 2-14-14z" fill={`url(#${g}-a)`} />
      <path d="M38 196a58 58 0 0 0 116 0" fill="none" {...ink} />
      <path d="M96 254v28M66 286h60" fill="none" {...ink} />
      {/* floating pins */}
      <Pin x={372} y={96} s={0.7} gid={g} />
      <Pin x={402} y={164} s={0.45} gid={g} />
      <Girl cx={262} cy={204} gid={g} />
      {/* body (cropped at the bottom) */}
      <path d="M182 380v-40c0-48 22-70 80-70s80 22 80 70v40" fill="var(--surface)" {...ink} />
      {/* tablet with a map and a pin */}
      <g transform="rotate(-8 262 322)">
        <rect x="208" y="290" width="108" height="72" rx="9" fill="var(--surface)" {...ink} />
        <rect x="216" y="298" width="92" height="56" rx="5" fill="var(--accent-soft)" />
        <path d="M218 340c16-12 28 4 44-6s24-14 44-2M218 316c18-8 30 6 46-2s22-10 42-2" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <Pin x={262} y={314} s={0.42} gid={g} />
      </g>
      <circle cx="206" cy="334" r="10" fill="var(--skin)" {...ink} />
      <circle cx="318" cy="318" r="10" fill="var(--skin)" {...ink} />
      <path d="M186 60l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={`url(#${g}-a)`} />
    </svg>
  )
}
