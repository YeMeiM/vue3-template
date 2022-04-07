<template>
  <page title="标题" class="home" is-back>
    <div class="margin-box"></div>
    <button class="btnCom">111</button>
  </page>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import Page from "@/components/Page.vue";

export default defineComponent({
  components: {Page},
  setup() {
    const data = reactive({})

    return {
      ...toRefs(data),
    }
  },
})
</script>

<style scoped lang="less">
.page{
  //padding-top: var(--simple-header-bar-height);

  .margin-box {
    margin-top: 20px;
    width: 100%;
    background-color: black;
  }
}
</style>