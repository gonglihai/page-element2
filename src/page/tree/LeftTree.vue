<!-- 左侧树
  -- @author GongLiHai
 -->
<template>
  <FoldContainer class="page-tree" direction="x" name="左侧" :width="width">
    <div :style="{ width: width }" style="height: 100%;">
      <div style="margin-right: 8px; height: 100%; display: flex; flex-direction: column; flex: none;">
        <!-- 树搜索框 -->
        <div class="page-tree-search">
          <!-- 树搜索框前插槽 -->
          <slot name="tree-search-start"></slot>
          <el-input :placeholder="'搜索' + (option.name || '')" v-model="filter" size="small" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!-- 树搜索框后插槽 -->
          <slot name="tree-search-end"></slot>
        </div>
        <!-- 树 -->
        <div class="page-tree-container">
          <el-tree :data="data" :props="props" ref="tree" :filter-node-method="filterNode" @node-click="treeClick"
            :expand-on-click-node="false" :default-expand-all="option.expand" :node-key="props.value"
            :default-expanded-keys="defaultExpandedKeys">
            <!-- 节点作用域插槽 -->
            <template slot-scope="{ node, data }">
              <slot name="tree-node" :node="node" :data="data">
                <span class="el-tree-node__label">{{ node.label }}</span>
              </slot>
            </template>
          </el-tree>
        </div>
        <div class="page-tree-select">
          <span class="page-tree-select-label">已选择:</span>
          <el-tooltip effect="dark" :content="checkDataName" placement="top" :open-delay="500" :visible-arrow="false">
            <span class="page-tree-select-name">
              {{ checkDataName }}
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </FoldContainer>
</template>

<script>
import api from "../api/index.js";
import FoldContainer from "../fold/FoldContainer.vue";
import { config } from "../config/index.js";
import Util from "../util.js";

export default {
  components: { FoldContainer },
  created() {
    this.setTreeDataSource();
  },
  props: {
    option: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    checkDataName() {
      return this.checkData && this.checkData[this.props.label] ? this.checkData[this.props.label] + '' : '无'
    },
    // 默认展开的key集合
    defaultExpandedKeys() {
      // 指定了展开级别, 从 1 级开始
      const expandLevel = this.option.expandLevel || config.tree.expandLevel;
      if (expandLevel == 0) {
        return;
      }
      const ids = Util.treeGetIdsAtLevel(this.data, expandLevel, this.props.value);
      return ids;
    },
    // 树宽度
    width() {
      return this.option.width ? this.option.width : config.tree.width;
    }
  },
  data() {
    return {
      filter: "", // 搜索输入框的value
      fold: false, // 折叠展开状态
      data: null, // 树数据
      // 属性名映射
      props: this.buildProps(),
      checkData: null, // 点击后选择的数据
      addRoot: this.option.addRoot, // 是否向数据添加根节点
      rootName: this.option.rootName || "全部", // 当 addRoot 为 true 时, 根节点显示名称
    };
  },
  watch: {
    /**
     * 输入框value 改变, 过滤树节点
     */
    filter(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    buildProps() {
      const p = this.option.props || {};

      return {
        label: Util.ifAbsentDefault(p.label, config.tree.props.label),
        children: Util.ifAbsentDefault(p.children, config.tree.props.children),
        value: Util.ifAbsentDefault(p.value, config.tree.props.value),
      };
    },
    /**
     * 树过滤函数
     * @param value 值
     * @param data 树节点
     * @return 树节点的 label 包含 value 返回 true, 不包含 false
     */
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    /**
     * 设置 树 数据
     * 优先顺序: option.data > option.api
     */
    setTreeDataSource() {
      if (this.option.data) {
        this.decideAddRoot(this.option.data);
        return;
      }
      // api 不存在, 返回
      if (!this.option.api) {
        return;
      }

      // 判断 api 类型
      switch (typeof this.option.api) {
        case 'string':
          // api 是 字符串, 发起请求
          api.get(this.option.api).then((r) => {
            // 响应处理器
            if (this.option.response) {
              this.decideAddRoot(this.option.response(r));
              return;
            }
            // 从配置中获取数据
            if (config.tree.response) {
              this.decideAddRoot(config.tree.response(r));
              return;
            }
          });
          return;
        case 'function': {
          // api 是函数, 执行函数, 判断返回类型
          const obj = this.option.api();
          if (obj instanceof Array) {
            // 返回是数组, 直接做为数据
            this.decideAddRoot(obj);
          } else if (obj instanceof Promise) {
            // 返回是 Promise, 调用
            obj.then(response => this.decideAddRoot(response.data))
          }
          return;
        }
        case 'object':
          // 是 Promise, 调用
          if (this.option.api instanceof Promise) {
            this.option.api.then(response => this.decideAddRoot(response.data))
          }
          return;
      }
    },
    /**
     * 决定是否添加根节点
     */
    decideAddRoot(treeData) {
      if (this.addRoot) {
        this.data = [
          {
            [this.props.label]: Util.ifAbsentDefault(this.rootName, "全部"),
            [this.props.children]: treeData,
          },
        ];
      } else {
        this.data = treeData;
      }
    },
    /**
     * 树节点点击事件冒泡
     */
    treeClick(treeNode) {
      // 已选中节点再次点击, 取消选择
      if (this.checkData == treeNode) {
        this.$refs.tree.setCurrentKey(null);
        treeNode = null;
      }
      this.checkData = treeNode;
      this.$emit("click", treeNode);
    },
    /**
     * 清空树选择数据
     */
    clean() {
      this.$refs.tree.setCurrentKey(null);
      this.checkData = null;
      this.filter = '';
    }
  },
};
</script>

<style>
.page-tree-search {
  flex-shrink: 0;
  display: flex;
}

.page-tree-container {
  flex-grow: 1;
  overflow: auto;
  margin: 4px 0;
}

.page-tree-container .el-tree-node>.el-tree-node__content {
  border-radius: 5px;
  margin-right: 4px;
  transition: all 0.3s;
}

/* 树选中蓝色背景 */
.page-tree-container .el-tree-node.is-current.is-focusable>.el-tree-node__content {
  background-color: #1890ff;
  color: white;
}

.page-tree-container .el-tree-node.is-current.is-focusable>.el-tree-node__content:hover {
  background-color: #46a6ff;
}

.page-tree-select {
  display: flex;
  font-size: 14px;
  border-top: 1px solid #DCDFE6;
  padding-top: 4px;
  color: #606266;
}

.page-tree-select-label {
  flex-shrink: 0;
  margin-right: 4px;
}

.page-tree-select-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
