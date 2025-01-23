<!--
  开关类型的列
  支持属性:
    属性名          类型                   说明
    valueType      String                 快捷指定 activeValue/inactiveValue. "bit" 1 0, "boolean" true false
    activeValue    Boolean/String/Number  switch 打开时的值, el-switch 的 active-value
    inactiveValue  Boolean/String/Number  switch 关闭时的值, el-switch 的 inactive-value
    change         Function               switch 切换事件
    api            String                 快捷发送 Post 请求, 请求参数为 [key] 与 value, key 为 idKey 指定的 唯一key (默认为: id), value 为 switch 切换后的新值
    idKey          String                 与行数据中取值的字段名, Post 请求的 [key] idKey 指定的 唯一key 的参数名
                                          例如 配置 col.idKey: code 则代表, 请求中 唯一key 的参数名为 code, 唯一key 的值从 行数据中名为 code 的字段中取( row[idKey] )
-->
<template>
  <!-- @click.stop 阻止事件向上传播, 导致 表格下拉框选中问题 -->
  <div class="inline-block" @click.stop>
    <el-switch v-show="!isHidden" v-model="scope.row[col.field]" :active-value="valueType.active"
      :inactive-value="valueType.inactive" @change="change"></el-switch>
  </div>
</template>

<script>
import Util from "../../../util.js";
import api from "../../../api/index.js";
import ColMixin from "../ColMixin.js";

export default {
  mixins: [ColMixin],
  methods: {
    change(newVal) {
      const col = this.col;
      const scope = this.scope;
      // 外部 chagne 事件调用
      if (col.change) {
        col.change(newVal, col, scope);
      }
      // 内部 api 请求
      if (col.api) {
        const idKey = Util.ifAbsentDefault(col.idKey, "id");
        const idValue = scope.row[idKey]; // 问题点: id 值获取应进行 fmt 函数判断
        const valueKey = Util.ifAbsentDefault(col.valueKey, col.field);
        api
          .post(col.api, {
            [idKey]: idValue,
            [valueKey]: newVal,
          })
          .then((r) => {
            this.$message.success(r.msg);
          });
      }
    },
  },
  computed: {
    /**
     * 值类型, 决定 el-switch 的 activeValue, inactiveValue
     * 'bit'    : 1, 0
     * 'boolean': true, false
     * default  : col.activeValue, col.inactiveValue
     */
    valueType() {
      switch (this.col.valueType) {
        // 1, 0
        case "bit":
          return {
            active: 1,
            inactive: 0,
          };
        // true, false
        case "boolean":
          return {
            active: true,
            inactive: false,
          };
        // 自定义
        default:
          return {
            active: Util.ifAbsentDefault(this.col.activeValue, true),
            inactive: Util.ifAbsentDefault(this.col.inactiveValue, false),
          };
      }
    },
    /**
     * 是否隐藏开关
     */
    isHidden() {
      if (typeof this.col.hidden == "function") {
        return this.col.hidden(this.scope, this.col);
      }
      return this.col.hidden;
    }
  },
};
</script>
