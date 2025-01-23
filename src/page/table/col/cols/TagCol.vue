<!--
  标签类型的列
  支持属性:
    属性名  类型                 说明
    tag     Array|Bean|Function el-tag 的 type 属性(颜色), success 绿|info 灰|warning 黄|danger 红
    content Array|Bean|Function 标签显示内容
-->
<template>
  <el-tag size="small" :type="type">{{ showContent }}</el-tag>
</template>

<script>
import ColMixin from "../ColMixin.js";

export default {
  mixins: [ColMixin],
  methods: {
    /**
     * key 映射
     * 对于 整数数字, 字符串key 的列, 例如 数字状态, 或 字符串状态
     * - 数字状态, 当 列的值为 数字时, 数字状态及代表 状态数组 的 索引
     *   状态集合: ['初始化状态', '状态1', '状态2', '状态3']
     *   示例: 列值 => 返回值
     *           0 => 初始化状态
     *           1 => 状态1
     *           2 => 状态2
     *           3 => 状态3
     * - 字符串状态, 当 列的值为 字符串时, 列的值 代表 状态对象 的 字段名
     *   状态对象: { 'STATION': '泵站', 'PUMP': '泵', 'CAMERA': '摄像头' }
     *   示例: 列值      => 返回值
     *        'STATION' => '泵站'
     *        'PUMP'    => '泵'
     *        'CAMERA'  => '摄像头'
     * 函数
     *   执行函数, 用 page.table.col[item] 配置 与 element-ui scope 做为函数参数
     *
     * @param {String} key 从 page.table.col[item] 获取的 valueMap 的字段名
     * @returns 映射的实际值
     **/
    keyMap(key) {
      const valueMap = this.col[key];
      if (!valueMap) {
        return this.content;
      }
      // 数组 或 object 时, 数组的索引, object 的 key 代表 值的 key
      if (Array.isArray(valueMap) || typeof valueMap == "object") {
        return valueMap[this.content];
      }
      // 函数时, 执行函数
      if (typeof valueMap == "function") {
        return valueMap(this.col, this.scope);
      }
      console.warn(
        `DataTable: tag-col: 无法处理的映射类型: ${key}, 配置: `,
        this.col
      );
      return "";
    },
  },
  computed: {
    /**
     * 标签类型
     * element-ui el-tag的type 属性 success 绿/info 灰/warning 黄/danger 红
     */
    type() {
      return this.keyMap("tag");
    },
    /**
     * 显示的内容
     */
    showContent() {
      return this.keyMap("content");
    },
  },
};
</script>
