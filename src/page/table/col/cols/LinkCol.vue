<!--
  链接类型的列
  支持属性:
    属性名  类型       说明
    click   Function   点击事件处理
-->
<template>
  <el-link :type="type" size="mini" :underline="false" @click.stop="click">
    {{ content }}
  </el-link>
</template>

<script>
import TableColMixin from "../TableColMixin.js";
import Util from "../../../util.js";

export default {
  mixins: [TableColMixin],
  computed: {
    type() {
      return Util.ifAbsentDefault(this.col.color, "primary");
    }
  },
  methods: {
    click() {
      if (this.col.click && typeof this.col.click == 'function') {
        this.col.click(this.scope, this.col);
      }
    },
  },
};
</script>