<!--
  标签类型的列
  支持属性:
    属性名   类型   说明
    button  Array  按钮配置集合

  按钮配置对象:
    {
      icon: "el-icon-edit", // 图标
      name: "编辑",         // 按钮名称
      click: "edit",        // 点击事件
      color: "primary",     // 颜色, primary 蓝(默认)| success 绿| warning 黄| danger 红| info 黑
      hidden: Boolean | Function // 控制隐藏, Function 参数: scope, button, col
    }
-->
<template>
  <div @click.stop>
    <template v-for="(button, index) in col.button">
      <el-link v-if="!isHidden(button)" class="table-col-button" :key="`${button.name}_${index}`" :type="getType(button)"
        :icon="button.icon" size="mini" :underline="false" @click="click(button)">
        {{ button.name }}
      </el-link>
    </template>

  </div>
</template>

<script>
import ColMixin from "../ColMixin.js";
import Util from "../../../util.js";

export default {
  mixins: [ColMixin],
  methods: {
    click(button) {
      // click 普通点击
      if (button.click && typeof button.click == 'function') {
        button.click(this.scope, this.col, button);
      }
      // confirmClick 点击确认
      if (button.confirmClick && typeof button.confirmClick == 'function') {
        this.$confirm(`确认${button.name}吗?`, `${button.name}确认`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          button.confirmClick(this.scope, this.col, button);
        }).catch(() => {
        });
      }
    },
    /**
     * 是否隐藏按钮
     * @param {Object} button 按钮配置 page.table.col.buttons.[item]
     */
    isHidden(button) {
      if (typeof button.hidden == "function") {
        return button.hidden(this.scope, this.col, button);
      }
      return button.hidden;
    },
    /**
     * 获取颜色
     * @param {Object} button 按钮配置
     * @return 如果 button.color 为 空, 则返回 "primary", 否则返回 button.color
     */
    getType(button) {
      return Util.ifAbsentDefault(button.color, "primary");
    },
  },
};
</script>

<style>
.table-col-button+.table-col-button {
  margin-left: 4px;
}
</style>
