import { onMounted, onUnmounted, ref } from 'vue'

import { BREAKINGPOINTS } from '@/app/config/app'

const isMobile = ref(window.innerWidth < BREAKINGPOINTS.lg)
let listenerCount = 0

function check() {
  isMobile.value = window.innerWidth < BREAKINGPOINTS.lg
}

export function useIsMobile() {
  onMounted(() => {
    if (listenerCount === 0) {
      window.addEventListener('resize', check)
    }
    listenerCount++
  })

  onUnmounted(() => {
    listenerCount--
    if (listenerCount === 0) {
      window.removeEventListener('resize', check)
    }
  })

  return isMobile
}
