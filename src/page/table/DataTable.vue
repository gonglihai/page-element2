<!-- 数据表格
  -- @author GongLiHai
 -->
<template>
  <div class="page-table">
    <!-- 数据表格 -->
    <el-table v-if="tableShow" v-loading="loading" :data="tableData" ref="table" @row-click="rowClick"
      @selection-change="handleSelectionChange" :row-key="option.rowKey" :default-expand-all="option.defaultExpandAll"
      :border="option.border" height="100%" :size="size">

      <!-- 行选择器 checkbox -->
      <el-table-column v-if="option.select" type="selection" :align="'center'" />

      <el-table-column-pack v-for="(col, idx) in option.col" :key="`${col.field}_${idx}`" :col="col">
        <template v-for="colSlot in tableColSlots" v-slot:[colSlot]="slotParam">
          <!--
              插槽参数
              slotParam: {
                value: 值
                row: 行数据
                index: 行序号
                col: 列配置
                scope: element-ui 表格列插槽原始参数, 在 Detail 下 为 null
              }
            -->
          <slot v-bind="slotParam" :name="colSlot"></slot>
        </template>
      </el-table-column-pack>
    </el-table>

    <!-- 分页 -->
    <div class="page-table-bottom" v-if="isAbsentTrue(option.pagination)">
      <el-pagination class="page-table-pagination" :total="page.total" :page-size.sync="page.limit"
        :current-page.sync="page.page" :page-sizes="pageSizes" @size-change="reloadData()"
        @current-change="reloadData()" layout="total, sizes, prev, pager, next, jumper" />
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
  created() {
    this.reloadData(this.initSearch);
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
    // 单页大小, 选项框
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200];
      },
    },
    // 表格初始化加载查询条件
    initSearch: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      tableData: [], // 表格数据
      page: {
        total: 0, // 总条数
        limit: this.pageSizes[0], // 单页大小
        page: 1, // 页码
      },
      search: {}, // 查询条件缓存
      loading: true,
      tableShow: true, // 表格重渲染
      columnSlotNamePrefix: "table-col-", // 表格列插槽名前缀
    };
  },
  methods: {
    isAbsentTrue: util.isAbsentTrue,
    /**
     * 表格行点击选中
     */
    rowClick(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    /**
     * 选中事件冒泡
     * @param val 新值
     */
    handleSelectionChange(val) {
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
        this.page.page = 1;
      } else {
        search = this.search;
      }
      // 分页
      if (this.option.pagination !== false) {
        search[this.tableProps.page] = this.page.page;
        search[this.tableProps.limit] = this.page.limit;
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

      console.log('search', search, this.option.param)

      // 参数过滤器
      if (this.option.paramFilter && typeof this.option.paramFilter == 'function') {
        this.option.paramFilter(param);
      }

      api
        .get(this.option.api, param)
        .then((r) => {
          let data = r;
          // 响应处理器
          if (this.option.response) {
            data = this.option.response(r);
            this.setTableData(data[this.tableProps.data], data[this.tableProps.total]);
            return;
          }
          // 从配置中获取数据
          if (config.dataTableResponse) {
            data = config.dataTableResponse(r);
            this.setTableData(data[this.tableProps.data], data[this.tableProps.total]);
            return;
          }
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
     * 分页请求参数、响应数据与总数key
     * {
     *   page: config.page.pageNumber,   // 请求参数, 页码的 key 名
     *   limit: config.page.pageSize, // 请求参数, 页大小的 key 名
     *   data: 'rows',      // 响应, 数据 key名
     *   total: 'total'     // 响应, 数据总条数
     * }
     */
    tableProps() {
      const propsDefault = {
        page: config.page.pageNumber,
        limit: config.page.pageSize,
        data: 'rows',
        total: 'total',
      };
      Object.assign(propsDefault, this.option.props);
      return propsDefault
    },
    // 表格大小
    size() {
      return this.option.size ? this.option.size : config.tableSize;
    }
  },
  watch: {
    // api 变更, 重新请求数据
    'option.api'() {
      this.reloadData(this.initSearch);
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
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}

.page-table-pagination {
  margin-top: 4px;
}
</style>
