<template>
  <div class="visual-container" v-if="visual && vars">

    <!-- Shape diagrams -->
    <svg v-if="visual.type === 'shape'" class="shape-svg" :viewBox="svgViewBox" xmlns="http://www.w3.org/2000/svg">

      <!-- Triangle with height (area problems) -->
      <template v-if="visual.shape === 'triangle' && !hasAngleLabels">
        <polygon points="30,130 210,130 120,30" class="shape-fill" />
        <polygon points="30,130 210,130 120,30" class="shape-stroke" />
        <line x1="120" y1="30" x2="120" y2="130" class="shape-dashed" />
        <!-- right angle mark -->
        <polyline points="120,122 128,122 128,130" class="shape-dashed" fill="none" />
        <text x="120" y="150" class="shape-label">{{ label('base') }}</text>
        <text x="130" y="85" class="shape-label label-left">{{ label('height') }}</text>
      </template>

      <!-- Triangle with angles -->
      <template v-if="visual.shape === 'triangle' && hasAngleLabels">
        <!-- Vertices: A=bottom-left(30,140) B=bottom-right(220,140) C=top(125,35) -->
        <polygon points="30,140 220,140 125,35" class="shape-fill" />
        <polygon points="30,140 220,140 125,35" class="shape-stroke" />
        <!-- Bottom-left arc: from edge AB toward edge AC, radius 28 -->
        <!-- Direction AB is (1,0), direction AC is toward (125,35) ~ normalized (0.67,-0.74) -->
        <!-- Arc start: (30+28, 140) = (58,140). Arc end along AC: 30+28*0.67, 140+28*(-0.74) = (49, 119) -->
        <path d="M 58,140 A 28,28 0 0,0 49,119" class="angle-arc" />
        <!-- Bottom-right arc: from edge BA toward edge BC, radius 28 -->
        <!-- Direction BA is (-1,0), direction BC toward (125,35) ~ normalized (-0.67,-0.74) -->
        <!-- Arc start: (220-28,140) = (192,140). Arc end along BC: 220+28*(-0.67), 140+28*(-0.74) = (201,119) -->
        <path d="M 192,140 A 28,28 0 0,1 201,119" class="angle-arc" />
        <!-- Top arc: from edge CA toward edge CB, radius 24 -->
        <!-- Direction CA toward (30,140): normalized (-0.67,0.74). Start: 125+24*(-0.67), 35+24*0.74 = (109, 53) -->
        <!-- Direction CB toward (220,140): normalized (0.67,0.74). End: 125+24*0.67, 35+24*0.74 = (141, 53) -->
        <path d="M 109,53 A 24,24 0 0,1 141,53" class="angle-arc" />
        <!-- Labels inside triangle near each vertex -->
        <text x="65" y="132" class="angle-label">{{ label('a') }}°</text>
        <text x="185" y="132" class="angle-label">{{ label('b') }}°</text>
        <text x="125" y="72" class="angle-label">?</text>
      </template>

      <!-- Rectangle -->
      <template v-if="visual.shape === 'rectangle'">
        <rect x="30" y="20" width="160" height="100" class="shape-fill" />
        <rect x="30" y="20" width="160" height="100" class="shape-stroke" />
        <text x="110" y="140" class="shape-label">{{ label('length') }}</text>
        <text x="200" y="75" class="shape-label label-left">{{ label('width') }}</text>
      </template>

      <!-- Parallelogram -->
      <template v-if="visual.shape === 'parallelogram'">
        <polygon points="60,130 210,130 180,30 30,30" class="shape-fill" />
        <polygon points="60,130 210,130 180,30 30,30" class="shape-stroke" />
        <line x1="45" y1="30" x2="45" y2="130" class="shape-dashed" />
        <polyline points="45,122 53,122 53,130" class="shape-dashed" fill="none" />
        <text x="135" y="150" class="shape-label">{{ label('base') }}</text>
        <text x="28" y="85" class="shape-label">{{ label('height') }}</text>
      </template>

      <!-- Trapezoid -->
      <template v-if="visual.shape === 'trapezoid'">
        <polygon points="70,30 170,30 220,130 20,130" class="shape-fill" />
        <polygon points="70,30 170,30 220,130 20,130" class="shape-stroke" />
        <line x1="70" y1="30" x2="70" y2="130" class="shape-dashed" />
        <polyline points="70,122 78,122 78,130" class="shape-dashed" fill="none" />
        <text x="120" y="22" class="shape-label">{{ label('a') }}</text>
        <text x="120" y="150" class="shape-label">{{ label('b') }}</text>
        <text x="52" y="85" class="shape-label">{{ label('h') }}</text>
      </template>

      <!-- Rectangular Prism (3D isometric) -->
      <template v-if="visual.shape === 'rectangular_prism'">
        <polygon points="30,80 150,80 150,170 30,170" class="shape-fill" />
        <polygon points="30,80 150,80 195,40 75,40" class="shape-fill-top" />
        <polygon points="150,80 195,40 195,130 150,170" class="shape-fill-side" />
        <polygon points="30,80 150,80 150,170 30,170" class="shape-stroke" />
        <polygon points="30,80 150,80 195,40 75,40" class="shape-stroke" />
        <polygon points="150,80 195,40 195,130 150,170" class="shape-stroke" />
        <text x="90" y="186" class="shape-label">{{ label('l') }}</text>
        <text x="178" y="52" class="shape-label">{{ label('w') }}</text>
        <text x="206" y="95" class="shape-label label-left">{{ label('h') }}</text>
      </template>

      <!-- Cube -->
      <template v-if="visual.shape === 'cube'">
        <polygon points="40,75 140,75 140,165 40,165" class="shape-fill" />
        <polygon points="40,75 140,75 185,35 85,35" class="shape-fill-top" />
        <polygon points="140,75 185,35 185,125 140,165" class="shape-fill-side" />
        <polygon points="40,75 140,75 140,165 40,165" class="shape-stroke" />
        <polygon points="40,75 140,75 185,35 85,35" class="shape-stroke" />
        <polygon points="140,75 185,35 185,125 140,165" class="shape-stroke" />
        <text x="90" y="182" class="shape-label">{{ label('s') }}</text>
      </template>
    </svg>

    <!-- Coordinate Plane -->
    <svg v-if="visual.type === 'coordinate_plane'" class="coord-svg" viewBox="-35 -25 265 265" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid -->
      <line v-for="i in 11" :key="'gx'+i" :x1="(i-1)*20" y1="0" :x2="(i-1)*20" y2="200" class="grid-line" />
      <line v-for="i in 11" :key="'gy'+i" x1="0" :y1="(i-1)*20" x2="200" :y2="(i-1)*20" class="grid-line" />
      <!-- Axes -->
      <line x1="100" y1="0" x2="100" y2="200" class="axis-line" />
      <line x1="0" y1="100" x2="200" y2="100" class="axis-line" />
      <text x="208" y="104" class="axis-label">x</text>
      <text x="96" y="-8" class="axis-label">y</text>
      <!-- Tick labels (sparse) -->
      <template v-for="i in [-4,-2,2,4]" :key="'xl'+i">
        <text :x="100+i*20" y="116" class="tick-label">{{ i }}</text>
      </template>
      <template v-for="i in [-4,-2,2,4]" :key="'yl'+i">
        <text x="83" :y="104-i*20" class="tick-label">{{ i }}</text>
      </template>
      <!-- Points -->
      <template v-if="visual.points">
        <!-- Draw polygon if 4 points (rectangle) -->
        <polygon
          v-if="visual.points.length === 4"
          :points="visual.points.map(pt => `${100 + resolveNum(pt.x) * 20},${100 - resolveNum(pt.y) * 20}`).join(' ')"
          class="coord-rect"
        />
        <!-- Draw line if 2 points -->
        <line
          v-if="visual.points.length === 2"
          :x1="100 + resolveNum(visual.points[0]!.x) * 20"
          :y1="100 - resolveNum(visual.points[0]!.y) * 20"
          :x2="100 + resolveNum(visual.points[1]!.x) * 20"
          :y2="100 - resolveNum(visual.points[1]!.y) * 20"
          class="coord-line"
        />
        <!-- Points and labels -->
        <g v-for="(pt, idx) in visual.points" :key="idx">
          <circle
            :cx="100 + resolveNum(pt.x) * 20"
            :cy="100 - resolveNum(pt.y) * 20"
            r="4"
            class="coord-point"
          />
          <text
            v-if="pt.label"
            :x="106 + resolveNum(pt.x) * 20"
            :y="95 - resolveNum(pt.y) * 20"
            class="point-label"
          >{{ pt.label }} ({{ resolveNum(pt.x) }}, {{ resolveNum(pt.y) }})</text>
        </g>
      </template>
    </svg>

    <!-- Fraction Bar -->
    <div v-if="visual.type === 'fraction_bar'" class="fraction-bar">
      <div class="fbar-row">
        <div
          v-for="i in resolveNum(visual.denominator)"
          :key="i"
          class="fbar-cell"
          :class="{ filled: i <= numeratorVal }"
        ></div>
      </div>
    </div>

    <!-- Area Grid -->
    <div v-if="visual.type === 'area_grid'" class="area-grid">
      <div class="agrid-container" :style="gridStyle">
        <div v-for="i in gridCells" :key="i" class="agrid-cell"></div>
      </div>
      <div class="agrid-labels">
        <span>{{ resolveNum(visual.widthVar) }} × {{ resolveNum(visual.heightVar) }}</span>
      </div>
    </div>

    <!-- Number Line -->
    <svg v-if="visual.type === 'number_line'" class="numline-svg" viewBox="-10 -15 320 55" xmlns="http://www.w3.org/2000/svg">
      <!-- Arrow caps -->
      <line x1="0" y1="15" x2="300" y2="15" class="numline-main" />
      <polygon points="296,10 306,15 296,20" class="numline-arrow" />
      <polygon points="4,10 -6,15 4,20" class="numline-arrow" />
      <g v-for="(tick, idx) in numLineTicks" :key="idx">
        <line :x1="tick.x" y1="8" :x2="tick.x" y2="22" class="numline-tick" />
        <text :x="tick.x" y="36" class="numline-label">{{ tick.label }}</text>
      </g>
    </svg>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QuestionVisual } from '../types'

