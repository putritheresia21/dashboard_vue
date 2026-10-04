<route lang="yaml">
meta:
  layout: false
</route>

<!-- contoh penerapan useValidateInput -->
<script setup lang="ts">
import {
  Button,
  Form,
  FormField,
  InputPassword,
  InputText,
  Message,
  useToast,
} from '@bernofarm/core'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

import { useAuthStore } from '@/features/auth/stores/authStore'
import { useValidateInput } from '@/features/auth/useValidateInput'

// --- 1. Definisikan Schema ---
const schema = z.object({
  nik: z
    .string('NIK wajib diisi')
    .min(1, 'NIK wajib diisi')
    .min(7, 'NIK harus berjumlah 7 karakter'),
  password: z.string('Password wajib diisi').min(1, 'Password wajib diisi'),
})

const router = useRouter()
const route = useRoute()

const errorLogin = ref<string | null>()
const isLoading = ref(false)

const { login } = useAuthStore()

const redirectQuery = route.query.redirect

const redirectPath = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery

const toast = useToast()
if (redirectPath) {
  toast.add({
    severity: 'error',
    summary: 'Peringatan',
    detail: 'Sesi anda telah berakhir, harap login kembali',
    life: 3000,
  })
}

// --- 2. Panggil Composable ---
const { resolver, fieldsToValidateOnUpdate, markTouched, onSubmit } = useValidateInput(
  schema,
  async (values) => {
    try {
      isLoading.value = true
      // 1. Tunggu proses login (API call & penyimpanan LocalStorage) selesai
      await login(values)

      // 3. Arahkan pengguna ke rute yang sesuai
      router.push(redirectPath || '/')
    } catch (error) {
      errorLogin.value = (error as Error).message
    } finally {
      isLoading.value = false
    }
  },
)
</script>

<template>
  <!-- Latar belakang hijau dan container untuk memposisikan konten di tengah layar -->
  <div class="min-h-screen bg-bnf-success flex items-center justify-center p-4 font-sans">
    <!-- Wrapper Kartu (Card) -->
    <div class="bg-bnf-surface rounded-2xl shadow-2xl w-full max-w-sm p-8">
      <!-- Bagian Header/Judul -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-bnf-text">Selamat Datang</h2>
        <p class="text-sm text-bnf-text-muted mt-1">Silakan login ke akun Anda</p>
      </div>

      <!-- Form Utama -->
      <Form
        :resolver="resolver"
        :validate-on-blur="true"
        :validate-on-value-update="fieldsToValidateOnUpdate"
        :validate-on-submit="true"
        class="flex flex-col gap-5"
        @submit="onSubmit"
      >
        <!-- NIK -->
        <FormField v-slot="$field" name="nik">
          <div class="flex flex-col gap-1.5">
            <label for="nik" class="text-sm font-semibold text-bnf-text"
              >Nomor Induk Karyawan (NIK)</label
            >
            <InputText
              id="nik"
              v-bind="$field"
              v-keyfilter.pint
              placeholder="Contoh: 1234567"
              class="w-full"
              type="text"
              inputmode="numeric"
              maxlength="7"
              @blur="markTouched('nik')"
            />
            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </div>
        </FormField>

        <!-- Password -->
        <FormField v-slot="$field" name="password">
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-sm font-semibold text-bnf-text">Password</label>
            <InputPassword
              id="password"
              v-bind="$field"
              placeholder="Masukan password anda"
              class="w-full"
              input-class="w-full"
              :feedback="false"
              toggle-mask
              @blur="markTouched('password')"
            />
            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">
              {{ $field.error?.message }}
            </Message>
          </div>
        </FormField>

        <div class="flex flex-col gap-3 mt-4 w-full">
          <Button type="submit" label="Login" class="w-full" size="large" />

          <Transition name="fade">
            <Message
              v-if="errorLogin"
              severity="error"
              size="small"
              variant="simple"
              class="flex justify-center text-center w-full m-0 pt-1"
            >
              {{ errorLogin }}
            </Message>
          </Transition>
        </div>
      </Form>
    </div>
  </div>
</template>
