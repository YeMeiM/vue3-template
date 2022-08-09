<template>
  <div
    class="simple-qrcode"
    :style="{ background, padding: $uu.rem(Number(margin)) }"
    ref="el"
  >
    <canvas ref="canvasEl" class="qrcode-canvas" />
    <slot name="default"></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  readonly,
  Ref,
  ref,
  toRefs,
  watch,
} from "vue";
import QRCode from "qrcode";
import { _uu } from "@/utils/func";

/**
 * SimpleQrcode实例
 */
export interface SimpleQrcodeInstance {
  /**
   * 画文字
   */
  drawText: (text: string) => void;
  /**
   * 获取二维码图片数据
   */
  getQrcode: () => Promise<string>;
  /**
   * canvas实例
   */
  canvas: Readonly<Ref<HTMLCanvasElement>>;
}

export default defineComponent({
  props: {
    value: {
      type: String,
    },
    color: {
      type: String,
      default: "#000000",
    },
    background: {
      type: String,
      default: "#ffffff",
    },
    margin: {
      type: [Number, String],
      default: 0,
    },
    icon: {
      type: String,
    },
  },
  setup(props, ctx) {
    const canvasEl = ref<HTMLCanvasElement>(null);

    const data = reactive({
      el: null as HTMLDivElement,
    });
    
    function drawIcon() {
      if (props.icon) {
        const image = new Image();
        image.src = props.icon;
        image.onload = () => {
          const ctx = canvasEl.value.getContext("2d");
          const padding = parseFloat(_uu.style(data.el, "padding"));
          const size = Math.floor((data.el.clientWidth - padding * 2) * 0.4);
          ctx.drawImage(image, 0, 0, size, size);
        };
      }
      ctx.emit("finish");
    }

    function drawText(text: string) {
      if (canvasEl.value) {
        const padding = parseFloat(_uu.style(data.el, "padding"));
        QRCode.toCanvas(canvasEl.value, text, {
          width: data.el.clientWidth - padding * 2,
          color: { dark: props.color, light: props.background },
          margin: 0,
        });
        drawIcon();
      }
    }

    function getQrCode() {
      return new Promise((resolve, reject) => {
        if (!canvasEl.value) return reject(new Error("尚未初始化"));
        resolve(canvasEl.value.toDataURL("image/png"));
      });
    }

    onMounted(() => drawText(props.value));

    watch(props, (val) => drawText(val.value));

    ctx.expose({
      drawText,
      getQrCode,
      canvas: readonly(canvasEl),
    });

    return {
      ...toRefs(data),
      canvasEl,
    };
  },
});
</script>

<style scoped lang="less">
.simple-qrcode {
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  .qrcode-canvas {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
}
</style>