const props = defineProps<{
  visual: QuestionVisual
  vars: Record<string, number | string>
}>()

// Resolve a variable name to its display value (with optional unit)
function resolveNum(varName: string): number {
  const val = props.vars[varName]
  if (typeof val === 'number') return val
  if (typeof val === 'string') return parseFloat(val) || 0
  return 0
}

// Smart label resolver: if the label is a var name, show its value; if it's "?", show "?"
function label(key: string): string {
  if (props.visual.type !== 'shape') return ''
  const labelVal = props.visual.labels[key]
  if (!labelVal || labelVal === '') return ''
  if (labelVal === '?') return '?'
  // If it's a variable name, resolve it
  if (props.vars[labelVal] !== undefined) {
    return String(props.vars[labelVal])
  }
  // If it's a literal like "a/b", try to resolve parts
  if (labelVal.includes('/')) {
    const parts = labelVal.split('/')
    const a = props.vars[parts[0]!]
    const b = props.vars[parts[1]!]
    if (a !== undefined && b !== undefined) return `${a}/${b}`
  }
  return labelVal
}

// Check if this is an angle-labeled triangle
const hasAngleLabels = computed(() => {
  if (props.visual.type !== 'shape' || props.visual.shape !== 'triangle') return false
  return 'a' in props.visual.labels && 'b' in props.visual.labels
})

