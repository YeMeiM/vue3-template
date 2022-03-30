<template>
  <div class="qrcode" :style="{ background, padding: $uu.rem(Number(margin)) }" ref="el">
    <canvas ref="canvasEl" class="qrcode-canvas"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, reactive, toRefs, watch} from 'vue';
import QRCode from "qrcode";
import {_uu} from "@/utils/func";

export default defineComponent({
  props: {
    value: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
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
  },
  setup(props,) {
    const data = reactive({
      el: null as HTMLDivElement,
      canvasEl: null as HTMLCanvasElement,
    })

    let flag: string = null;

    function drawText(text: string) {
      flag = text;
      nextTick(function () {
        if (data.canvasEl) {
          QRCode.toCanvas(data.canvasEl, text, {
            width: data.el.clientWidth - parseFloat(_uu.style(data.el, "padding")) * 2,
            color: {
              dark: props.color,
              light: props.background,
            },
            margin: 0,
          }, function () {
            if (flag && flag !== text) {
              drawText(text);
            } else {
              flag = null;
            }
          })
        }
      })
    }

    drawText(props.value);

    watch(props, (val) => {
      drawText(val.value);
    })

    return {
      ...toRefs(data),
    }
  },
})
</script>

<style scoped lang="less">
.qrcode {
  display: inline-block;

  .qrcode-canvas {
    width: 100%;
    height: 100%;
  }
}
</style>