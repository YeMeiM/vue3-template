<template>
  <router-view v-slot="{ Component, route }">
    <transition name="van-fade">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <van-overlay v-model:show="showLoading" class-name="app-loading-overlay">
    <div class="app-loading-container">
      <van-loading type="spinner">加载中</van-loading>
    </div>
  </van-overlay>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { _uu } from "@/utils/func";
import { useStore } from "vuex";
import { Toast } from "vant";

const router = useRouter();
const store = useStore();
const showLoading = ref(false);

// 添加自动更新事件
window.changeversion = function (verNum: string | number) {
  verNum = verNum.toString();
  store.commit(
    "SET_APP_VERSION",
    `${verNum.substring(0, verNum.length - 2)}.${verNum[verNum.length - 2]}.${
      verNum[verNum.length - 1]
    }`
  );
  _uu
    .req({
      module: "Utils",
      interface: "1002",
      data: {
        platform: 1,
        version: store.state.version,
      },
      tips: false,
      loading: false,
    })
    .then((res) => {
      if (res.needUpgrade) {
        // 如果没有android原生交互对象 报错，会被catch
        if (!window.test) throw new Error("未找到android原生交互对象");
        //调用android原生的更新方法 注：格式固定
        window.test.version(
          JSON.stringify({
            newVersion: res.newVersion.version,
            VersionCode: res.newVersion.version.replace(/\./g, ""),
            Version_force: res.newVersion.version,
            VersionCode_force: res.newVersion.version.replace(/\./g, ""),
            downurl: res.newVersion.apkUrl,
            isUpdate: 1,
            forceUpdate: res.newVersion.isForced,
            updateDescription:
              res.newVersion.updateDescription ?? "1、修复若干bug",
          })
        );
      }
    })
    .catch((err) => {
      console.log("检测更新失败", err);
      Toast(err.message || "检测更新失败");
    });
};

// 处理页面切换的回调
router.afterEach(function () {
  // 页面切换后将页面滚动到最顶部
  window.scrollTo(0, 0);
});

// 加载状态
let loadingCount = 0;

// 添加loading监听
const loadingKey = _uu.$on("update:loading", (loading: boolean) => {
  loadingCount += loading ? 1 : -1;
  showLoading.value = loadingCount > 0;
});

onUnmounted(function () {
  // 去除监听
  _uu.$off("update:loading", loadingKey);
});
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
    color: var(--s-basis);

    input,
    textarea {
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
    padding: 20px 20px;
    backdrop-filter: blur(2px);
    --van-loading-spinner-size: 24px;
  }
}
</style>
