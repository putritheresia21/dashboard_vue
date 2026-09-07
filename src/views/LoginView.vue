<template>
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
</template>
