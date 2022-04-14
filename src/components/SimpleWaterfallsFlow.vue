<template>
  <div
    class="simple-waterfalls-flow"
    :style="{ '--simple-flow-col': col || '' }"
  >
    <div
      :class="['simple-flow-col', `simple-flow-col${index}`]"
      v-for="index in col"
      :key="index"
    >
      <div
        :class="`simple-flow-col${index}-list`"
        :ref="(el) => (colEls[index] = el)"
      >
        <div
          class="simple-flow-col-item"
          v-for="item in colBox[index]"
          :key="item[itemKey]"
        >
          <slot :item="item.item" :index="item.index"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  reactive,
  toRef,
  toRefs,
  watch,
} from "vue";

export default defineComponent({
  props: {
    /**
     * 列表数据
     */
    list: {
      type: [Array, Number],
      default: () => [] as any,
    },
    /**
     * 列表项的key
     */
    itemKey: {
      type: String,
      default: "id",
    },
    /**
     * 列数
     */
    col: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const colEls = {} as any;

    const data = reactive({
      colBox: {} as { [props: string]: any[] },
    });

    async function groupItem(index: number, item: any, key: string | number) {
      let min = 0;
      // 先等待页面渲染完成
      await nextTick();
      // 创建描述对象
      const itemData = { [props.itemKey]: key, item, index };
      // 循环列
      for (let i = 1; i <= props.col; i++) {
        if (!min || colEls[i].clientHeight < colEls[min].clientHeight) {
          min = i;
        }
      }
      data.colBox[min].push(itemData);
    }

    // 根据列表数据，分组
    async function groupBy() {
      // 清空列表
      for (let i = 1; i <= props.col; i++) {
        data.colBox[i] = [];
      }
      // 如果是数字，则循环对应次数
      if (typeof props.list === "number") {
        for (let i = 0; i < props.list; i++) {
          await groupItem(i, i + 1, i + 1);
        }
      } else {
        // 如果是数组，则循环数组
        for (let i = 0; i < props.list.length; i++) {
          await groupItem(
            i,
            props.list[i],
            (props.list[i] as any)[props.itemKey]
          );
        }
      }
    }

    watch(toRef(props, "col"), groupBy);

    // 监听列表数据，分组
    watch(toRef(props, "list"), groupBy, { immediate: true });

    return {
      ...toRefs(data),
      colEls,
    };
  },
});
</script>

<style scoped lang="less">
.simple-waterfalls-flow {
  --simple-flow-col: 3;
  --simple-flow-gap: 15px;

  display: flex;
  padding-left: var(--simple-flow-gap);

  .simple-flow-col {
    width: calc(100% / var(--simple-flow-col) - var(--simple-flow-gap));
    margin-right: var(--simple-flow-gap);
    display: flex;
    flex-direction: column;
  }
}
</style>