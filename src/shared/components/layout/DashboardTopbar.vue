<script setup lang="ts">
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from '@bernofarm/core'
import { AppTopbar, type ShellBrand, type ShellMenuItem, type ShellUser } from '@bernofarm/shell'
import { ArrowDown01Icon, CheckIcon, Notification03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useAuthStore } from '@/features/auth/stores/authStore'
import SearchInput from '@/shared/components/SearchInput.vue'

const props = defineProps<{
  brand: string | ShellBrand
  navigation: ShellMenuItem[]
  user?: ShellUser
}>()

const searchQuery = ref('')

const authStore = useAuthStore()
const { role } = storeToRefs(authStore)

const rolePopover = ref<{ hide: () => void } | null>(null)

function pickRole(next: (typeof authStore.roles)[number]) {
  authStore.switchRole(next)
  rolePopover.value?.hide()
}

const userInitials = computed(() => {
  const name = props.user?.name?.trim() || 'User'

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
})
</script>

<template>
  <div class="flex h-full w-full min-w-0 items-center gap-bnf-sm">
    <AppTopbar
      variant="dashboard"
      :brand="brand"
      :navigation="navigation"
      :user="user"
      class="min-w-0"
    >
      <template #actions>
        <div class="hidden w-64 lg:block">
          <SearchInput
            v-model="searchQuery"
            placeholder=" "
            variant="muted"
            :h="40"
            aria-label="Cari"
          />
        </div>

        <Button
          type="button"
          text
          severity="secondary"
          aria-label="Notifikasi"
          class="relative h-10 w-10 shrink-0 gap-0! bg-bnf-surface-subtle! p-0 text-bnf-text-muted hover:bg-bnf-border"
        >
          <template #icon>
            <HugeiconsIcon :icon="Notification03Icon" :size="20" :stroke-width="1.8" />
          </template>
          <span
            aria-hidden="true"
            class="absolute right-2 top-2 h-2 w-2 rounded-bnf-pill bg-bnf-warning"
          />
        </Button>
      </template>

      <template #user-menu>
        <Popover ref="rolePopover">
          <PopoverTrigger
            class="flex min-w-0 items-center gap-bnf-sm rounded-bnf-lg p-1 text-left transition-colors hover:bg-bnf-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-bnf-ring"
            aria-label="Ganti role"
          >
            <div class="hidden min-w-0 text-right leading-tight sm:block">
              <p class="truncate text-sm font-semibold text-bnf-text">{{ user?.name }}</p>
              <p class="truncate text-xs text-bnf-text-muted">
                {{ user?.email }} · {{ authStore.roleLabels[role] }}
              </p>
            </div>
            <Avatar
              :label="userInitials"
              size="normal"
              class="bg-bnf-primary! [&>span]:text-bnf-primary-foreground"
            />
            <HugeiconsIcon
              :icon="ArrowDown01Icon"
              :size="14"
              :stroke-width="1.8"
              class="hidden shrink-0 text-bnf-text-muted sm:block"
            />
          </PopoverTrigger>

          <PopoverContent class="right-0 left-auto mt-2 w-48 p-1.5!">
            <p class="px-2 pb-1 pt-1 text-xs font-medium text-bnf-text-muted">Ganti Role</p>
            <button
              v-for="r in authStore.roles"
              :key="r"
              type="button"
              class="flex w-full items-center justify-between rounded-bnf-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-bnf-surface-muted"
              :class="r === role ? 'font-medium text-bnf-primary' : 'text-bnf-text'"
              @click="pickRole(r)"
            >
              {{ authStore.roleLabels[r] }}
              <HugeiconsIcon v-if="r === role" :icon="CheckIcon" :size="16" :stroke-width="2" />
            </button>
          </PopoverContent>
        </Popover>
      </template>
    </AppTopbar>
  </div>
</template>
