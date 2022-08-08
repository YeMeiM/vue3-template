<template>
  <div class="page-container page" :style="{ background }">
    <slot name="header">
      <HeaderBar
        v-if="showHeader"
        :title="title"
        :is-back="isBack"
        v-bind="headerAttr"
        @clickLeft="$emit('clickLeft', $event)"
        @clickRight="$emit('clickRight', $event)"
        @dbClick="$emit('dbClick', $event)"
      />
    </slot>
    <van-pull-refresh
      v-if="refresh"
      @refresh="onRefresh"
      :modelValue="refreshLoading"
      @update:modelValue="onUpdateLoading"
      class="page-inner-container"
    >
      <slot name="default" />
      <slot
        name="loadStatus"
        v-if="typeof loading === 'boolean'"
        :loading="loading"
        :finished="finished"
      >
        <van-loading v-show="loading" v-if="loadingText" type="spinner">{{
          loadingText
        }}</van-loading>
        <p class="load-finished" v-if="finishedText" v-show="finished">
          {{ finishedText }}
        </p>
      </slot>
    </van-pull-refresh>
    <div class="page-inner-container" v-else>
      <slot name="default" />
      <slot
        name="loadStatus"
        v-if="typeof loading === 'boolean'"
        :loading="loading"
        :finished="finished"
      >
        <p class="load-finished" v-if="finishedText" v-show="finished">
          {{ finishedText }}
        </p>
        <van-loading
          v-show="!finished && loading"
          v-if="loadingText"
          type="spinner"
          >{{ loadingText }}</van-loading
        >
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  toRef,
  toRefs,
  watch,
} from "vue";
import HeaderBar from "@/components/HeaderBar.vue";

export default defineComponent({
  emits: {
    /**
     * 加载列表
     */
    load: null,
    /**
     * 更新loading状态
     */
    "update:loading": null,
    /**
     * 页面滚动
     */
    scroll: null,
    /**
     * 点击右侧按钮
     */
    clickRight: null,
    /**
     * 点击左侧按钮
     */
    clickLeft: null,
    /**
     * 双击标题
     */
    dbClick: null,
    /**
     * 页面刷新
     */
    refresh: null,
  },
  components: { HeaderBar },
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
      default: true,
    },
    staticBar: {
      type: Boolean,
    },
    headerBorder: {
      type: Boolean,
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
      default: true,
    },
    /**
     * 立刻加载列表
     */
    immediate: {
      type: Boolean,
      default: false,
    },
    /**
     * 列表加载中文本
     */
    loadingText: {
      type: String,
      default: "加载中...",
    },
    /**
     * 列表加载完成提示文案
     */
    finishedText: {
      type: String,
    },
    /**
     * 是否需要刷新
     */
    refresh: {
      type: Boolean,
      defualt: false,
    },
  },
  setup(props, ctx) {
    const data = reactive({
      refreshLoading: false,
    });

    function onUpdateLoading(loading: boolean) {
      // console.log("update loading", loading);
      data.refreshLoading = loading;
      ctx.emit("update:loading", loading);
    }

    function onLoad() {
      if (!props.loading && !props.finished) {
        console.log("load -list");
        ctx.emit("update:loading", true);
        ctx.emit("load");
      }
    }

    function onWindowScroll(event?: Event) {
      // console.log("window Scroll", event);
      const dEl = document.documentElement;
      const scrollBottom = dEl.scrollHeight - dEl.clientHeight - dEl.scrollTop;
      if (event) {
        ctx.emit("scroll", {
          top: dEl.scrollTop,
          left: dEl.scrollLeft,
          bottom: scrollBottom,
          right: dEl.scrollWidth - dEl.clientWidth - dEl.scrollLeft,
        });
      }
      if (scrollBottom <= 10) {
        onLoad();
      }
    }

    function onRefresh() {
      // console.log("page refresh", props.loading);
      ctx.emit("refresh");
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
    }));

    onMounted(function () {
      if (props.immediate) {
        onLoad();
      }
      window.addEventListener("scroll", onWindowScroll);
    });

    onBeforeUnmount(function () {
      window.removeEventListener("scroll", onWindowScroll);
    });

    watch(toRef(props, "loading"), function (val) {
      // console.log("change loading", val);
      if (!val) {
        nextTick(onWindowScroll);
        data.refreshLoading = false;
      }
    });

    return {
      ...toRefs(data),
      headerAttr,
      onRefresh,
      onUpdateLoading,
    };
  },
});
</script>

<style scoped lang="less">
.page-container {
  min-height: 100vh;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  background: var(--page-background, var(--s-default));

  .load-finished {
    text-align: center;
    padding: 10px 20px;
    color: var(--page-holder-text-color, var(--s-holder));
  }

  .van-loading {
    text-align: center;
    padding: 10px 20px;
    --van-loading-spinner-size: 22px;
    --van-loading-text-color: var(--page-holder-text-color, var(--s-holder));
  }

  .page-inner-container {
    flex: 1;
    padding: var(--page-padding, 0);
  }
}
</style>