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
  tabs?: { value: string; label: string }[]
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
      <div v-if="$slots.header" class="flex items-center gap-3">
        <slot name="header" />
      </div>

      <Tabs v-if="tabs?.length" :value="tabs[0]?.value ?? ''">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
            {{ tab.label }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
            <slot :name="`tab-${tab.value}`" :tab="tab" />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <slot v-else name="content" />
    </div>
  </Dialog>
</template>
