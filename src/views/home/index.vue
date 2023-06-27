<template>
  <Page title="标题" class="home" headerBorder is-back>
    <div class="qrcode-container">
      <SimpleVideo :src="src" :poster="poster" />
    </div>
  </Page>
</template>

<script lang="ts" setup>
import Page from "@/components/Page.vue";
import SimpleVideo from "@/components/SimpleVideo.vue";

const src = "https://prod-streaming-video-msn-com.akamaized.net/b9614d22-e2ed-4689-becb-265d3d831c47/608d6881-b9a5-4ea9-aa8d-165bae3f43ec.mp4"
const poster = "";

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
