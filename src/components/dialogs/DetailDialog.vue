<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

defineProps<{
  visible: boolean
  title: string
  name: string
  subtitle?: string
  tabs: {
    value: string
    label: string
    items?: { label: string; value: string; hint?: string; span2?: boolean }[]
  }[]
  width?: string
}>()

defineEmits<{ 'update:visible': [value: boolean] }>()
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="title"
    :style="{ width: width ?? '32rem' }"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <slot name="header-icon" />
        <div>
          <p class="font-semibold text-slate-800 text-lg">{{ name }}</p>
          <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
        </div>
      </div>

      <Tabs :value="tabs[0]?.value ?? ''">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
            {{ tab.label }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
            <template v-if="tab.items">
              <div class="grid grid-cols-2 gap-3 text-sm pt-2">
                <div
                  v-for="item in tab.items"
                  :key="item.label"
                  class="bg-slate-50 rounded-lg p-3"
                  :class="item.span2 ? 'col-span-2' : ''"
                >
                  <p class="text-slate-400 mb-1">{{ item.label }}</p>
                  <slot name="item-value" :tab="tab" :item="item">
                    <p class="font-medium text-slate-800">{{ item.value }}</p>
                  </slot>
                  <p v-if="item.hint" class="text-xs text-slate-400">{{ item.hint }}</p>
                </div>
              </div>
              <slot name="content" :tab="tab" />
            </template>

            <slot v-else name="content" :tab="tab" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </Dialog>
</template>
