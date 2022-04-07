<template>
  <router-view v-if="showPage"/>
  <van-overlay v-model:show="showLoading" class-name="app-loading-overlay">
    <div class="app-loading-container">
      <van-loading type="spinner">加载中</van-loading>
    </div>
  </van-overlay>
</template>

<script lang="ts" setup>
import {computed, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import {_uu} from "@/utils/func";
import {useStore} from "vuex";

const store = useStore();
const router = useRouter();
const showLoading = ref(false);

const showPage = computed(function () {
  return store.state.user || !router.currentRoute.value.meta.needLogin;
})

/**
 * 用来更新页面标题的方法
 */
function updateDocumentTitle() {
  if (router.currentRoute.value.meta.title) {
    document.title = `${process.env.VUE_APP_NAME} - ${router.currentRoute.value.meta.title}`
  } else if (document.title !== process.env.VUE_APP_NAME) {
    document.title = process.env.VUE_APP_NAME
  }
}

let loadingCount = 0;

function updateLoading(loading: boolean) {
  if (loading) {
    loadingCount++;
  } else if (loadingCount > 0) {
    loadingCount--;
  }
  showLoading.value = loadingCount > 0;
}

// 处理页面切换的回调
router.afterEach(function () {
  // 页面切换后将页面滚动到最顶部
  window.scrollTo(0, 0);
  // 更新页面标题
  updateDocumentTitle();
  loadingCount = 0;
  updateLoading(false);
})

_uu.$on("update:documentTitle", updateDocumentTitle);
_uu.$on("update:loading", updateLoading)

onUnmounted(function () {
  _uu.$off("update:documentTitle", updateDocumentTitle)
  _uu.$off("update:loading", updateLoading);
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
    }

    button {
      background-color: unset;
    }

    a {
      color: inherit;
    }
  }
}

.van-overlay.app-loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  .app-loading-container {
    background-color: rgba(#ffffff, 0.8);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(black, 0.3);
    --van-loading-spinner-size: 24px;
    padding: 20px 20px;
    backdrop-filter: blur(2px);
  }
}
</style>
