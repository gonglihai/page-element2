<!-- Page.vue 中 工具栏按钮
  -- @author GongLiHai
 -->
<template>
  <div class="tool-button">
    <slot name="button-start"></slot>

    <template v-for="(button, index) in option">
      <el-button :key="`${button.name}_${index}`" v-if="!isHidden(button)" :type="button.color" :icon="button.icon"
        :size="size" @click="click(button)">
        {{ button.name }}
      </el-button>
    </template>

    <slot name="button-end"></slot>
  </div>
</template>

<script>
import { config } from '../config';

export default {
  props: {
    // 配置选项
    option: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表格选中数据
    tableSelect: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      size: config.button.size
    }
  },
  methods: {
    click(button) {
      this.$emit("click", button);
    },
    /**
     * 是否隐藏按钮
     * @param {Object} button 按钮配置 page.button.[item]
     */
    isHidden(button) {
      if (typeof button.hidden == "function") {
        return button.hidden(this.tableSelect, button);
      }
      return button.hidden;
    },
  },
};
</script>

<style scoped>
.tool-button {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.tool-button button.el-button {
  margin-left: 6px;
  margin-right: 0;
}

.tool-button button.el-button:first-child {
  margin-left: 0;
}
</style>
