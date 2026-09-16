<script setup lang="ts">
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
</script>

<template>
  <RouterView />
  <Toast />
  <ConfirmDialog />
</template>

<style>
.p-confirmdialog {
  border-radius: 1.5rem !important;
  overflow: hidden;
}

.p-confirmdialog .p-dialog-header {
  padding: 1.5rem 1.5rem 0.75rem !important;
  border-radius: 1.5rem 1.5rem 0 0 !important;
}

.p-confirmdialog .p-dialog-content {
  padding: 0.5rem 1.5rem 1.5rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
}

.p-confirmdialog .p-dialog-content i {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #ef4444 !important;
  font-size: 1.1rem !important;
}

.p-confirmdialog .p-dialog-footer {
  padding: 0.75rem 1.5rem 1.5rem !important;
  border-radius: 0 0 1.5rem 1.5rem !important;
}

.p-confirmdialog .p-dialog-content > *:first-child {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fee2e2;
  padding: 0 !important;
  line-height: 1;
}

.p-confirmdialog .p-dialog-content > *:first-child svg,
.p-confirmdialog .p-dialog-content > *:first-child i {
  color: #ef4444 !important;
  width: 24px !important;
  height: 24px !important;
  font-size: 24px !important;
  font-weight: 700 !important;
  margin: 0 !important;
}
</style>
