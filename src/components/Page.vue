<!--Vue页面容器-->
<template>
  <div class="page-container page" :style="{background}">
    <HeaderBar v-if="showHeader" :title="title" :is-back="isBack" v-bind="headerAttr"/>
    <!--如果需要下拉刷新-->
    <van-pull-refresh v-model="refresh" @refresh="onRefresh" v-if="pullRefresh" >
      <slot name="default"/>
      <slot name="loadStatus" v-if="typeof loading === 'boolean'"
            :loading="loading" :finished="finished">
        <van-loading v-show="loading" v-if="loadingText" type="spinner">{{ loadingText }}</van-loading>
        <p class="load-finished" v-if="finishedText" v-show="finished">{{ finishedText }}</p>
      </slot>
    </van-pull-refresh>
    <!-- 不需要下拉刷新 -->
    <template v-else>
      <slot name="default"/>
      <slot name="loadStatus" v-if="typeof loading === 'boolean'"
            :loading="loading" :finished="finished">
        <van-loading v-show="loading" v-if="loadingText" type="spinner" >{{ loadingText }}</van-loading>
        <p class="load-finished" v-if="finishedText" v-show="finished">{{ finishedText }}</p>
      </slot>
    </template>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, reactive, toRef, toRefs, watch} from 'vue';
import HeaderBar from "@/components/HeaderBar.vue";

export default defineComponent({
  emits: {
    "load": null,
    "update:loading": null,
    "scroll": null,
  },
  components: {HeaderBar},
  props: {
    title: {
      type: String,
    },
    isBack: {
      type: Boolean,
    },
    backText: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    backUrl: {
      type: String,
    },
    rightUrl: {
      type: String,
    },
    headerStyle: {
      type: [Object, String],
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    staticBar: {
      type: Boolean,
    },
    headerBorder: {
      type: Boolean
    },
    background: {
      type: String,
    },
    noStatus: {
      type: Boolean,
    },
    noHolder: {
      type: Boolean,
    },
    /**
     * 左侧返回按钮图标
     */
    backIcon: {
      type: String,
    },
    /**
     * 列表是否在加载中
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * 列表加载全部完成
     */
    finished: {
      type: Boolean,
      default: false,
    },
    /**
     * 立刻加载列表
     */
    immediate: {
      type: Boolean,
      default: false,
    },
    /**
     * 列表加载状态文字
     */
    loadingText: {
      type: String,
      default: "加载中..."
    },
    /**
     * 列表加载完成文字
     */
    finishedText: {
      type: String,
      default: "没有更多了~"
    },
    /**
     * 是否需要下拉刷新
     */
    pullRefresh: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {

    // 数据对象
    const data = reactive({
      // 刷新状态
      refresh: false,
    })

    // 当请求列表数据时，触发
    function onLoad() {
      if (!props.loading && !props.finished) {
        ctx.emit("update:loading", true);
        ctx.emit("load");
      }
    }

    // 当页面滚动时，触发
    function onWindowScroll(event?: Event) {
      const dEl = document.documentElement;
      const scrollBottom = dEl.scrollHeight - dEl.clientHeight - dEl.scrollTop;
      if (event) {
        ctx.emit("scroll", {
          top: dEl.scrollTop,
          left: dEl.scrollLeft,
          bottom: scrollBottom,
          right: dEl.scrollWidth - dEl.clientWidth - dEl.scrollLeft,
        })
      }
      if (scrollBottom === 0) {
        onLoad();
      }
    }

    // 当触发刷新时
    function onRefresh() {
      onLoad();
    }

    // 头部导航栏参数
    const headerAttr = computed(() => ({
      backText: props.backText,
      backUrl: props.backUrl,
      rightUrl: props.rightUrl,
      subtitle: props.subtitle,
      customStyle: props.headerStyle,
      staticBar: props.staticBar,
      border: props.headerBorder,
      noHolder: props.noHolder,
      noStatus: props.noStatus,
      backIcon: props.backIcon,
    }))

    // 添加窗口滚动监听
    window.addEventListener("scroll", onWindowScroll);

    // 页面加载完成时，触发
    onMounted(function () {
      if (props.immediate) {
        onLoad();
      }
    })

    // 页面卸载时，触发
    onUnmounted(function () {
      window.removeEventListener("scroll", onWindowScroll);
    })

    // 监听列表加载状态
    watch(toRef(props, "loading"), function (val) {
      // 如果加载状态为结束，触发窗口滚动监听，并且取消刷新状态
      if (!val) {
        onWindowScroll();
        data.refresh = false;
      }
    })

    return {
      headerAttr,
      ...toRefs(data),
      onRefresh,
    }
  },
})
</script>

<style scoped lang="less">
.page-container {
  min-height: 100vh;
  position: relative;
  z-index: 0;
  overflow: hidden;

  .load-finished {
    text-align: center;
    padding: 10px 20px;
    color: var(--page-holder-text-color, @holder);
  }

  .van-loading {
    text-align: center;
    padding: 10px 20px;
    --van-loading-spinner-size: 22px;
    --van-loading-text-color: var(--page-holder-text-color, @holder);
  }

  :deep(.van-pull-refresh__track) {
    min-height: calc(100vh - var(--simple-header-bar-height));
  }
}
</style>