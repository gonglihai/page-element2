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
      // 数据表格中选中的行数量
      const tableSelectLength = this.tableSelect.length;

      // 选中数量验证
      // selectMin 最小选中
      if (button.selectMin && button.selectMin > tableSelectLength) {
        this.$message(`最少选中 ${button.selectMin} 条数据, 已选 ${tableSelectLength} 条`);
        return;
      }
      // selectMax 最多选中
      if (button.selectMax && button.selectMax < tableSelectLength) {
        this.$message(`最多选中 ${button.selectMax} 条数据, 已选 ${tableSelectLength} 条`);
        return;
      }
      // selectCount 只能选中
      if (button.selectCount && button.selectCount != tableSelectLength) {
        this.$message(`只能选中 ${button.selectCount} 条数据, 已选 ${tableSelectLength} 条`);
        return;
      }
      // 校验通过
      // 调用 click
      if (button.click && typeof button.click == 'function') {
        button.click(this.tableSelect, button);
      }
      // confirmClick 点击确认
      if (button.confirmClick && typeof button.confirmClick == 'function') {
        this.$confirm(`确认${button.name}吗?`, `${button.name}确认`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          button.confirmClick(this.tableSelect, button);
        }).catch(() => {
        });
      }
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
