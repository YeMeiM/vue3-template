<template>
  <van-popup :show="show" @update:show="onUpdateShow" class="simple-password" position="center"
             @opened="focusInput" @open="onOpen">
    <div class="simple-password-title">请输入密码</div>
    <div class="simple-password-input-group" @click="focusInput">
      <input type="text" ref="myInput" maxlength="6" class="hidden-input" @input="onInputText" @blur="current = -1"
             @focus="onfocus">
      <div class="input-box" v-for="(item,index) in 6 " :key="item"
           :class="{active: index === current || (index === 5 && index === current - 1)}">
        <span class="password-point" v-if="inputList[index]"></span>
      </div>
    </div>
    <div class="simple-password-button-group">
      <button class="cancel-button" @click="onCancel">取消</button>
      <button class="confirm-button" @click="onConfirm">确定</button>
    </div>
  </van-popup>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  emits: {
    "update:show": null,
    cancel: null,
    confirm: null,
  },
  props: {
    // 展示状态
    show: {
      type: Boolean,
      default: false,
    },
    // 操作回调
    callback: {
      type: Function,
    }
  },
  name: "SimplePassword",
  setup(props, ctx) {
    /**
     * 更新展示状态
     * @param show
     */
    function onUpdateShow(show: false) {
      ctx.emit("update:show", show);
    }

    return {
      onUpdateShow
    }
  },
  data() {
    return {
      current: -1,
      inputList: new Array(6).fill(""),
      text: "",
    }
  },
  methods: {
    onInput(value: boolean) {
      this.$emit("update:show", value);
    },
    onOpen() {
      this.inputList = new Array(6).fill("");

      if (this.$refs.myInput) {
        (this.$refs.myInput as HTMLInputElement).value = this.text = "";
      }
    },
    onfocus() {
      this.current = this.text.length;
    },
    onInputText(event: any) {
      event.target.value = event.target.value.replace(/\D+/g, '');
      this.text = event.target.value;
      for (const i in this.inputList) {
        this.inputList[i] = this.text[i] ?? "";
      }
      this.current = this.text.length
    },
    focusInput() {
      (this.$refs.myInput as HTMLInputElement).focus();
    },
    onCancel() {
      if (this.callback) {
        this.callback({action: "cancel", value: ""})
      }
      this.$emit("cancel");
      this.onInput(false);
    },
    onConfirm() {
      if (this.callback) {
        this.callback({action: "confirm", value: this.text})
      }
      this.$emit("confirm", this.text);
      this.onInput(false);
    }
  },
})
</script>

<style scoped lang="scss">
.simple-password {
  &.van-popup {
    width: 340px;
    background: #FFFFFF;
    border-radius: 5px;
    opacity: 1;
  }

  .simple-password-title {
    font-size: 16px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #000000;
    text-align: center;
    padding: 20px 20px 14px;
    line-height: 1;
  }

  .simple-password-input-group {
    display: flex;
    justify-content: center;
    position: relative;
    padding-top: 10px;

    .hidden-input {
      position: absolute;
      width: 100%;
      height: 30px;
      color: transparent;
      background-color: transparent;
      border: 0;
    }

    .input-box {
      width: 34px;
      height: 34px;
      border: 1px solid #E3E3E3;
      margin-right: 11px;
      text-align: center;
      line-height: 32px;
      border-radius: 4px;
      //position: relative;

      .password-point {
        display: inline-block;
        vertical-align: middle;
        background-color: #333;
        border-radius: 50%;
        width: 8px;
        height: 8px;
      }

      &.active {
        border-color: #1A1A1A;

        //&:before {
        //  content: "";
        //  position: absolute;
        //  left: 4px;
        //  top: 50%;
        //  transform: translateY(-50%);
        //  background-color: #333;
        //  width: 1px;
        //  height: 22px;
        //}
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .simple-password-button-group {
    display: flex;
    height: 50px;
    margin-top: 22px;
    border-top: 1px solid #ddd;

    button {
      flex: 1;
      border: 0;
      color: #333;
      font-size: 15px;

      &:active {
        background-color: rgba(black, 0.1);
      }

      &.confirm-button {
        color: #00BFF1;
        border-left: 1px solid #ddd;
      }
    }
  }
}
</style>