const svgViewBox = computed(() => {
  if (props.visual.type !== 'shape') return '0 0 240 160'
  if (props.visual.shape === 'rectangular_prism' || props.visual.shape === 'cube') return '0 0 240 200'
  if (props.visual.shape === 'triangle' && hasAngleLabels.value) return '0 0 250 160'
  return '0 0 240 160'
})

// Fraction bar numerator
const numeratorVal = computed(() => {
  if (props.visual.type !== 'fraction_bar') return 0
  // Find the first numeric var that's < denominator (likely the numerator)
  const denom = resolveNum(props.visual.denominator)
  for (const key of Object.keys(props.vars)) {
    if (key === props.visual.denominator) continue
    const v = props.vars[key]
    if (typeof v === 'number' && v > 0 && v <= denom) return v
  }
  return Math.max(1, Math.floor(denom / 2))
})

// Area grid
const gridCells = computed(() => {
  if (props.visual.type !== 'area_grid') return 0
  const w = Math.min(resolveNum(props.visual.widthVar), 10)
  const h = Math.min(resolveNum(props.visual.heightVar), 10)
  return w * h
})

const gridStyle = computed(() => {
  if (props.visual.type !== 'area_grid') return {}
  const w = Math.min(resolveNum(props.visual.widthVar), 10)
  return { gridTemplateColumns: `repeat(${w}, 1fr)` }
})

