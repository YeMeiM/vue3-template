<template>
  <div class="header-bar-holder" :class="{'holder-show': !noHolder}" :style="{'--status-bar-height':noStatus ? 0:''}">
    <div class="header-bar" :style="customStyle" :class="{ 'fix-bar': !staticBar, 'border-bar': border }">
      <div class="left-container">
        <div class="back-box" v-if="!isBack" @click="onClickHandler(1)">
          <img :src="backIcon" v-if="backIcon" alt="返回" class="back-icon">
          <van-icon v-else name="arrow-left" size="0.7rem" ></van-icon>
          <span class="back-text" v-if="backText">{{ backText }}</span>
        </div>
      </div>
      <div class="title-container" @click="onClickHandler(0)">
        <span class="title-text">{{ titleText }}</span>
      </div>
      <div class="right-container">
        <div class="right-box" @click="onClickHandler(2)" v-if="subtitle">
          <span class="subtitle-text">{{ subtitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, toRef, watch} from 'vue';
import {useRouter} from "vue-router";
import {_uu} from "@/utils/func";

export default defineComponent({
  emits: {
    dbClick: null,
    clickRight: null,
    clickLeft: null,
  },
  props: {
    title: {
      type: String,
    },
    isBack: {
      type: Boolean,
      default: false,
    },
    backText: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    backIcon: {
      type: String,
    },
    backUrl: {
      type: String,
      default: "",
    },
    rightUrl: {
      type: String,
    },
    customStyle: {
      type: [String, Object],
    },
    staticBar: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    noStatus: {
      type: Boolean,
      default: false,
    },
    noHolder: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, ctx) {
    const router = useRouter();
    const titleText = ref(props.title ?? router.currentRoute.value.meta.title as string ?? "");

    let lastClickTitle = 0;

    /**
     * 点击事件
     * @param type 0 title 1 back 2 right
     */
    function onClickHandler(type: number) {
      // 双击标题
      if (type === 0) {
        const now = new Date().getTime();
        if (now - lastClickTitle <= 200) {
          ctx.emit("dbClick");
        }
        lastClickTitle = now;
      } else {
        let url: any;
        // 左侧按钮
        if (type === 1) {
          url = props.backUrl;
          ctx.emit("clickLeft", (): void => (url = undefined))
        }
        // 右侧按钮
        else {
          console.log("right");
          url = props.rightUrl
          ctx.emit("clickRight", (): void => (url = undefined))
        }

        // 如果url是空字符串, 返回上一页
        if (url === "") {
          if (window.history.state.position === 0) {
            _uu.$emit("native:handler", "back");
          } else {
            router.back();
          }
        }
        // 如果url不为空, 跳转
        else if (url) {
          router.push(url);
        }

      }
    }

    watch(toRef(props, "title"), () => {
      titleText.value = props.title ?? router.currentRoute.value.meta.title as string ?? "";
    })

    return {
      onClickHandler,
      titleText
    }
  },
})
</script>

<style scoped lang="less">
.header-bar-holder {

  &.holder-show {
    height: calc(var(--simple-header-bar-height) + var(--status-bar-height));
  }
}

.header-bar {
  height: var(--simple-header-bar-height);
  box-sizing: content-box;
  padding-top: var(--status-bar-height);
  background: var(--simple-header-bar-background);
  display: flex;
  align-items: center;
  color: #333333;

  &.border-bar {
    border-bottom: 1px solid #EAEAEA;
  }

  &.fix-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }

  .title-container, .back-box, .right-box {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
  }

  .title-container {
    flex: 1;
    text-align: center;

    .title-text {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 25px;
    }
  }

  .left-container {
    width: 30%;
    overflow: hidden;
    flex-shrink: 0;
    text-align: left;
    padding: 0 12px;

    .back-icon {
      width: 22px;
      height: 22px;
      vertical-align: middle;
    }

    .back-text {
      vertical-align: middle;
    }
  }

  .right-container {
    width: 30%;
    overflow: hidden;
    flex-shrink: 0;
    text-align: right;
    padding: 0 12px;

    .right-box:empty {
      display: none;
    }
  }
}
</style>