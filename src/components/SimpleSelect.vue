<template>
  <div class="simple-select" ref="elRef">
    <van-popover v-model:show="open" @open="onOpenPopup" duration="0.2" >
      <template #reference>
        <div class="simple-select-input">
          <div class="simple-select-input-text">{{ current[label] }}</div>
          <van-icon name="arrow" class="simple-select-input-icon" :class="{'is-open': open}"/>
        </div>
      </template>
      <template #default>
        <div class="simple-select-board" :style="{width: boardWidth}">
          <div class="simple-select-board-item" :class="{ 'is-active': index === active }"
               v-for="(item,index) in options" :key="item[value]" @click="onChoose(index)">
            <slot name="default" :item="item" :index="index" :isActive="index === active">
              <div class="simple-select-item-text">{{ item[label] }}</div>
            </slot>
          </div>
        </div>
      </template>
    </van-popover>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, defineEmits, ref, watchEffect, PropType} from "vue"
import {computed} from "@vue/runtime-core";

const emits = defineEmits(["update:modelValue", "change"])
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  label: {
    type: String,
    default: "label"
  },
  value: {
    type: String,
    default: "value"
  }
})

const elRef = ref<HTMLDivElement | null>(null);
const boardWidth = ref('');
const active = ref(0);
const open = ref(false);

const current = computed<any>(() => props.options[active.value] || "")

function onOpenPopup() {
  if (!elRef.value) return;
  boardWidth.value = `${elRef.value.clientWidth}px`;
}

function onChoose(index: number) {
  active.value = index;
  const value = current.value[props.value];
  emits("update:modelValue", value);
  emits("change", value);
  open.value = false;
}

watchEffect(() => {
  const valueIndex = props.options.findIndex((item: any) => item[props.value] === props.modelValue);
  if(valueIndex >= 0){
    active.value = valueIndex;
  } else {
    onChoose(0);
  }
})

</script>

<style scoped lang="less">
:deep(.van-popover__wrapper) {
  width: 100%;
}

.simple-select-input {
  display: flex;
  align-items: center;
  padding: 15px;
}

.simple-select-input-text {
  flex: 1;
  font-size: 14px;
  color: #999999;
  line-height: 20px;
}

.simple-select-input-icon {
  color: #ABADB0;
  transform: rotate(90deg);
  transition: transform 0.3s;

  &.is-open {
    transform: rotate(-90deg);
  }
}

.simple-select-board {
  padding: 10px 0;
}

.simple-select-board-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999999;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;

  &:active {
    background-color: #F5F5F5;
  }

  &.is-active {
    color: #F25A48;
  }
}
</style>
