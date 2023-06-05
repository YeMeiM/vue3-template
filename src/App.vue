<template>
  <router-view v-slot="{ Component, route }">
    <transition name="van-fade">
      <component :is="Component" :key="route.path"/>
    </transition>
  </router-view>
  <van-overlay v-model:show="showLoading" class-name="app-loading-overlay">
    <div class="app-loading-container">
      <van-loading type="spinner">加载中</van-loading>
    </div>
  </van-overlay>
</template>

<script lang="ts" setup>
import {onUnmounted, ref} from "vue";
import {_uu} from "@/utils/func";
import {useStore} from "vuex";
import {Toast} from "vant";

const store = useStore();
const showLoading = ref(false);

async function onChangeVersion(verNum: string | number) {
  if (typeof verNum === 'number') verNum = verNum.toString();
  const version = [verNum[0], verNum[1], verNum.substring(2)].join('.');
  store.commit("SET_APP_VERSION", version);
  try {
    const res = await _uu.req({
      module: "Utils",
      interface: "1002",
      data: {platform: 1, version}
    })
    if (!window.test) throw new Error("Android Object Not Found");
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
  } catch (err: any) {
    console.log("检测更新失败", err);
    Toast(err.message || "检测更新失败");
  }
}

// 添加自动更新事件
window.changeversion = onChangeVersion;

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
  loadingCount = 0;
  showLoading.value = false;
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
