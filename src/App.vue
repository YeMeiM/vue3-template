<template>
  <div class="app-container">
    <router-view/>
    <button class="button" >开始</button>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="less">
html {

  body {
    font-size: 14px;
    margin: 0;
  }

  * {
    border: 0;
    margin: 0;
    padding: 0;
  }

  button {
    background-color: transparent;
    border: 1px solid #333;
    padding: 2px 5px;
    border-radius: 4px;
  }
}
</style>
