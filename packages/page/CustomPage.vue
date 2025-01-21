<!-- 树查询数据表格页面组件
  -- @author GongLiHai
 -->

<template>
  <div class="custom-page">
    <!-- 左侧树 -->
    <left-tree v-if="option.tree" ref="tree" :option="option.tree" class="custom-page-left-tree" @click="treeClick">
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
    <div class="custom-page-right-div">

      <!-- 查询条件 -->
      <FoldContainer class="custom-page-search" v-if="option.search" name="查询条件">
        <search-index :option="option.search" @search="searchClick" ref="search" :searchData="searchData">
          <template #search-button-start>
            <slot name="search-button-start"></slot>
          </template>
          <template #search-button-end>
            <slot name="search-button-end"></slot>
          </template>
        </search-index>
      </FoldContainer>

      <!-- 工具栏按钮 -->
      <tool-button class="custom-page-tool-button" v-if="option.button && option.button.length" :option="option.button"
        :tableSelect="tableSelect" @click="toolButtonClick">
        <template #button-start>
          <slot name="button-start"></slot>
        </template>
        <template #button-end>
          <slot name="button-end"></slot>
        </template>
      </tool-button>

      <!-- 数据表格 -->
      <data-table class="custom-page-data-table" v-if="option.table" :option="option.table" :select.sync="tableSelect"
        :initSearch="initSearch" ref="dataTable">
        <template v-for="colSlot in tableColSlots" v-slot:[colSlot]="{ value, row, index, col, scope }">
          <slot :value="value" :row="row" :index="index" :col="col" :scope="scope" :name="colSlot">
          </slot>
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import LeftTree from "./tree/LeftTree.vue";
import SearchIndex from "./search/SearchIndex.vue";
import ToolButton from "./button/ToolButton.vue";
import DataTable from "./table/DataTable.vue";

import Util from "./util.js";
import api from "./api/index.js";
import FoldContainer from "./fold/FoldContainer.vue";

export default {
  components: {
    LeftTree,
    SearchIndex,
    ToolButton,
    DataTable,
    FoldContainer
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
          const f = this.option.tree && this.option.tree.props && this.option.tree.props.value;
          this.searchData[this.option.tree.field] = treeNode ? treeNode[f || "id"] : undefined;
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
      if (this.$refs && this.$refs.dataTable && typeof this.$refs.dataTable.reloadData === 'function') {
        this.$refs.dataTable.reloadData({ ...this.searchData, ...params });
      }
    },
    /**
     * 工具栏按钮点击事件
     */
    toolButtonClick(button) {
      // 数据表格中选中的行数量
      const tableSelectLength = this.tableSelect.length;

      // 选中数量验证
      // selectMin 最小选中
      if (button.selectMin && button.selectMin > tableSelectLength) {
        this.$message(
          "最少选中 " +
          button.selectMin +
          " 条数据, 已选 " +
          tableSelectLength +
          " 条"
        );
        return;
      }
      // selectMax 最多选中
      if (button.selectMax && button.selectMax < tableSelectLength) {
        this.$message(
          "最多选中 " +
          button.selectMax +
          " 条数据, 已选 " +
          tableSelectLength +
          " 条"
        );
        return;
      }
      // selectCount 只能选中
      if (button.selectCount && button.selectCount != tableSelectLength) {
        this.$message(
          "只能选中 " +
          button.selectCount +
          " 条数据, 已选 " +
          tableSelectLength +
          " 条"
        );
        return;
      }

      // 非内置处理函数, 事件冒泡, 移交外部处理
      if (!button.internal) {
        switch (typeof button.click) {
          case "string":
            this.$emit(button.click, this.tableSelect, button);
            break;
          case "function":
            button.click(this.tableSelect, button);
            break;
        }
        return;
      }
      // 内置事件处理
      switch (button.internal) {
        // 删除
        case "delete":
          this.internalDelete(button, this.tableSelect);
          break;
        default:
          console.warn("Page.vue: 按钮配置了无效的内置函数");
          break;
      }
    },
    /**
     * 内置删除
     * @param {Object} button 按钮配置
     * @param {Object} tableSelectData 数据表格选中对象
     */
    internalDelete(button, tableSelectData) {
      this.$confirm(
        `此操作将删除这些数据, 是否继续? (共 ${tableSelectData.length} 条)`,
        "删除确认",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "error",
          confirmButtonClass: "el-button--danger",
        }
      )
        .then(() => {
          // 点确认, 请求后端, 成功删除后重载表格
          let ids =
            button.fieldType == "array"
              ? Util.objectsToArray(
                tableSelectData,
                Util.ifAbsentDefault(button.field, "id")
              )
              : Util.objectsToString(
                tableSelectData,
                Util.ifAbsentDefault(button.field, "id")
              );
          api
            .delete(button.api, {
              [Util.ifAbsentDefault(button.requestField, "ids")]: ids,
            })
            .then((r) => {
              if (r.code === 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .finally(() => {
              this.tableReload();
            });
        })
        .catch(() => { });
    },
    /**
     * 清理
     * 1. tree 树选中的内容, 树搜索
     * 2. search 查询条件 的值
     * 3. dataTable 选中的行
     */
    clean() {
      if (this.option.tree && this.$refs.tree) {
        this.$refs.tree.clean();
        this.treeSetSearchData();
      }
      if (this.option.search && this.$refs.search) {
        this.$refs.search.clean();
      }
      if (this.option.table && this.$refs.dataTable) {
        this.$refs.dataTable.clean();
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
    // 表格初始化时查询条件
    initSearch() {
      if (this.option.search) {
        return Util.eachBuildEntity(this.option.search, "field", "default");
      }
      return null;
    },
  },
};
</script>

<style scoped>
.custom-page {
  display: flex;
  height: 100%;
  /* height: calc(100vh - 116px); */
  width: 100%;
  overflow: hidden;
}

.custom-page-left-tree {
  margin-right: 8px;
  flex-shrink: 0;
}

.custom-page-right-div {
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow: auto;
  height: 100%;
}

.custom-page-tool-button {
  flex: none;
}

.custom-page-search {
  margin-bottom: 8px;
  flex: none;
}

.custom-page-data-table {
  flex: auto;
  overflow: hidden;
}
</style>
