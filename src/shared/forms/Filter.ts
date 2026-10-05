/* eslint-disable vue/one-component-per-file, max-lines-per-function */
import { Card, Select as BernofarmSelect } from '@bernofarm/core'
import { FilterIcon, ListViewIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { defineComponent, type FunctionalComponent, h, type PropType } from 'vue'

import { colorTokens } from '@/shared/utils/colors'

export { default as SearchInput } from '@/shared/components/SearchInput.vue'

type Tab = {
  label: string
  value: string | null
  color?: string
  activeColor?: string
  activeTextColor?: string
  count?: number
  compute?: (data: unknown[]) => number
}

type FilterModel = string | number | boolean | Record<string, unknown> | unknown[] | null

/* card pembungkus semua filter */
export const Bar: FunctionalComponent = (_, { slots }) =>
  h(
    Card,
    { class: 'flex flex-wrap items-stretch gap-bnf-lg p-bnf-lg md:flex-nowrap' },
    { default: () => slots.default?.() },
  )

/** Label + kontrol apa pun */
export const Field: FunctionalComponent<{ label?: string; for?: string }> = (props, { slots }) =>
  h('div', { class: 'flex flex-col min-w-0' }, [
    props.label &&
      h(
        'label',
        {
          for: props.for,
          class: 'mb-bnf-xs font-semibold text-bnf-text-muted text-[11.5px] md:text-[13px]',
        },
        props.label,
      ),
    slots.default?.(),
  ])
Field.props = ['label', 'for']

/** Garis pembatas vertikal */
export const Divider: FunctionalComponent = () =>
  h('div', { class: 'hidden shrink-0 self-stretch mx-bnf-sm w-px bg-bnf-surface-muted md:block' })

export const Select = defineComponent({
  name: 'FilterSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object, Array] as PropType<FilterModel>,
      default: null,
    },
    showClear: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h(BernofarmSelect, {
        ...attrs,
        class: ['min-w-0 max-w-xs flex-1 sm:min-w-[10rem]', attrs.class],
        modelValue: props.modelValue,
        showClear: props.showClear,
        'onUpdate:modelValue': (v: unknown) => emit('update:modelValue', v),
      })
  },
})

/** Select dengan label + ikon */
export const InlineSelect = defineComponent({
  name: 'FilterInlineSelect',
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object, Array] as PropType<FilterModel>,
      default: null,
    },
    label: { type: String, required: true },
    icon: { type: Object, default: () => FilterIcon },
    options: { type: Array as PropType<unknown[]>, required: true },
    placeholder: { type: String, default: '' },
    optionLabel: { type: String, default: undefined },
    optionValue: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'flex shrink-0 items-center gap-bnf-sm text-xs text-bnf-text-muted' }, [
        h(
          'span',
          { class: 'flex shrink-0 items-center gap-bnf-xs whitespace-nowrap font-medium' },
          [
            props.icon &&
              h(HugeiconsIcon, {
                icon: props.icon,
                size: 14,
                strokeWidth: 1.8,
                class: 'shrink-0',
              }),
            props.label,
          ],
        ),
        h(BernofarmSelect, {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (v: unknown) => emit('update:modelValue', v),
          options: props.options,
          optionLabel: props.optionLabel,
          optionValue: props.optionValue,
          placeholder: props.placeholder,
          showClear: true,
          size: 'small',
          class: 'min-w-0 sm:min-w-[10rem]',
        }),
      ])
  },
})

