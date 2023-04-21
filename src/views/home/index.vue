<template>
  <Page title="标题" class="home" headerBorder is-back>
    <div class="qrcode-container">
      <SimpleQrcode :value="value" margin="10" />
    </div>
  </Page>
</template>

<script lang="ts" setup>
import SimpleQrcode from "@/components/SimpleQrcode.vue";
import Page from "@/components/Page.vue";
import { ref } from "vue";

const value = ref("二维码");
</script>

<style scoped lang="scss">
.home {
  overflow: hidden;

  .simple-qrcode {
    width: 200px;
    box-shadow: 0 0 0 1px #ccc;
    display: block;
    margin: 50px auto;
  }
}
</style>
