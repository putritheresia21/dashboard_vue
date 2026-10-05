import { HugeiconsIcon } from '@hugeicons/vue'
import { type Component, defineComponent, h } from 'vue'

export const createHugeIconComponent = (icon: object, size = 16): Component =>
  defineComponent({
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h(HugeiconsIcon, {
          ...attrs,
          icon,
          size,
          strokeWidth: 1.8,
        })
    },
  })
