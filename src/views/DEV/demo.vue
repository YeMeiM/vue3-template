<template>
  <div class="">

  </div>
</template>

<script type="text/ecmascript-6">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    value: {
      type: Boolean,
    }
  },
  created() {
    console.log(this.myProp)
  }
});
</script>

<style scoped lang="less">

</style>
