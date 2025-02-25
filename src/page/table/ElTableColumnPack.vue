<!-- 对 el-table-column 进行包装
     1. 通过配置来构造 el-table-column
     2. 通过 col.type 分配列类型
     @author GongLiHai
 -->
<template>
  <el-table-column v-if="col.show != false" :prop="col.field" :label="col.name" :width="col.width"
    :min-width="col.minWidth" :sortable="sortable" :fixed="col.fixed" :align="col.align" :class-name="col.class">
    <!-- 无子列, 渲染插槽 -->
    <template v-if="!col.children || !col.children.length" v-slot="scope">
      <!--
        插槽参数
        slot: {
          value: 值
          row: 行数据
          index: 行序号
          col: 列配置
          scope: element-ui 表格列插槽原始参数
        }
      -->
      <slot :value="scope.row[col.field]" :col="col" :row="scope.row" :index="scope.$index" :scope="scope"
        :name="columnSlotNamePrefix + col.field">
        <!-- 根据列配置决定所使用的的列组件 -->
        <component v-bind:is="colType" :col="col" :scope="scope" />
      </slot>
    </template>
    <!-- children 子列, 递归渲染 -->
    <el-table-column-pack v-for="(item, index) in col.children" :key="index" :col="item">
      <template v-for="colSlot in tableColSlots" v-slot:[colSlot]="slotParam">
        <slot v-bind="slotParam" :name="colSlot"></slot>
      </template>
    </el-table-column-pack>
  </el-table-column>
</template>

<script>
import ColTypes from "./col/ColTypesRegister.js";
import Util from "../util.js";

export default {
  name: "el-table-column-pack",
  props: {
    // 列配置
    col: {
      type: Object,
    },
  },
  data() {
    return {
      columnSlotNamePrefix: "table-col-", // 表格列插槽名前缀
    };
  },
  computed: {
    /**
     * 表格列插槽
     */
    tableColSlots() {
      const r = [];
      Object.keys(this.$scopedSlots).forEach((key) => {
        if (key.startsWith(this.columnSlotNamePrefix)) {
          r.push(key);
        }
      });
      return r;
    },
    /**
     * 返回 col.type 所对应的列类型
     */
    colType() {
      const r = ColTypes[Util.ifAbsentDefault(this.col.type, "text")];
      if (r) {
        return r;
      }
      console.warn(
        `DataTable: 无法找到的表格列类型 ${this.col.type}, 列配置: `,
        this.col
      );
      return null;
    },
    /**
     * 是否排序
     */
    sortable() {
      return !this.col.children && this.col.sortable;
    },
  },
};
</script>
