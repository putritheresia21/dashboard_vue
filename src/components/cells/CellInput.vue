<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    type?: 'text' | 'number'
    disabled?: boolean
    min?: number
    max?: number
    width?: string
  }>(),
  {
    type: 'text',
    width: 'w-8',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: number | string] }>()

function onNumber(value: number | null) {
  emit('update:modelValue', value ?? 0)
}

function onText(value: string | undefined) {
  emit('update:modelValue', value ?? '')
}

const base =
  'h-[26px] rounded-[5px] border border-slate-300 bg-white text-[13px] text-slate-800 shadow-sm ' +
  'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 ' +
  'disabled:text-slate-400 disabled:opacity-100 disabled:shadow-none'

const numberClass = `${base} ${props.width} p-0 text-center font-bold`
const textClass = `${base} w-full px-2 py-0 text-left font-semibold`
</script>

<template>
  <InputNumber
    v-if="type === 'number'"
    v-bind="$attrs"
    :model-value="Number(modelValue ?? $attrs.value ?? 0)"
    :min="min ?? 0"
    :max="max"
    :disabled="disabled"
    :use-grouping="false"
    :allow-empty="false"
    :input-class="numberClass"
    @update:model-value="onNumber"
  />

  <InputText
    v-else
    v-bind="$attrs"
    :model-value="String(modelValue ?? '')"
    :disabled="disabled"
    :class="textClass"
    @update:model-value="onText"
  />
</template>