/** Toggle segmented (User / Outlet) */
export const Segmented = defineComponent({
  name: 'FilterSegmented',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Boolean, Object, Array] as PropType<FilterModel>,
      default: null,
    },
    options: { type: Array as PropType<unknown[]>, required: true },
    optionLabel: { type: String, default: 'label' },
    optionValue: { type: String, default: 'value' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const getOptionValue = (option: unknown, key: string): unknown => {
      if (typeof option === 'object' && option !== null) {
        return (option as Record<string, unknown>)[key]
      }
      return option
    }
    const getLabel = (option: unknown) => String(getOptionValue(option, props.optionLabel) ?? '')
    const getValue = (option: unknown) => getOptionValue(option, props.optionValue)

    return () =>
      h(
        'div',
        {
          ...attrs,
          class: [
            'flex w-full items-center rounded-bnf-md border border-bnf-border bg-bnf-surface-muted p-bnf-xs',
            attrs.class,
          ],
        },
        props.options.map((o) =>
          h(
            'button',
            {
              key: String(getValue(o)),
              type: 'button',
              class: [
                'h-full flex-1 rounded-bnf-sm py-bnf-sm text-sm font-bold leading-5 transition',
                props.modelValue === getValue(o)
                  ? 'bg-bnf-text text-bnf-primary-foreground shadow-bnf-sm'
                  : 'text-bnf-text-muted',
              ],
              onClick: () => emit('update:modelValue', getValue(o)),
            },
            getLabel(o),
          ),
        ),
      )
  },
})

/** Tab status berbentuk pill */
export const Tabs = defineComponent({
  name: 'FilterTabs',
  props: {
    modelValue: { type: String as PropType<string | null>, default: null },
    tabs: { type: Array as PropType<Tab[]>, required: true },
    data: { type: Array as PropType<unknown[]>, default: () => [] },
    statusField: { type: String, default: undefined },
    icon: { type: Object, default: () => ListViewIcon },
    title: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const countFor = (tab: Tab): number | null => {
      if (tab.count !== undefined) {
        return tab.count
      }
      if (tab.compute) {
        return tab.compute(props.data)
      }
      if (!props.statusField) {
        return null
      }
      return tab.value === null
        ? props.data.length
        : props.data.filter((d) => {
            if (typeof d !== 'object' || d === null) {
              return false
            }
            return (d as Record<string, unknown>)[props.statusField!] === tab.value
          }).length
    }

    const tabStyle = (tab: Tab) => {
      const isActive = props.modelValue === tab.value
      return {
        flexShrink: 0,
        fontSize: '12px',
        lineHeight: '1.4',
        padding: 'var(--bnf-spacing-sm) var(--bnf-spacing-md)',
        borderRadius: 'var(--bnf-radius-pill)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--bnf-spacing-sm)',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isActive
          ? (tab.activeColor ?? colorTokens.brandBlue)
          : colorTokens.surfaceMuted,
        color: isActive ? (tab.activeTextColor ?? colorTokens.foreground) : colorTokens.textMuted,
      }
    }

    return () =>
      h('div', { class: 'flex flex-wrap items-center gap-bnf-sm sm:gap-bnf-md' }, [
        props.title &&
          h(
            'span',
            {
              class:
                'flex shrink-0 items-center gap-bnf-sm text-[11px] font-medium text-bnf-text-muted sm:text-xs',
            },
            [
              props.icon &&
                h(HugeiconsIcon, {
                  icon: props.icon,
                  size: 14,
                  strokeWidth: 1.8,
                  class: 'shrink-0',
                }),
              props.title,
            ],
          ),

        h(
          'div',
          {
            class:
              'flex items-center gap-bnf-sm overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          },
          props.tabs.map((tab) => {
            const count = countFor(tab)
            return h(
              'button',
              {
                key: tab.value ?? 'all',
                type: 'button',
                style: tabStyle(tab),
                onClick: () => emit('update:modelValue', tab.value),
              },
              [
                tab.color &&
                  h('span', {
                    style: {
                      width: '6px',
                      height: '6px',
                      borderRadius: 'var(--bnf-radius-pill)',
                      flexShrink: 0,
                      backgroundColor: tab.color,
                    },
                  }),
                tab.label,
                count !== null && ` (${count})`,
              ],
            )
          }),
        ),
      ])
  },
})
