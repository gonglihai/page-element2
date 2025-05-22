<!-- 树查询数据表格页面组件
  -- @author GongLiHai
 -->

<template>
  <div class="v-page">
    <!-- 左侧树 -->
    <left-tree v-if="option.tree" ref="tree" :option="option.tree" class="v-page-left-tree" @click="treeClick">
      <!-- 树搜索框前插槽 -->
      <template #tree-search-start>
        <slot name="tree-search-start"></slot>
      </template>
      <!-- 树搜索框后插槽 -->
      <template #tree-search-end>
        <slot name="tree-search-end"></slot>
      </template>
      <!-- 树节点作用域插槽 -->
      <template v-slot:tree-node="{ node, data }">
        <slot name="tree-node" :node="node" :data="data"></slot>
      </template>
    </left-tree>
    <div class="v-page-right-div">

      <!-- 查询条件 -->
      <VSearch v-if="option.search" :option="option.search" @search="searchClick" ref="search" :searchData="searchData">
        <template #search-button-start>
          <slot name="search-button-start"></slot>
        </template>
        <template #search-button-end>
          <slot name="search-button-end"></slot>
        </template>
      </VSearch>

      <!-- 工具栏按钮 -->
      <tool-button class="v-page-tool-button" v-if="option.button && option.button.length" :option="option.button"
        :tableSelect="tableSelect">
        <template #button-start>
          <slot name="button-start"></slot>
        </template>
        <template #button-end>
          <slot name="button-end"></slot>
        </template>
      </tool-button>

      <!-- 数据表格 -->
      <data-table class="v-page-data-table" v-if="option.table" :option="option.table" :select.sync="tableSelect"
        ref="dataTable">
        <template v-for="colSlot in tableColSlots" v-slot:[colSlot]="{ value, row, index, col, scope }">
          <slot :value="value" :row="row" :index="index" :col="col" :scope="scope" :name="colSlot">
          </slot>
        </template>
        <template #table-page-start>
          <slot name="table-page-start"></slot>
        </template>
        <template #table-page-end>
          <slot name="table-page-end"></slot>
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import LeftTree from "./tree/LeftTree.vue";
import VSearch from "./search/VSearch.vue";
import ToolButton from "./button/ToolButton.vue";
import DataTable from "./table/DataTable.vue";

import Util from "./util.js";
import { config } from "./config/index.js";

export default {
  components: {
    LeftTree,
    VSearch,
    ToolButton,
    DataTable
  },
  props: {
    page: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      tableSelect: [], // 表格选中数据
      searchData: {}, // 查询条件
      columnSlotNamePrefix: "table-col-", // 表格列插槽名前缀
      option: this.page,
    };
  },
  created() {
    // 当查询条件不存在时, 主动初始化表格, 查询条件存在, 查询条件发起查询事件
    if (!this.page.search) {
      this.tableReload();
    }
  },
  methods: {
    /**
     * 树节点点击重载表格
     */
    treeClick(treeNode) {
      // 树设置查询条件
      this.treeSetSearchData(treeNode);
      // 重载表格
      this.tableReload();
    },
    /**
     * 树设置查询条件
     */
    treeSetSearchData(treeNode) {
      // 根据树类型设置查询条件
      switch (this.option.tree.type) {
        case "multi-field": // 多字段
          // 遍历 page.tree.field 对象, field 对象的 key 为请求时的key名, value 为 点击节点的属性名
          for (const [key, value] of Object.entries(this.option.tree.field)) {
            this.searchData[key] = treeNode ? treeNode[value] : undefined;
          }
          break;
        case "field": // 单字段默认
        default: {
          const f = Util.ifAbsentDefault(this.option.tree.valueField, config.tree.valueField);
          this.searchData[this.option.tree.field] = treeNode ? treeNode[f] : undefined;
        }
      }
    },
    /**
     * 查询按钮点击, 重载表格
     */
    searchClick() {
      this.$emit('search', this.searchData);
      this.tableReload();
    },
    /**
     * 表格重载
     */
    tableReload(params) {
      if (this.page.table) {
        this.$nextTick(() => {
          this.$refs.dataTable.reloadData({ ...this.searchData, ...params });
        })
      }
    },
    /**
     * 清理
     * 1. tree 树选中的内容, 树搜索
     * 2. search 查询条件 的值
     * 3. dataTable 选中的行
     */
    clear() {
      if (this.option.tree && this.$refs.tree) {
        this.$refs.tree.clear();
        this.treeSetSearchData();
      }
      if (this.option.search && this.$refs.search) {
        this.$refs.search.clear();
      }
      if (this.option.table && this.$refs.dataTable) {
        this.$refs.dataTable.clear();
      }
    },
  },
  computed: {
    // 表格列模板插槽
    tableColSlots() {
      const r = [];
      Object.keys(this.$scopedSlots).forEach((key) => {
        if (key.startsWith(this.columnSlotNamePrefix)) {
          r.push(key);
        }
      });
      return r;
    },
    // tree refs 映射
    $tree() {
      return this.$refs.tree
    },
    // search refs 映射
    $search() {
      return this.$refs.search;
    },
    // button refs 映射
    $button() {
      return this.$refs.button;
    },
    // dataTable refs 映射
    $table() {
      return this.$refs.dataTable;
    }
  },
};
</script>

<style scoped>
.v-page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.v-page-left-tree {
  margin-right: 8px;
  flex-shrink: 0;
}

.v-page-right-div {
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow: auto;
  height: 100%;
}

.v-page-tool-button {
  flex: none;
}

.v-page-search {
  margin-bottom: 8px;
  flex: none;
}

.v-page-data-table {
  flex: auto;
  overflow: hidden;
}
</style>
