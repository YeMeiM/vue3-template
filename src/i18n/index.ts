import zh from "./zh"
import en from "./en"
import { createI18n } from "vue-i18n";
import { toRef, watch } from "vue";

const USER_LANG_NAME = "USER_LANG";

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(USER_LANG_NAME) || "zh",
  messages: {
    zh,
    en
  }
});

watch(toRef(i18n.global, "locale"), (locale) => localStorage.setItem(USER_LANG_NAME, locale))
