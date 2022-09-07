<template>
  <span class="simple-code" @click="onClick">
    <slot name="default" v-if="time <= 0">{{ text }}</slot>
    <slot name="holder" v-else>{{ time }} s</slot>
  </span>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, PropType, reactive, toRefs } from "vue";

export interface SimpleCodeInstance {
  /**
   * 开始倒计时
   */
  start: () => void;
  /**
   * 结束倒计时
   */
  end: () => void;
  /**
   * 锁住点击事件，防止多次点击，当调用end或loading结束时会自动解开
   */
  lock: () => void;
  /**
   * 解开锁，允许继续点击
   */
  unlock: () => void;
}

export default defineComponent({
  emits: {
    /**
     * 点击组件
     */
    click: null,
    /**
     * 倒计时结束
     */
    finished: null,
  },
  props: {
    /**
     * 初始文字
     */
    text: {
      type: String,
      default: "获取验证码",
    },
    /**
     * 倒计时持续时间
     */
    duration: {
      type: [Number, String],
      default: 60,
    },
    /**
     * 事件处理器
     */
    handler: {
      type: Function as PropType<() => Promise<void> | boolean>,
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    let timer = NaN;
    let doing = false;
    const data = reactive({
      time: 0,
    });

    const lock = () => (doing = true);
    const unlock = () => (doing = false);

    function end() {
      unlock();
      if (!isNaN(timer)) {
        clearInterval(timer);
      }
    }

    function start() {
      end();
      data.time = Number(props.duration);
      timer = window.setInterval(function () {
        data.time--;
        if (data.time > 0) return;
        end();
        ctx.emit("finished");
      }, 1000);
    }

    function onClick() {
      if (doing || props.disabled) return;
      // console.log("click")
      if (props.handler) {
        lock();
        const result = props.handler();
        if (result instanceof Promise) result.then(start).catch(unlock);
        else if (result) start();
      }
      ctx.emit("click", { start, end, lock, unlock });
    }

    ctx.expose({
      start,
      end,
      lock,
      unlock,
    });

    onUnmounted(end);

    return {
      ...toRefs(data),
      onClick,
    };
  },
});
</script>

<style scoped lang="less">
</style>