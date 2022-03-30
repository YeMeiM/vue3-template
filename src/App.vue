<template>
  <div class="app-container">
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted} from "vue";
import {useRouter} from "vue-router";
import {_uu} from "@/utils/func";

const router = useRouter();

function updateDocumentTitle(text: string | string[]) {
  if (Array.isArray(text)) {
    text = text.join(" - ");
  }
  document.title = text;
}

router.afterEach(function (to) {
  if (window.sessionStorage.historyNum === undefined) {
    window.sessionStorage.historyNum = window.history.state.position;
  }
  window.scrollTo(0, 0);
  const titleList = [] as string[];
  if (process.env.VUE_APP_NAME) {
    titleList.push(process.env.VUE_APP_NAME);
  }
  if (typeof to.meta.title === "string") {
    titleList.push(to.meta.title);
  }
  titleList.length && updateDocumentTitle(titleList);
})

_uu.$on("update:documentTitle", updateDocumentTitle);

onUnmounted(function () {
  _uu.$off("update:documentTitle", updateDocumentTitle)
})
</script>

<style lang="less">
@import "./style/app.less";
@import "./style/cssVer.less";

* {
  border: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
}

html {

  body {
    font-size: 14px;
    margin: 0;
    font-family: PingFangSC-Regular, PingFang SC;
    color: @base;

    input {
      width: 100%;
      flex: 1;
      outline: none;

      &::-ms-reveal {
        display: none;
      }
    }

    button {
      background-color: unset;
    }

    a {
      color: inherit;
    }
  }
}
</style>
