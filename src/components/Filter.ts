import { defineComponent, h, type FunctionalComponent, type PropType } from 'vue'
import PrimeSelect from 'primevue/select'

export { default as SearchInput } from './SearchInput.vue'

type Tab = {
  label: string
  value: string | null
  color?: string
  activeColor?: string
  activeTextColor?: string
  count?: number
  compute?: (data: any[]) => number
}

/* card pembungkus semua filter */
export const Bar: FunctionalComponent = (_, { slots }) =>
  h(
    'div',
    {
      class:
        'flex flex-wrap md:flex-nowrap items-stretch gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-4',
    },
    slots.default?.(),
  )

/** Label + kontrol apa pun */
export const Field: FunctionalComponent<{ label?: string; for?: string }> = (props, { slots }) =>
  h('div', { class: 'flex flex-col min-w-0' }, [
    props.label &&
      h(
        'label',
        {
          for: props.for,
          class: 'font-semibold text-slate-500 mb-1 text-[11.5px] md:text-[13px]',
        },
        props.label,
      ),
    slots.default?.(),
  ])
Field.props = ['label', 'for']

/** Garis pembatas vertikal */
export const Divider: FunctionalComponent = () =>
  h('div', { class: 'hidden md:block w-px bg-slate-200 self-stretch shrink-0 mx-2' })

export const Select = defineComponent({
  name: 'FilterSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: null },
    showClear: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h(PrimeSelect, {
        size: 'small',
        ...attrs,
        class: ['flex-1 min-w-[10rem] max-w-xs', attrs.class],
        modelValue: props.modelValue,
        showClear: props.showClear,
        'onUpdate:modelValue': (v: any) => emit('update:modelValue', v),
      })
  },
})

/** Select dengan label + ikon */
export const InlineSelect = defineComponent({
  name: 'FilterInlineSelect',
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: null },
    label: { type: String, required: true },
    icon: String,
    options: { type: Array as PropType<any[]>, required: true },
    placeholder: String,
    optionLabel: String,
    optionValue: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'flex items-center gap-2 text-xs text-slate-400 shrink-0' }, [
        h('span', { class: 'flex items-center gap-1 font-medium whitespace-nowrap' }, [
          props.icon && h('i', { class: [props.icon, 'text-sm'] }),
          props.label,
        ]),
        h(PrimeSelect, {
          modelValue: props.modelValue,
          'onUpdate:modelValue': (v: any) => emit('update:modelValue', v),
          options: props.options,
          optionLabel: props.optionLabel,
          optionValue: props.optionValue,
          placeholder: props.placeholder,
          showClear: true,
          size: 'small',
          class: 'min-w-[10rem]',
        }),
      ])
  },
})

/** Toggle segmented (User / Outlet) */
export const Segmented = defineComponent({
  name: 'FilterSegmented',
  inheritAttrs: false,
  props: {
    modelValue: { type: null as unknown as PropType<any>, default: null },
    options: { type: Array as PropType<any[]>, required: true },
    optionLabel: { type: String, default: 'label' },
    optionValue: { type: String, default: 'value' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const getLabel = (o: any) => (typeof o === 'object' ? o[props.optionLabel] : o)
    const getValue = (o: any) => (typeof o === 'object' ? o[props.optionValue] : o)

    return () =>
      h(
        'div',
        { ...attrs, class: ['flex flex-1 rounded-lg bg-[#EEF0F4] p-1 items-center', attrs.class] },
        props.options.map((o) =>
          h(
            'button',
            {
              key: getValue(o),
              type: 'button',
              class: [
                'flex-1 h-full rounded-md py-1.5 font-bold transition text-sm',
                props.modelValue === getValue(o)
                  ? 'bg-[#0B1838] text-white shadow-sm'
                  : 'text-[#475467]',
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
    modelValue: { type: null as unknown as PropType<string | null>, default: null },
    tabs: { type: Array as PropType<Tab[]>, required: true },
    data: { type: Array as PropType<any[]>, default: () => [] },
    statusField: String,
    icon: { type: String, default: 'pi pi-list' },
    title: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const countFor = (tab: Tab): number | null => {
      if (tab.count !== undefined) return tab.count
      if (tab.compute) return tab.compute(props.data)
      if (!props.statusField) return null
      return tab.value === null
        ? props.data.length
        : props.data.filter((d) => d[props.statusField!] === tab.value).length
    }

    const tabStyle = (tab: Tab) => {
      const isActive = props.modelValue === tab.value
      return {
        flexShrink: 0,
        fontSize: '12px',
        lineHeight: '1.4',
        padding: '8px 14px',
        borderRadius: '9999px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isActive ? (tab.activeColor ?? '#1e293b') : '#f8fafc',
        color: isActive ? (tab.activeTextColor ?? '#fff') : '#64748b',
      }
    }

    return () =>
      h('div', { class: 'flex items-center gap-2 sm:gap-3 flex-wrap' }, [
        props.title &&
          h(
            'span',
            {
              class:
                'flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-400 shrink-0',
            },
            [props.icon && h('i', { class: [props.icon, 'text-xs sm:text-sm'] }), props.title],
          ),

        h(
          'div',
          {
            class:
              'flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
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
                      borderRadius: '9999px',
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
