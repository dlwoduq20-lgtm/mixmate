import type { Cocktail } from '../types'

// MIXMATE draws every cocktail as a consistent, bright, original illustration
// instead of stock photography — same lighting logic, same glass geometry
// language, unique liquid color + garnish per drink so the grid still reads
// as colorful and varied the way real photography would.

const BG_PALETTE = [
  ['#FFE8D6', '#FFD3B0'],
  ['#FDE7EF', '#FBC9DC'],
  ['#E6F4F1', '#C7E8E1'],
  ['#FFF3D6', '#FCE1A8'],
  ['#EAE7FB', '#D6CFF7'],
  ['#E3F2E4', '#C4E6C9'],
  ['#FFE3E3', '#FFC2C2'],
  ['#E8F0FE', '#CBDFFB'],
]

const SPIRIT_LIQUID: Record<string, string> = {
  Gin: '#BFE6D9',
  Vodka: '#DCEBFA',
  Rum: '#E8A649',
  Whiskey: '#B5652B',
  Tequila: '#EFC873',
  Mezcal: '#D9A85C',
  Brandy: '#8A4A2A',
  Liqueur: '#E0708A',
  Wine: '#F3B6C4',
  Multiple: '#E8734A',
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function liquidColor(c: Cocktail): string {
  const base = SPIRIT_LIQUID[c.baseSpirit] ?? '#E8A649'
  if (c.flavorProfile.bitter >= 3) return mix(base, '#B34A2E', 0.35)
  if (c.flavorProfile.sweet >= 4) return mix(base, '#F2588A', 0.2)
  return base
}

function mix(a: string, b: string, t: number): string {
  const pa = hexToRgb(a)
  const pb = hexToRgb(b)
  const r = Math.round(pa.r + (pb.r - pa.r) * t)
  const g = Math.round(pa.g + (pb.g - pa.g) * t)
  const bl = Math.round(pa.b + (pb.b - pa.b) * t)
  return `rgb(${r},${g},${bl})`
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

type ShapeKey = 'martini' | 'coupe' | 'rocks' | 'tall' | 'flute' | 'wine' | 'mug' | 'tiki'

function shapeFor(glass: string): ShapeKey {
  const g = glass.toLowerCase()
  if (g.includes('martini')) return 'martini'
  if (g.includes('coupe')) return 'coupe'
  if (g.includes('flute')) return 'flute'
  if (g.includes('wine')) return 'wine'
  if (g.includes('copper mug') || g.includes('mug')) return 'mug'
  if (g.includes('tiki')) return 'tiki'
  if (g.includes('rocks') || g.includes('shot') || g.includes('clay')) return 'rocks'
  return 'tall'
}

function GarnishIcon({ garnish, cx, tone }: { garnish: string; cx: number; tone: string }) {
  const g = garnish.toLowerCase()
  if (g === 'none' || !g) return null
  if (g.includes('mint') || g.includes('basil')) {
    return (
      <g transform={`translate(${cx - 10} 14)`}>
        <path d="M0 14 Q4 2 14 0" stroke="#3F8F5C" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="3" cy="10" rx="4" ry="2.4" fill="#4CA968" transform="rotate(-30 3 10)" />
        <ellipse cx="8" cy="4" rx="4.2" ry="2.5" fill="#57B873" transform="rotate(-10 8 4)" />
        <ellipse cx="14" cy="0.5" rx="3.8" ry="2.2" fill="#4CA968" transform="rotate(15 14 0.5)" />
      </g>
    )
  }
  if (g.includes('cherry')) {
    return (
      <g transform={`translate(${cx} 12)`}>
        <path d="M0 0 L6 -10" stroke="#8A4A2A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="4" r="5" fill="#E23B4E" />
        <circle cx="-2" cy="2.4" r="1.4" fill="#FF8A93" opacity="0.7" />
      </g>
    )
  }
  if (g.includes('olive')) {
    return (
      <g transform={`translate(${cx} 10)`}>
        <line x1="0" y1="-14" x2="0" y2="4" stroke="#B08A57" strokeWidth="1.6" />
        <ellipse cx="0" cy="6" rx="5" ry="3.6" fill="#7C9A4A" />
        <circle cx="0" cy="6" r="1.3" fill="#C94F3F" />
      </g>
    )
  }
  if (g.includes('orange peel') || g.includes('orange twist')) {
    return (
      <g transform={`translate(${cx - 6} 6)`}>
        <path d="M0 0 Q10 2 8 12 Q6 18 -2 16" stroke="#E8834A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  if (g.includes('lemon twist')) {
    return (
      <g transform={`translate(${cx - 6} 6)`}>
        <path d="M0 0 Q10 2 8 12 Q6 18 -2 16" stroke="#F2CA4E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  if (g.includes('wheel') || g.includes('wedge')) {
    const c = g.includes('lime') ? '#8FC24A' : g.includes('grapefruit') ? '#F17E7E' : g.includes('pineapple') ? '#F2CA4E' : '#F2CA4E'
    return (
      <g transform={`translate(${cx} 10)`}>
        <circle cx="0" cy="0" r="8" fill={c} opacity="0.9" />
        <circle cx="0" cy="0" r="5" fill="#FFF8E8" opacity="0.85" />
        {[0, 60, 120].map((a) => (
          <line key={a} x1="0" y1="0" x2={5 * Math.cos((a * Math.PI) / 180)} y2={5 * Math.sin((a * Math.PI) / 180)} stroke={c} strokeWidth="1" />
        ))}
      </g>
    )
  }
  if (g.includes('rim')) return null
  if (g.includes('nutmeg') || g.includes('cinnamon')) {
    return (
      <g transform={`translate(${cx - 8} 8)`}>
        <rect x="0" y="0" width="14" height="3" rx="1.5" fill="#8A5A2A" transform="rotate(-20 7 1.5)" />
      </g>
    )
  }
  return (
    <g transform={`translate(${cx} 10)`}>
      <circle cx="0" cy="0" r="3.5" fill={tone} />
    </g>
  )
}

function IceCubes({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.55">
      <rect x={x} y={y} width="12" height="12" rx="2.5" fill="white" transform={`rotate(-8 ${x + 6} ${y + 6})`} />
      <rect x={x + 13} y={y + 4} width="11" height="11" rx="2.5" fill="white" transform={`rotate(10 ${x + 18} ${y + 9})`} />
    </g>
  )
}

export default function CocktailGlass({
  cocktail,
  displayName,
  size = 160,
  rounded = true,
  className = '',
}: {
  cocktail: Cocktail
  // Localized name for the aria-label. Defaults to the English cocktail.name
  // when the caller doesn't pass one.
  displayName?: string
  size?: number
  rounded?: boolean
  className?: string
}) {
  const name = displayName ?? cocktail.name
  const hash = hashStr(cocktail.id)
  const bg = BG_PALETTE[hash % BG_PALETTE.length]
  const liquid = liquidColor(cocktail)
  const shape = shapeFor(cocktail.glass)
  const fizzy = cocktail.category === 'Highball' || cocktail.category === 'Sparkling' || cocktail.tags.includes('Refreshing')
  const gid = `liq-${cocktail.id}`
  const bgid = `bg-${cocktail.id}`

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${name} illustration`}
    >
      <defs>
        <radialGradient id={bgid} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </radialGradient>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquid} stopOpacity="0.85" />
          <stop offset="100%" stopColor={liquid} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="160" height="160" rx={rounded ? 20 : 0} fill={`url(#${bgid})`} />

      {shape === 'martini' && (
        <g>
          <line x1="80" y1="98" x2="80" y2="128" stroke="#D8CFC8" strokeWidth="3" />
          <ellipse cx="80" cy="130" rx="20" ry="4" fill="#D8CFC8" />
          <path d="M46 62 L114 62 L80 100 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" strokeLinejoin="round" />
          <path d="M52 66 L108 66 L80 92 Z" fill={`url(#${gid})`} />
          <GarnishIcon garnish={cocktail.garnish} cx={92} tone={liquid} />
        </g>
      )}

      {shape === 'coupe' && (
        <g>
          <line x1="80" y1="94" x2="80" y2="126" stroke="#D8CFC8" strokeWidth="3" />
          <ellipse cx="80" cy="128" rx="18" ry="4" fill="#D8CFC8" />
          <path d="M44 62 Q44 96 80 96 Q116 96 116 62 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" />
          <path d="M50 66 Q50 88 80 88 Q110 88 110 66 Z" fill={`url(#${gid})`} />
          <GarnishIcon garnish={cocktail.garnish} cx={92} tone={liquid} />
        </g>
      )}

      {shape === 'flute' && (
        <g>
          <line x1="80" y1="116" x2="80" y2="128" stroke="#D8CFC8" strokeWidth="3" />
          <ellipse cx="80" cy="130" rx="16" ry="3.5" fill="#D8CFC8" />
          <path d="M64 40 Q60 90 68 114 L92 114 Q100 90 96 40 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" strokeLinejoin="round" />
          <path d="M67 56 Q64 92 70 110 L90 110 Q96 92 93 56 Z" fill={`url(#${gid})`} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={80 + (i % 2 === 0 ? -3 : 4)} cy={100 - i * 14} r="1.4" fill="white" opacity="0.8" />
          ))}
          <GarnishIcon garnish={cocktail.garnish} cx={92} tone={liquid} />
        </g>
      )}

      {shape === 'wine' && (
        <g>
          <line x1="80" y1="100" x2="80" y2="128" stroke="#D8CFC8" strokeWidth="3" />
          <ellipse cx="80" cy="130" rx="20" ry="4" fill="#D8CFC8" />
          <path d="M48 54 Q46 100 80 102 Q114 100 112 54 Q112 46 80 46 Q48 46 48 54 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" />
          <path d="M54 70 Q54 94 80 96 Q106 94 106 70 Z" fill={`url(#${gid})`} />
          <GarnishIcon garnish={cocktail.garnish} cx={94} tone={liquid} />
        </g>
      )}

      {shape === 'rocks' && (
        <g>
          <path d="M50 60 L110 60 L104 122 Q104 128 98 128 L62 128 Q56 128 56 122 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" strokeLinejoin="round" />
          <path d="M55 78 L105 78 L100 122 Q100 124 98 124 L62 124 Q60 124 60 122 Z" fill={`url(#${gid})`} />
          <IceCubes x={64} y={86} />
          <GarnishIcon garnish={cocktail.garnish} cx={94} tone={liquid} />
        </g>
      )}

      {shape === 'mug' && (
        <g>
          <path d="M52 52 L104 52 L100 122 Q100 128 94 128 L62 128 Q56 128 52 122 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" />
          <path d="M100 68 Q122 68 122 88 Q122 108 100 106" fill="none" stroke="#D8CFC8" strokeWidth="4" />
          <path d="M57 68 L99 68 L96 122 Q96 124 94 124 L62 124 Q60 124 60 122 Z" fill={`url(#${gid})`} />
          {fizzy && <IceCubes x={64} y={76} />}
          <GarnishIcon garnish={cocktail.garnish} cx={92} tone={liquid} />
        </g>
      )}

      {shape === 'tiki' && (
        <g>
          <path d="M56 52 Q52 90 58 122 Q60 128 66 128 L94 128 Q100 128 102 122 Q108 90 104 52 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" />
          <path d="M60 66 Q57 92 62 118 Q63 122 67 122 L93 122 Q97 122 98 118 Q103 92 100 66 Z" fill={`url(#${gid})`} />
          <circle cx="70" cy="72" r="2.6" fill="#8A5A2A" />
          <circle cx="90" cy="72" r="2.6" fill="#8A5A2A" />
          <path d="M72 84 Q80 90 88 84" stroke="#8A5A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <GarnishIcon garnish={cocktail.garnish} cx={94} tone={liquid} />
        </g>
      )}

      {shape === 'tall' && (
        <g>
          <path d="M58 46 L102 46 L98 126 Q98 130 94 130 L66 130 Q62 130 62 126 Z" fill="none" stroke="#D8CFC8" strokeWidth="3" />
          <path d="M63 62 L97 62 L94 126 Q94 127 93 127 L67 127 Q66 127 66 126 Z" fill={`url(#${gid})`} />
          {fizzy &&
            [0, 1, 2].map((i) => (
              <circle key={i} cx={80 + (i - 1) * 8} cy={112 - i * 16} r="1.6" fill="white" opacity="0.75" />
            ))}
          <IceCubes x={68} y={70} />
          <GarnishIcon garnish={cocktail.garnish} cx={92} tone={liquid} />
        </g>
      )}
    </svg>
  )
}
