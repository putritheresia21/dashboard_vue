<script setup lang="ts">
import { computed } from 'vue'
import Colors from '@/utils/colors'

interface Props {
  variant?: 'circle' | 'linear'
  percent: number
  color?: string
  trackColor?: string

  //circle
  size?: number //diameter
  strokeWidth?: number
  showLabel?: boolean
  labelClass?: string

  //linear
  height?: number
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'circle',
  color: () => Colors.orange[400],
  trackColor: () => Colors.withOpacity('#FFFFF', 0.15),

  size: 64,
  strokeWidth: 6,
  showLabel: true,
  labelClass: 'text-xs font-bold',

  height: 8,
  rounded: true,
})

const clampedPercent = computed(() => Math.min(Math.max(props.percent, 0), 100))

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(
  () => circumference.value - (clampedPercent.value / 100) * circumference.value,
)

const center = computed(() => props.size / 2)
</script>

<template>
  <div
    v-if="variant === 'circle'"
    class="relative shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg :viewBox="`0 0 ${size} ${size}`" class="-rotate-90" :width="size" :height="size">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        style="transition: stroke-dashoffset 0.4s ease"
      />
    </svg>
    <span
      v-if="showLabel || $slots.default"
      class="absolute inset-0 flex items-center justify-center"
      :class="labelClass"
    >
      <slot>{{ Math.round(clampedPercent) }}%</slot>
    </span>
  </div>

  <!--varian linear-->
  <div
    v-else
    class="w-full overflow-hidden"
    :class="rounded ? 'rounded-full' : ''"
    :style="{ height: `${height}px`, background: trackColor }"
  >
    <div
      class="h-full"
      :class="rounded ? 'rounded-full' : ''"
      :style="{ width: `${clampedPercent}%`, background: color, transition: 'width 0.4s ease' }"
    ></div>
  </div>
</template>
