<script setup lang="ts">
import { ShadcnButton } from '@/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { ShadcnInput } from '@/ui/input';

import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { authApi } from '@/api';
import { useTokenStore } from '@/stores';

const formSchema = toTypedSchema(
  yup.object({
    username: yup
      .string()
      .required('Логин обязателен')
      .min(3, 'Логин должен содержать минимум 3 символа')
      .max(20, 'Логин не должен превышать 20 символов'),
    password: yup
      .string()
      .required('Пароль обязателен')
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .max(64, 'Пароль дне должен превышать 64 символов'),
    confirmPassword: yup
      .string()
      .required('Подтверждение пароля обязательно')
      .oneOf([yup.ref('password')], 'Пароли не совпадают'),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});
const tokenStore = useTokenStore();

const onSubmit = handleSubmit(async values => {
  try {
    const { username, password } = values;
    const { data: tokens } = await authApi.register({ username, password });
    tokenStore.setTokens(tokens);
  } catch (error) {
    console.error(error);
    // TODO: add notification if user exists
  }
});
</script>

<template>
  <div class="flex h-[100vh] items-center p-3">
    <form class="w-full rounded-lg bg-secondary p-3" @submit="onSubmit">
      <h1 class="mb-3 text-center text-xl font-medium">Зарегистрироваться</h1>

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

      <FormField v-slot="{ componentField, errors }" name="confirmPassword">
        <FormItem>
          <FormLabel class="font-medium">Подтвердите пароль</FormLabel>

          <FormControl>
            <ShadcnInput type="password" v-bind="componentField" :error-state="errors.length > 0" />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <ShadcnButton class="mx-auto mt-6 block" type="submit"> Отправить </ShadcnButton>
    </form>
  </div>
</template>
