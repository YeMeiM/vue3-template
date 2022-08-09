<template>
  <page title="标题" class="home" headerBorder is-back>
    <button>{{ count }}</button>
    <van-button block class="my-button" v-move v-wait-event @click="onClick"
      >按钮</van-button
    >
  </page>
</template>

<script lang="ts" setup>
import Page from "@/components/Page.vue";
import { ref } from "vue";

const count = ref(0);

function onClick() {
  count.value++;
}
</script>

<style scoped lang="scss">
.home {
  .my-button {
    border: 1px solid var(--s-border);
    padding: 10px;
  }
}
</style>