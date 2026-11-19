import { ref, watchEffect } from 'vue'
import { i18n } from './i18n'

const storageKey = 'py-agent-starter:preferences'
export const isDark = ref(false)
export const storageError = ref(false)

export function initializePreferences(): void {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches

  try {
    const saved = window.localStorage.getItem(storageKey)
    if (saved !== null) {
      const value: unknown = JSON.parse(saved)
      if (
        typeof value !== 'object' || value === null ||
        !('locale' in value) || (value.locale !== 'zh-CN' && value.locale !== 'en-US') ||
        !('dark' in value) || typeof value.dark !== 'boolean'
      ) {
        throw new Error('Invalid display preferences')
      }
      i18n.global.locale.value = value.locale
      isDark.value = value.dark
    }
  } catch {
    storageError.value = true
  }

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
    document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
    document.documentElement.lang = i18n.global.locale.value
    document.title = i18n.global.t('pageTitle')
  })
}

function savePreferences(): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({
      locale: i18n.global.locale.value,
      dark: isDark.value,
    }))
    storageError.value = false
  } catch {
    storageError.value = true
  }
}

export function setLocale(value: unknown): void {
  if (value !== 'zh-CN' && value !== 'en-US') {
    throw new Error('Unsupported display language')
  }
  i18n.global.locale.value = value
  savePreferences()
}

export function setDarkMode(value: boolean): void {
  isDark.value = value
  savePreferences()
}
