<script setup lang="ts">
import { Button, Card, Column, DataTable } from '@bernofarm/core'
import { EyeIcon } from '@hugeicons/core-free-icons'

import DynamicList from '@/shared/components/DynamicList.vue'
import { useIsMobile } from '@/shared/composables/useIsMobile'
import { colorTokens } from '@/shared/utils/colors'
import { createHugeIconComponent } from '@/shared/utils/createHugeIconComponent'

type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

interface ApprovalRow {
  approvalNo: string
  transactionNo: string
  approvalType: string
  requester: string
  submittedDate: string
  description: string
  approvalStatus: ApprovalStatus
}

withDefaults(defineProps<{ data: ApprovalRow[]; rows?: number }>(), { rows: 10 })

const emit = defineEmits<{ (e: 'view', row: ApprovalRow): void }>()

const isMobile = useIsMobile()
const ReviewIcon = createHugeIconComponent(EyeIcon)

const badgeClass =
  'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap'

const primaryBadge = {
  bg: 'color-mix(in srgb, var(--bnf-color-primary) 12%, transparent)',
  text: colorTokens.primary,
}

const statusBadgeMap: Record<ApprovalStatus, { bg: string; text: string }> = {
  APPROVED: {
    bg: 'color-mix(in srgb, var(--bnf-color-success) 12%, transparent)',
    text: colorTokens.success,
  },
  PENDING: {
    bg: 'color-mix(in srgb, var(--bnf-color-warning) 12%, transparent)',
    text: colorTokens.warning,
  },
  REJECTED: {
    bg: 'color-mix(in srgb, var(--bnf-color-danger) 12%, transparent)',
    text: colorTokens.danger,
  },
}

const statusLabel: Record<ApprovalStatus, string> = {
  APPROVED: 'DISETUJUI',
  PENDING: 'MENUNGGU',
  REJECTED: 'DITOLAK',
}

function badgeStyle(badge: { bg: string; text: string }) {
  return { backgroundColor: badge.bg, color: badge.text }
}

function statusStyle(status: ApprovalStatus) {
  return badgeStyle(statusBadgeMap[status] ?? primaryBadge)
}

function getStatusLabel(status: ApprovalStatus) {
  return statusLabel[status]
}

const typeStyle = badgeStyle(primaryBadge)
</script>

