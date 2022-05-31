<template>
  <page title="标题" class="home" is-back>
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
      appName: process.env.VUE_APP_NAME,
    }
  },
})
</script>

<style scoped lang="less">
.page{

  .simple-header-bar{
    position: sticky;
    top: 0;
    height: 44px;
    color: @default;
    display: flex;
    align-items: center;
    padding: 10px 12px 10px 8px;
  }

  .margin-box {
    margin-top: 20px;
    width: 100%;
    background-color: black;
  }
}
</style>