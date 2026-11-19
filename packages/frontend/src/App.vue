<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot, SwitchRoot, SwitchThumb } from '@py-agent/core-ui'
import { useI18n } from 'vue-i18n'
import { isDark, setDarkMode, setLocale, storageError } from './preferences'

const { t, locale } = useI18n()
const stages = ['foundations', 'retrieval', 'agents'] as const
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-6 sm:px-12">
    <header class="flex flex-wrap items-center justify-between gap-6 border-b border-border py-7">
      <div>
        <p class="text-base font-semibold tracking-tight">Python Agent Starter<span class="text-primary">.</span></p>
        <p class="mt-1 text-sm text-muted-foreground">{{ t('workspace') }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-6">
        <RadioGroupRoot
          :model-value="locale"
          :aria-label="t('language')"
          orientation="horizontal"
          class="flex gap-1 rounded-lg bg-muted p-1"
          @update:model-value="setLocale"
        >
          <RadioGroupItem value="zh-CN" lang="zh-CN" class="rounded-md px-3 py-2 text-sm text-muted-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm">中文</RadioGroupItem>
          <RadioGroupItem value="en-US" lang="en-US" class="rounded-md px-3 py-2 text-sm text-muted-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm">English</RadioGroupItem>
        </RadioGroupRoot>
        <div class="flex items-center gap-3">
          <label for="dark-mode" class="text-sm text-muted-foreground">{{ t('darkMode') }}</label>
          <SwitchRoot
            id="dark-mode"
            :aria-label="t('darkMode')"
            :model-value="isDark"
            class="h-6 w-11 rounded-full bg-border p-0.5 data-[state=checked]:bg-primary"
            @update:model-value="setDarkMode"
          >
            <SwitchThumb class="block size-5 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-5 motion-reduce:transition-none" />
          </SwitchRoot>
        </div>
      </div>
    </header>

    <main class="flex-1 py-16 sm:py-24">
      <p v-if="storageError" role="alert" class="mb-8 rounded-lg border border-border bg-muted p-4 text-sm">{{ t('storageError') }}</p>
      <p class="mb-6 text-sm font-medium tracking-wide text-primary">{{ t('eyebrow') }}</p>
      <h1 class="max-w-4xl whitespace-pre-line text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{{ t('title') }}</h1>
      <p class="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{{ t('intro') }}</p>

      <section class="mt-20" aria-labelledby="roadmap-heading">
        <h2 id="roadmap-heading" class="text-xl font-semibold">{{ t('roadmap') }}</h2>
        <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ t('roadmapDescription') }}</p>
        <ul class="mt-7 divide-y divide-border border-y border-border">
          <li v-for="stage in stages" :key="stage" class="flex flex-wrap items-center justify-between gap-4 py-6">
            <div>
              <h3 class="font-medium">{{ t(stage) }}</h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ t(`${stage}Detail`) }}</p>
            </div>
            <span class="rounded-full bg-muted px-3 py-1.5 text-sm" :class="stage === 'foundations' ? 'text-primary' : 'text-muted-foreground'">{{ t(stage === 'foundations' ? 'ready' : 'planned') }}</span>
          </li>
        </ul>
      </section>
    </main>
    <footer class="border-t border-border py-6 text-sm leading-6 text-muted-foreground">{{ t('footer') }}</footer>
  </div>
</template>
