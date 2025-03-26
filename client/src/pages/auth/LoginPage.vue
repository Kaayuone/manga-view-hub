<script setup lang="ts">
import { ShadcnButton } from '@/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { ShadcnInput } from '@/ui/input';

import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { authApi } from '@/api';
import { useTokenStore } from '@/stores';
import { useRouter } from 'vue-router';

const formSchema = toTypedSchema(
  yup.object({
    username: yup.string().required('Логин обязателен'),
    password: yup.string().required('Пароль обязателен'),
  }),
);

const router = useRouter();
const { handleSubmit } = useForm({
  validationSchema: formSchema,
});
const tokenStore = useTokenStore();

const onSubmit = handleSubmit(async values => {
  try {
    const { username, password } = values;
    const { data: tokens } = await authApi.login({ username, password });
    tokenStore.setTokens(tokens);
    router.replace({ name: 'user-profile' });
  } catch (error) {
    console.error(error);
    // TODO: add notification if wrong data
  }
});
</script>

<template>
  <div class="flex h-[100vh] items-center p-3">
    <form class="w-full rounded-lg bg-secondary p-3" @submit="onSubmit">
      <h1 class="mb-3 text-center text-xl font-medium">Авторизоваться</h1>

      <FormField
        v-slot="{ componentField, errors }"
        :validate-on-model-update="false"
        name="username"
      >
        <FormItem class="mb-3">
          <FormLabel class="font-medium">Логин</FormLabel>

          <FormControl>
            <ShadcnInput type="text" v-bind="componentField" :error-state="errors.length > 0" />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField, errors }"
        :validate-on-model-update="false"
        name="password"
      >
        <FormItem class="mb-3">
          <FormLabel class="font-medium">Пароль</FormLabel>

          <FormControl>
            <ShadcnInput type="password" v-bind="componentField" :error-state="errors.length > 0" />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <!-- TODO: add loader -->
      <ShadcnButton class="mx-auto mt-6 block" type="submit"> Войти </ShadcnButton>
    </form>
  </div>
</template>
