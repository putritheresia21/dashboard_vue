<script setup lang="ts">
import * as Filter from '@/shared/forms/Filter'

interface QuarterOption {
  label: string
  value: number
  disabled?: boolean
}

interface ViewOption {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    yearOptions: number[]
    quarterOptions: QuarterOption[]
    viewOptions: ViewOption[]
    quarterPlaceholder?: string
    disabled?: boolean
  }>(),
  {
    quarterPlaceholder: 'Pilih triwulan',
    disabled: false,
  },
)

const year = defineModel<number | null>('year', { default: null })
const quarter = defineModel<number | null>('quarter', { default: null })
const view = defineModel<string>('view', { default: 'user' })
</script>

<template>
  <Filter.Bar>
    <Filter.Field label="Periode Tahun" for="year" class="basis-full md:basis-0 md:flex-1">
      <Filter.Select
        id="year"
        v-model="year"
        :options="yearOptions"
        :show-clear="false"
        :disabled="disabled"
        class="w-full max-w-none"
      />
    </Filter.Field>

    <Filter.Field label="Triwulan" for="quarter" class="basis-full md:basis-0 md:flex-1">
      <Filter.Select
        id="quarter"
        v-model="quarter"
        :options="quarterOptions"
        option-label="label"
        option-value="value"
        option-disabled="disabled"
        :placeholder="quarterPlaceholder"
        :show-clear="false"
        :disabled="disabled"
        class="w-full max-w-none"
      />
    </Filter.Field>

    <Filter.Divider />

    <Filter.Field label="Lihat berdasarkan" class="basis-full md:basis-0 md:flex-[2]">
      <Filter.Segmented v-model="view" :options="viewOptions" />
    </Filter.Field>
  </Filter.Bar>
</template>