<template>
  <!-- Desktop -->
  <Card v-if="!isMobile" class="min-w-0 overflow-hidden">
    <div class="w-full overflow-x-auto">
      <DataTable
        class="approval-list"
        :value="data"
        data-key="approvalNo"
        paginator
        :rows="rows"
        paginator-template="CurrentPageReport PrevPageLink PageLinks NextPageLink"
        current-page-report-template="Menampilkan {first}-{last} dari {totalRecords} data"
        empty-message="Tidak ada data approval"
        responsive-layout="scroll"
      >
        <Column header="No" :style="{ width: '3rem' }">
          <template #body="{ index }">{{ index + 1 }}</template>
        </Column>

        <Column field="approvalNo" header="No Approval" :style="{ width: '9rem' }">
          <template #body="{ data: row }">
            <span class="font-bold">{{ row.approvalNo }}</span>
          </template>
        </Column>

        <Column field="transactionNo" header="No Transaksi" :style="{ width: '9rem' }" />

        <Column
          field="approvalType"
          header="Jenis Approval"
          header-class="col-center"
          :style="{ width: '10rem' }"
          body-class="text-center"
        >
          <template #body="{ data: row }">
            <span :class="badgeClass" :style="typeStyle">{{ row.approvalType }}</span>
          </template>
        </Column>

        <Column
          field="requester"
          header="Pengaju"
          header-class="col-center"
          :style="{ width: '9rem' }"
          body-class="text-center"
        >
          <template #body="{ data: row }">
            <span class="font-bold">{{ row.requester }}</span>
          </template>
        </Column>

        <Column
          field="submittedDate"
          header="Tanggal Pengajuan"
          header-class="col-center whitespace-nowrap"
          :style="{ width: '9rem' }"
          body-class="text-center"
        />

        <Column field="description" header="Keterangan" />

        <Column
          field="approvalStatus"
          header="Status Approval"
          header-class="col-center whitespace-nowrap"
          :style="{ width: '9rem' }"
          body-class="text-center"
        >
          <template #body="{ data: row }">
            <span :class="badgeClass" :style="statusStyle(row.approvalStatus)">
              {{ getStatusLabel(row.approvalStatus) }}
            </span>
          </template>
        </Column>

        <Column
          header="Aksi"
          header-class="col-center"
          :style="{ width: '7rem' }"
          body-class="text-center"
        >
          <template #body="{ data: row }">
            <Button
              label="Review"
              :icon="ReviewIcon"
              severity="primary"
              size="small"
              @click="emit('view', row)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </Card>

  <!-- Mobile -->
  <DynamicList v-else :items="data" layout="column" :gap="4" :show-arrow="false">
    <template #item="{ item: row }">
      <div class="flex flex-col w-full gap-3">
        <span :class="[badgeClass, 'w-fit']" :style="typeStyle">
          {{ row.approvalType }}
        </span>

        <div class="flex w-full justify-between items-center">
          <div class="flex flex-col gap-2">
            <span class="text-bnf-text text-[14px] font-bold">{{ row.approvalNo }}</span>
            <div class="flex items-center gap-2 text-bnf-text-muted text-[12.5px]">
              <span>
                Pengaju: <span class="text-bnf-text">{{ row.requester }}</span>
              </span>
              <span>&bull;</span>
              <span>{{ row.submittedDate }}</span>
            </div>
          </div>
          <span :class="badgeClass" :style="statusStyle(row.approvalStatus)">
            {{ getStatusLabel(row.approvalStatus) }}
          </span>
        </div>

        <div class="text-bnf-text-muted text-[13px] bg-bnf-surface-muted rounded-md p-2">
          {{ row.description }}
        </div>

        <div class="flex w-full justify-between items-center">
          <span class="text-[11.5px] text-bnf-text-muted">{{ row.transactionNo }}</span>
          <Button
            label="Review"
            :icon="ReviewIcon"
            severity="primary"
            rounded
            size="small"
            class="text-xs py-1 px-3"
            @click="emit('view', row)"
          />
        </div>
      </div>
    </template>
  </DynamicList>
</template>

<style scoped>
/* ---------- Header ---------- */
.approval-list :deep(.p-datatable-thead > tr > th) {
  background: var(--bnf-color-surface-muted, #f3f4f6);
  color: var(--bnf-color-text-muted, #6b7280);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-align: left;
  vertical-align: middle;
  padding: 0.75rem 0.5rem;
  border: 0;
}
.approval-list :deep(.p-datatable-thead > tr > th:first-child) {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}
.approval-list :deep(.p-datatable-thead > tr > th:last-child) {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

/* Centered headers: cover the th and its inner wrapper, so it works
   regardless of how the core renders the header */
.approval-list :deep(th.col-center),
.approval-list :deep(th.col-center > div),
.approval-list :deep(th.col-center .p-column-header-content) {
  text-align: center;
  justify-content: center;
}

/* ---------- Body ---------- */
.approval-list :deep(.p-datatable-tbody > tr > td) {
  font-size: 11px;
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
  border: 0;
  border-bottom: 1px solid var(--bnf-color-surface-muted, #f3f4f6);
  background: transparent;
}

/* ---------- Paginator: info text on the left, page buttons on the right ---------- */
.approval-list :deep(.p-paginator) {
  justify-content: space-between;
  gap: 0.25rem;
  background: transparent;
  border: 0;
  padding: 1rem 0 0;
}
.approval-list :deep(.p-paginator-current) {
  order: -1;
  margin-right: auto;
  font-size: 11px;
  color: var(--bnf-color-text-muted, #6b7280);
}
.approval-list :deep(.p-paginator-page),
.approval-list :deep(.p-paginator-prev),
.approval-list :deep(.p-paginator-next) {
  min-width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  font-size: 12px;
  background: var(--bnf-color-surface, #fff);
  border: 1px solid var(--bnf-color-surface-muted, #e5e7eb);
}
.approval-list :deep(.p-paginator-page.p-paginator-page-selected),
.approval-list :deep(.p-paginator-page.p-highlight) {
  background: var(--bnf-color-primary);
  border-color: var(--bnf-color-primary);
  color: #fff;
  font-weight: 600;
}
</style>
