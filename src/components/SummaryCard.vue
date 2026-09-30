<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { role } = storeToRefs(auth)

const targetVisits = computed(() =>
  role.value === 'dm'
    ? [
        { role: 'MR', amount: 12 },
        { role: 'SPV', amount: 4 },
        { role: 'DM', amount: 4 },
      ]
    : [{ role: 'SM', amount: 12 }],
)
</script>

<template>
  <div class="flex flex-row flex-wrap gap-2 bg-[#0B1734] rounded-2xl p-5 shadow-sm mt-3 mb-3">
    <div
      v-for="targetVisit in targetVisits"
      :key="targetVisit.role"
      class="flex grow basis-25 flex-col items-center"
    >
      <span class="text-[11px]">TARGET VISIT {{ targetVisit.role }}</span>
      <span class="text-base text-white font-bold">{{ targetVisit.amount }}</span>
    </div>

    <div class="flex grow basis-25 flex-col items-center">
      <span class="text-[11px]">SIANG / MALAM</span>
      <span class="text-base text-white font-bold">8 / 9</span>
    </div>
    <div class="flex grow basis-25 flex-col items-center">
      <span class="text-[11px]">{{ role === 'dm' ? 'TOTAL USER' : 'USER / OUTLET' }}</span>
      <span class="text-base text-white font-bold">{{ role === 'dm' ? 7 : '7/3' }}</span>
    </div>
    <div v-if="role === 'dm'" class="flex grow basis-25 flex-col items-center">
      <span class="text-[11px]">TOTAL OUTLET</span>
      <span class="text-base text-white font-bold">3</span>
    </div>
  </div>
</template>
