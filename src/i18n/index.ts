import zh from "./zh"
import en from "./en"
import { createI18n } from "vue-i18n";

export const i18n = createI18n({
  locale: "zh",
  messages: {
    zh,
    en
  }
});