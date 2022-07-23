<template>
  <page title="标题" class="home" headerBorder is-back>
    <button>按钮</button>
    <div class="my-button">按钮</div>
  </page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import Page from "@/components/Page.vue";

export default defineComponent({
  components: { Page },
  setup() {
    const data = reactive({});

    return {
      ...toRefs(data),
      appName: process.env.VUE_APP_NAME,
    };
  },
});
</script>

<style scoped lang="less">
.page {
  button {
    border: 1px solid var(--border);
    padding: 10px;
  }
}
</style>