// Number line
const numLineTicks = computed(() => {
  if (props.visual.type !== 'number_line') return []
  const { min, max, step } = props.visual
  const ticks: { x: number; label: string }[] = []
  const range = max - min
  if (range <= 0) return []
  for (let val = min; val <= max; val += step) {
    const x = ((val - min) / range) * 280 + 10
    ticks.push({ x, label: String(Math.round(val * 100) / 100) })
  }
  return ticks
})
</script>

<style scoped>
.visual-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

/* SVG Shapes */
.shape-svg { width: 100%; max-width: 260px; height: auto; }
.shape-fill { fill: var(--green-light); opacity: 0.8; }
.shape-fill-top { fill: var(--blue-light); opacity: 0.8; }
.shape-fill-side { fill: var(--gold-light); opacity: 0.8; }
.shape-stroke { fill: none; stroke: var(--text-muted); stroke-width: 1.5; stroke-linejoin: round; }
.shape-dashed { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 5,3; }
.shape-label {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  fill: var(--green-primary);
  text-anchor: middle;
  dominant-baseline: middle;
}
.shape-label.label-left { text-anchor: start; }
.angle-arc { fill: none; stroke: var(--green-primary); stroke-width: 1.5; }
.angle-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  fill: var(--green-primary);
  text-anchor: middle;
}

/* Coordinate Plane */
.coord-svg { width: 100%; max-width: 260px; height: auto; }
.grid-line { stroke: var(--border); stroke-width: 0.4; }
.axis-line { stroke: var(--text-muted); stroke-width: 1.5; }
.axis-label { font-size: 11px; fill: var(--text-muted); font-family: var(--font-display); font-weight: 700; }
.tick-label { font-size: 8px; fill: var(--text-muted); text-anchor: middle; font-family: var(--font-display); }
.coord-point { fill: var(--green-primary); stroke: var(--bg-card); stroke-width: 2; }
.coord-line { stroke: var(--green-primary); stroke-width: 1.5; stroke-dasharray: 4,3; }
.coord-rect { fill: var(--green-light); stroke: var(--green-primary); stroke-width: 1.5; opacity: 0.7; }
.point-label { font-size: 9px; fill: var(--text-primary); font-family: var(--font-display); font-weight: 700; }

/* Fraction Bar */
.fraction-bar { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; }
.fbar-row { display: flex; gap: 2px; border: 2px solid var(--border); border-radius: 6px; overflow: hidden; padding: 2px; }
.fbar-cell { width: 28px; height: 28px; border-radius: 3px; background: var(--bg-input); transition: background 0.2s ease; }
.fbar-cell.filled { background: var(--green-primary); }

/* Area Grid */
.area-grid { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; }
.agrid-container { display: grid; gap: 1px; background: var(--border); border: 2px solid var(--border); border-radius: 4px; overflow: hidden; }
.agrid-cell { width: 24px; height: 24px; background: var(--green-light); }
.agrid-labels { font-family: var(--font-display); font-weight: 700; font-size: 0.8125rem; color: var(--text-muted); }

/* Number Line */
.numline-svg { width: 100%; max-width: 320px; height: auto; }
.numline-main { stroke: var(--text-muted); stroke-width: 1.5; }
.numline-arrow { fill: var(--text-muted); }
.numline-tick { stroke: var(--text-muted); stroke-width: 1.5; }
.numline-label { font-size: 9px; fill: var(--text-muted); text-anchor: middle; font-family: var(--font-display); font-weight: 600; }
</style>
