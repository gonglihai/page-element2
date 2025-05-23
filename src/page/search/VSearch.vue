<!-- page 组件中查询条件
  -- @author GongLiHai
 -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
  <FoldContainer class="v-page-search" name="查询条件" :defaultFold="c.fold">
    <div class="page-search" @keypress.enter="search">
      <div v-for="(item, index) in searchItems" :key="`${item.field}_${item.label}_${index}`" class="page-search-item"
        :class="item.class" :title="title(item)">
        <label :for="labelForId(item)" class="page-search-item-label">
          {{ item.label }}
        </label>
        <!-- 下拉框 -->
        <api-select v-if="item.type === 'select'" :id="labelForId(item)" v-model="searchData[item.field]"
          :placeholder="placeholder(item)" :option="item.option" :api="item.api" :props="item.props" :group="item.group"
          :multiple="item.multiple" :multipleValueType="item.multipleValueType"
          :clearable="isAbsentTrue(item.clearable)" :size="size" @change="searchItemChange(item)" />
        <!-- 日期 -->
        <el-date-picker v-else-if="item.type === 'date'" :id="labelForId(item)" v-model="searchData[item.field]"
          type="date" :placeholder="placeholder(item)" :size="size"
          :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'" :format="item.format || 'yyyy-MM-dd'"
          :clearable="isAbsentTrue(item.clearable)" @change="searchItemChange(item)" />

        <!-- 日期 范围 -->
        <DateRangeSelect v-else-if="item.type === 'date-range'" :id="labelForId(item)" :form="searchData"
          :field="item.field" :value-format="item.valueFormat" :format="item.format"
          :clearable="isAbsentTrue(item.clearable)" :size="size" @change="searchItemChange(item)" />

        <!-- 年 -->
        <el-date-picker v-else-if="item.type === 'year'" :id="labelForId(item)" v-model="searchData[item.field]"
          type="year" :placeholder="placeholder(item)" :size="size" :clearable="isAbsentTrue(item.clearable)"
          :value-format="item.valueFormat || 'yyyy'" @change="searchItemChange(item)" />

        <!-- 年月 -->
        <el-date-picker v-else-if="item.type === 'year-month'" :id="labelForId(item)" v-model="searchData[item.field]"
          type="month" :placeholder="placeholder(item)" :size="size" :clearable="isAbsentTrue(item.clearable)"
          :value-format="item.valueFormat || 'yyyyMM'" @change="searchItemChange(item)" />

        <!-- 输入框 -->
        <el-input v-else :id="labelForId(item)" v-model="searchData[item.field]" :placeholder="placeholder(item)"
          :size="size" :clearable="isAbsentTrue(item.clearable)" @change="searchItemChange(item)" />
      </div>
      <div class="page-search-button">
        <slot name="search-button-start"></slot>
        <el-button @click="search" type="primary" :size="size" icon="el-icon-search">搜索</el-button>
        <el-button @click="reset" :size="size" icon="el-icon-refresh">重置</el-button>
        <slot name="search-button-end"></slot>
      </div>
    </div>
  </FoldContainer>
</template>

<script>
import FoldContainer from "../fold/FoldContainer.vue";
import ApiSelect from "./ApiSelect.vue";
import DateRangeSelect from './DateRangeSelect.vue';

import Util from "../util.js";
import { config } from '../config';
import Vue from "vue";

const SEARCH_ID_PREFIX = "search";
let SEARCH_ID = 0; // 组件唯一id

export default {
  components: { FoldContainer, ApiSelect, DateRangeSelect },
  props: {
    option: {
      // 查询配置
      type: [Array, Object],
      default() {
        return [];
      },
    },
    // 查询条件具体值 对象
    searchData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      searchId: SEARCH_ID++, // id
      size: config.search.size
    };
  },
  methods: {
    isAbsentTrue: Util.isAbsentTrue,
    /**
     * label 的 for 与 input 的 id
     */
    labelForId(search) {
      return SEARCH_ID_PREFIX + "_" + this.searchId + "_" + search.field;
    },
    /**
     * 处理 空值 占位符
     */
    placeholder(search) {
      if (search.placeholder) {
        return search.placeholder;
      }
      let verb; // 操作动词, 输入框 请输入, 下拉框 请选择
      switch (search.type) {
        case "year":
        case "select":
        case "date-range":
        case "year-month":
        case "date":
          verb = "请选择";
          break;
        case "input":
        default:
          verb = "请输入";
          break;
      }
      return verb + Util.ifAbsentDefault(search.label, '');
    },
    /**
     * 返回 查询条件的 title 属性
     */
    title(search) {
      return "查询条件 - " + search.label;
    },
    /**
     * 查询点击事件
     */
    search() {
      this.$emit("search", this.searchData);
    },
    /**
     * 重置点击事件
     */
    reset() {
      // 重置 data 为 默认值
      this.clear();
      this.search();
    },
    /**
     * 重置表单，不会触发 search 事件。
     */
    clear() {
      this.setSearchData(true);
    },
    /**
     * 设置查询条件对象
     * @param callChange 是否调用 searchItem 的 change 事件
     */
    setSearchData(callChange) {
      this.searchItems.forEach((searchItem) => {
        const field = searchItem['field'];
        const def = searchItem['default'];

        // field 是字符串
        if (typeof field == 'string') {
          const newValue = Util.getValueByDefault(def);
          if (newValue != this.searchData[field]) {
            Vue.set(this.searchData, field, newValue);
            if (callChange) {
              this.searchItemChange(searchItem);
            }
          }

          return;
        }
        
        // 对于日期范围下拉框 DateRangeSelect.vue 等组件多个值的情况进行特殊处理, field 是 数组, default 也是数组
        if (Array.isArray(field)) {
          let isChange = false;
          field.forEach((fieldKey, fieldIndex) => {
            const newValue = Util.getValueByDefault(def && def[fieldIndex]);
            if (this.searchData[fieldKey] != newValue) {
              Vue.set(this.searchData, fieldKey, newValue);
              isChange = true;
            }
          })
          if (callChange && isChange) {
            this.searchItemChange(searchItem);
          }
          return;
        }
      });
    },
    /**
     * 表单项值改变事件
     * @param searchItem 查询表单项
     */
    searchItemChange(searchItem) {
      if (searchItem.change) {
        searchItem.change(this.searchData);
      }
    }
  },
  created() {
    this.setSearchData();
    this.search();
  },
  computed: {
    // search 查询条件是否是数组
    searchItemsIsArray() {
      return Array.isArray(this.option);
    },
    // 搜索项数组
    searchItems() {
      return this.searchItemsIsArray ? this.option : this.option.item
    },
    // 配置
    c() {
      const keys = ['fold'];
      // search 配置是对象
      if (!this.searchItemsIsArray) {
        return Util.fieldMerge(this.option, config.search, keys);
      }
      // search 配置是数组
      const r = {};
      keys.forEach(key => {
        r[key] = config.search[key];
      });
      return r;
    }
  }
};
</script>
<style scoped>
.page-search {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.page-search-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  width: 270px;
}

.page-search-item-label {
  flex-shrink: 0;
  width: 70px;
  margin-left: 8px;
  margin-right: 4px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}

.page-search-button {
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-left: 4px;
  margin-bottom: 4px;
  padding-left: 4px;
}

/* 日期范围选择框中间的字 默认宽度5%显示不全 修改成10% */
:deep(.el-range-separator) {
  width: 10%;
}
</style>
