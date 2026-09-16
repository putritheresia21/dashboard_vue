<!-- <template>
  <div class="flex justif-center">
    <Card class="max-w-sm w-full">
      <template #title>Welcome Back</template>
      <template #subtitle>Sign in with your email to continue.</template>
      <template #content>
        <form class="space-y-6 mt-3">
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText id="email" type="email" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label for="password" class="flex-1">Password</label>
              <Button variant="link" class="p-0">Forgot Password?</Button>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template> -->

<!-- contoh penerapan useValidateInput -->
<script setup lang="ts">
import { z } from 'zod'
import { Form, FormField } from '@primevue/forms'
import { InputText, Message, Password, Button } from 'primevue'
import { useValidateInput } from '@/composables/useValidateInput'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

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

// --- 2. Panggil Composable ---
const { resolver, fieldsToValidateOnUpdate, markTouched, onSubmit } = useValidateInput(
  schema,
  async (values) => {
    try {
      isLoading.value = true
      // 1. Tunggu proses login (API call & penyimpanan LocalStorage) selesai
      await login(values)

      console.log('User berhasil disimpan:', localStorage.getItem('user'))

      const redirectQuery = route.query.redirect

      const redirectPath = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery

      // 3. Arahkan pengguna ke rute yang sesuai
      router.push(redirectPath || '/')
    } catch (error) {
      // 3. Tangani jika login gagal (misal kredensial salah)
      console.error('Login gagal:', error)
      errorLogin.value = (error as Error).message
    } finally{
      isLoading.value = false
    }
  },
)
</script>

<template>
  <!-- Latar belakang hijau dan container untuk memposisikan konten di tengah layar -->
  <div class="min-h-screen bg-emerald-600 flex items-center justify-center p-4 font-sans">
    <!-- Wrapper Kartu (Card) -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
      <!-- Bagian Header/Judul -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Selamat Datang</h2>
        <p class="text-sm text-gray-500 mt-1">Silakan login ke akun Anda</p>
      </div>

      <!-- Form Utama -->
      <Form
        :resolver="resolver"
        :validateOnBlur="true"
        :validateOnValueUpdate="fieldsToValidateOnUpdate"
        :validateOnSubmit="true"
        @submit="onSubmit"
        class="flex flex-col gap-5"
      >
        <!-- NIK -->
        <FormField name="nik" v-slot="$field" class="flex flex-col gap-1.5">
          <label for="nik" class="text-sm font-semibold text-gray-700"
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
        </FormField>

        <!-- Password -->
        <FormField name="password" v-slot="$field" class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-semibold text-gray-700">Password</label>
          <Password
            id="password"
            v-bind="$field"
            placeholder="Masukan password anda"
            class="w-full [&>input]:w-full"
            inputClass="w-full"
            :feedback="false"
            toggleMask
            @blur="markTouched('password')"
          />
          <Message v-if="$field.invalid" severity="error" size="small" variant="simple">
            {{ $field.error?.message }}
          </Message>
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
