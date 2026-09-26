import { createI18n } from 'vue-i18n'
import translations from '@/locales/translations.json'
import translationsEn from '@/locales/translations_en.json'
import { Language } from '@/constants/enums.js'

export const i18n = createI18n({
  legacy: false,
  locale: Language.EST,
  fallbackLocale: Language.ENG,
  messages: {
    [Language.EST]: translations.ee,
    [Language.ENG]: translationsEn.en,
  },
})
