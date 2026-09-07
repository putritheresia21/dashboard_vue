<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  percent: number
  size?: number
  label?: string
}>()

const size = props.size ?? 220
const totalLines = 24
const center = size / 2
const innerRadius = size * 0.3
const outerRadius = size * 0.46
const svgHeight = outerRadius + 40

const animatedPercent = ref(0)

watch(
  () => props.percent,
  (newVal) => {
    animatedPercent.value = 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animatedPercent.value = newVal
      })
    })
  },
  { immediate: true },
)

const activeLines = computed(() => Math.round((animatedPercent.value / 100) * totalLines))

const lines = computed(() => {
  return Array.from({ length: totalLines }, (_, i) => {
    const angleDeg = -180 + (i / (totalLines - 1)) * 180
    const angleRad = (angleDeg * Math.PI) / 180

    const x1 = center + innerRadius * Math.cos(angleRad)
    const y1 = center + innerRadius * Math.sin(angleRad)
    const x2 = center + outerRadius * Math.cos(angleRad)
    const y2 = center + outerRadius * Math.sin(angleRad)

    return { x1, y1, x2, y2, active: i < activeLines.value }
  })
})
</script>

<template>
  <svg
    :width="size"
    :height="svgHeight"
    :viewBox="`0 0 ${size} ${svgHeight}`"
    style="display: block; margin: 0 auto"
  >
    <line
      v-for="(line, i) in lines"
      :key="i"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      :stroke="line.active ? '#0d9488' : '#e2e8f0'"
      stroke-width="5"
      stroke-linecap="round"
      class="gauge-line"
      :style="{ transitionDelay: `${i * 25}ms` }"
    />

    <text
      :x="center"
      :y="center + 8"
      text-anchor="middle"
      class="fill-slate-800"
      style="font-size: 28px; font-weight: 700"
    >
      {{ percent }}%
    </text>
    <text
      v-if="label"
      :x="center"
      :y="center + 30"
      text-anchor="middle"
      class="fill-slate-400"
      style="font-size: 11px"
    >
      {{ label }}
    </text>
  </svg>
</template>

<style scoped>
.gauge-line {
  transition: stroke 0.5s ease;
}
</style>
