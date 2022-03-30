<template>
  <div class="page-container page" :style="{background}">
    <HeaderBar v-if="showHeader" :title="title" :is-back="isBack" v-bind="headerAttr"/>
    <slot name="default"/>
    <slot name="loadStatus" v-if="typeof loading === 'boolean'"
          :loading="loading" :finished="finished">
      <van-loading v-show="loading" v-if="loadingText" type="spinner">{{ loadingText }}</van-loading>
      <p class="load-finished" v-if="finishedText" v-show="finished">{{ finishedText }}</p>
    </slot>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, toRef, watch} from 'vue';
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
    loadingText: {
      type: String,
      default: "加载中..."
    },
    finishedText: {
      type: String,
      default: "没有更多了~"
    }
  },
  setup(props, ctx) {

    function onLoad() {
      if (!props.loading && !props.finished) {
        ctx.emit("update:loading", true);
        ctx.emit("load");
      }
    }

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

    window.addEventListener("scroll", onWindowScroll);

    onMounted(function () {
      if (props.immediate) {
        onLoad();
      }
    })

    onUnmounted(function () {
      window.removeEventListener("scroll", onWindowScroll);
    })

    watch(toRef(props, "loading"), function (val) {
      !val && onWindowScroll();
    })

    return {
      headerAttr
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
}
</style>