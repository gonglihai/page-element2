<!-- 数据表格
  -- @author GongLiHai
 -->
<template>
  <div class="page-table">
    <!-- 数据表格 -->
    <el-table v-if="tableShow" v-loading="loading" :data="tableData" ref="table" :row-key="option.rowKey"
      :default-expand-all="c.defaultExpandAll" :border="c.border" :stripe="c.stripe" height="100%" :size="c.size"
      @selection-change="onSelectionChange" @row-click="onRowClick" @sort-change="onSortChange">

      <!-- 行选择器 checkbox -->
      <el-table-column v-if="c.select" type="selection" :align="'center'" />

      <el-table-column-pack v-for="(col, idx) in option.col" :key="`${col.field}_${idx}`" :col="col">
        <template v-for="colSlot in tableColSlots" v-slot:[colSlot]="slotParam">
          <!--
              插槽参数
              slotParam: {
                value: 值
                row: 行数据
                index: 行序号
                col: 列配置
                scope: element-ui 表格列插槽原始参数
              }
            -->
          <slot v-bind="slotParam" :name="colSlot"></slot>
        </template>
      </el-table-column-pack>
    </el-table>

    <!-- 分页 -->
    <div class="page-table-bottom" v-if="c.pagination">
      <slot name="table-page-start"></slot>
      <el-pagination class="page-table-pagination" :total="page.total" :page-size.sync="page.pageSize"
        :current-page.sync="page.pageNumber" :page-sizes="c.pageSizes"
        @size-change="() => { page.pageNumber = 1; reloadData() }" @current-change="reloadData()"
        layout="total, sizes, prev, pager, next, jumper" />
      <slot name="table-page-end"></slot>
    </div>
  </div>
</template>

<script>
import ElTableColumnPack from "./ElTableColumnPack.vue";

import api from "../api/index.js";
import util from "../util.js";
import { config } from "../config/index.js";

export default {
  components: {
    ElTableColumnPack,
  },
  props: {
    // 表格配置选项
    option: {
      type: Object,
      default() {
        return {};
      },
    },
    // 表格选中数组
    select: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    const pageSizes = this.option.pageSizes || config.table.pageSizes;

    return {
      tableData: [],          // 表格数据
      page: {
        total: 0,             // 总条数
        pageSize: pageSizes[0],  // 单页大小
        pageNumber: 1,        // 页码
      },
      search: {},             // 查询条件缓存
      loading: true,
      tableShow: true,        // 表格重渲染
      columnSlotNamePrefix: "table-col-", // 表格列插槽名前缀
      orderBy: {
        field: null,          // 排序字段名
        order: null           // 顺序, 'asc' 正序, 'desc' 倒序
      }
    };
  },
  methods: {
    /**
     * 表格行点击选中
     */
    onRowClick(row) {
      if (this.c.rowClickSelect && this.c.select) {
        this.$refs.table.toggleRowSelection(row);
      }
    },
    /**
     * 选中事件冒泡
     * @param val 新值
     */
    onSelectionChange(val) {
      this.$emit("update:select", val);
    },
    /**
     * 重加载数据
     * @param search 查询条件
     */
    reloadData(search) {
      this.loading = true;
      // 静态数据, 模拟加载效果
      if (this.option.data) {
        setTimeout(() => {
          this.setTableData(this.option.data, this.option.data.length);
          this.loading = false;
        }, 500);
        return;
      }

      // 有查询条件时, 重置页码 (左侧树或查询调用)
      // 无查询条件时, 使用旧的查询条件 (分页组件的 size-change, current-change 事件调用)
      if (search) {
        this.search = search;
        this.page.pageNumber = 1;
      } else {
        search = this.search;
      }
      // 分页
      if (this.c.pagination !== false) {
        search[this.c.pageNumber] = this.page.pageNumber;
        search[this.c.pageSize] = this.page.pageSize;
      }

      // 排序
      if (this.orderBy.field) {
        search[this.c.orderField] = this.orderBy.field + ' ' + this.orderBy.order;
      } else {
        delete search[this.c.orderField];
      }

      // api 不存在, 终止请求
      if (!this.option.api) {
        this.loading = false;
        return;
      }

      // 固定参数
      let param = Object.assign({}, this.option.param);
      // 复制 search
      param = Object.assign(param, search);

      console.log('search: ', search, 'option.param: ', this.option.param)

      // 参数过滤器
      if (this.option.paramFilter && typeof this.option.paramFilter == 'function') {
        this.option.paramFilter(param);
      }

      api
        .get(this.option.api, param)
        .then((r) => {
          const data = this.c.response(r);
          this.setTableData(data[this.c.dataField], data[this.c.totalField]);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 设置表格数据
     * @param list 数据
     * @param total 总数
     */
    setTableData(list = [], total = 0) {
      this.tableData = list;
      this.page.total = total;
    },
    // 清理
    clean() {
      this.$refs.table.clearSelection();
    },
    // 排序改变
    onSortChange({ column, prop, order }) {
      // 内置排序
      if (column.sortable != 'custom') {
        this.orderBy.field = null;
        this.orderBy.order = null;
        return;
      }
      // 自定义排序
      if (order) {
        this.orderBy.field = prop;
        this.orderBy.order = order == 'ascending' ? this.c.orderBy[0] : this.c.orderBy[1];
      } else {
        this.orderBy.field = null;
        this.orderBy.order = null;
      }
      this.reloadData();
    }
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
    // 配置
    c() {
      return util.fieldMerge(this.option, config.table, [
        'select', 'rowClickSelect', 'pagination', 'border',
        'stripe', 'defaultExpandAll', 'size', 'response',
        'pageNumber', 'pageSize', 'dataField', 'totalField',
        'pageSizes', 'orderField', 'orderBy']);
    }
  },
  watch: {
    // api 变更, 重新请求数据
    'option.api'() {
      this.reloadData();
    }
  }
};
</script>
<style scoped>
.page-table {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.page-table-bottom {
  padding-top: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.page-table-pagination {
  flex: none;
}
</style>
