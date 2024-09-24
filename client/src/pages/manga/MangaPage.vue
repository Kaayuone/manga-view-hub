<script setup lang="ts">
import ChapterItem from '@/features/chapter-item';
import {
  ArrowDownToLine,
  ArrowLeft,
  Clock,
  EllipsisVertical,
  Heart,
  Play,
  User,
} from 'lucide-vue-next';
import { ShadcnButton } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Card } from '@/ui/card';
import { AspectRatio } from '@/ui/aspect-ratio';
import { Badge } from '@/ui/badge';

import { useRouter } from 'vue-router';
import { Separator } from '@/ui/separator';

const props = defineProps<{
  id: number;
}>();

const router = useRouter();

function read() {
  // router.push
}

function backToList() {
  router.back();
}
</script>

<template>
  <div class="pb-3">
    <div class="sticky top-0 z-[1] flex justify-between bg-background py-2">
      <ShadcnButton variant="ghost" size="icon" @click="backToList">
        <ArrowLeft />
      </ShadcnButton>

      <div class="flex gap-x-2">
        <ShadcnButton variant="ghost" size="icon">
          <Heart />
        </ShadcnButton>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <ShadcnButton variant="ghost" size="icon">
              <ArrowDownToLine />
            </ShadcnButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Следующая глава</DropdownMenuItem>
            <DropdownMenuItem>Следующие 5 глав</DropdownMenuItem>
            <DropdownMenuItem>Следующие 10 глав</DropdownMenuItem>
            <DropdownMenuItem>Следующие 25 глав</DropdownMenuItem>
            <DropdownMenuItem>Непрочитанные главы</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <ShadcnButton variant="ghost" size="icon">
              <EllipsisVertical />
            </ShadcnButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Обновить</DropdownMenuItem>
            <DropdownMenuItem>Поделиться</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div class="my-3 flex items-center">
      <div class="min-w-[100px]">
        <AspectRatio :ratio="2 / 3">
          <Card class="h-full p-2 text-xs"> Изображение манги будет здесь </Card>
        </AspectRatio>
      </div>

      <div class="ml-3 flex flex-col">
        <h1 class="mb-2 text-sm">Интересное название интересной манги</h1>

        <div class="mb-2 flex items-center gap-x-1 text-2xs">
          <User class="h-4 w-4" />
          <span>Автор</span>
        </div>

        <div class="flex items-center gap-x-1 text-2xs">
          <Clock class="h-4 w-4" />
          <span>Статус</span>
        </div>
      </div>
    </div>

    <!-- TODO: Сворачивание описания и тегов -->
    <div class="mb-3 text-xs">
      <p>
        Описание манги. Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные
        тексты. Буквенных однажды, одна бросил залетают снова проектах послушавшись грустный.
        Деревни единственное своих она правилами большой диких послушавшись языкового, бросил от
        всех.
      </p>
      <p>
        Описание манги. Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные
        тексты. Буквенных однажды, одна бросил залетают снова проектах послушавшись грустный.
        Деревни единственное своих она правилами большой диких послушавшись языкового, бросил от
        всех.
      </p>
    </div>

    <div class="mb-3 flex flex-wrap gap-1.5">
      <Badge size="small">Тег 1</Badge>
      <Badge size="small">Имба</Badge>
      <Badge size="small">Люто</Badge>
      <Badge size="small">Фэнтези</Badge>
      <Badge size="small">Исекай</Badge>
      <Badge size="small">Манхва</Badge>
      <Badge size="small">Тег 2</Badge>
      <Badge size="small">Умный ГГ</Badge>
      <Badge size="small">Фэнтези 2</Badge>
      <Badge size="small">Исекай 3</Badge>
    </div>

    <!-- TODO: Подгружать с пагинацией, на странице глав 50 -->
    <template v-for="number in 15" :key="number">
      <ChapterItem />

      <Separator v-if="number === 7" class="my-2" label="Прочитано" />
      <Separator v-else-if="number !== 15" class="my-2" />
    </template>

    <ShadcnButton class="sticky bottom-3 ml-auto flex" size="sm" @click="read">
      <Play :size="16" class="mr-2" /> Читать
    </ShadcnButton>
  </div>
</template>
