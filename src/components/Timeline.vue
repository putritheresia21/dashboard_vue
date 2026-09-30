<script setup lang="ts" generic="T">
import { ref } from 'vue'

interface Timeline {
  detail: string | T
  isCompleted?: boolean
  date?: string
}

const props = defineProps<{
  events: Timeline[]
}>()
</script>

<template>
  <div class="flex w-full p-6">
    <div v-for="(item, index) in events" :key="index" class="flex-col flex-1">
      <!-- Kontainer Relatif -->
      <div class="relative flex items-center">
        <!-- Garis Penghubung: Terpusat secara vertikal -->
        <div
          v-if="index !== events.length - 1"
          class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[0.5px] bg-[#9ea7bc] z-0"
        ></div>

        <!-- Marker Kotak: Diberi z-10 agar berada di atas garis -->
        <div
          class="relative z-10 w-2.5 h-2.5 shrink-0"
          :class="item.isCompleted ? 'bg-[#172543]' : 'bg-[#9ea7bc]'"
        ></div>
      </div>

      <!-- Teks Keterangan -->

      <div
        class="mt-3 flex flex-col text-left pr-4"
        :class="item.isCompleted ? 'text-[#172543]' : 'text-[#9ea7bc]'"
      >
        <slot :item="item" :index="index">
          <span class="text-[11.5px] font-bold">{{ item.detail }}</span>

          <span v-if="item.date" class="text-[11.5px]">
            {{ item.date }}
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>
