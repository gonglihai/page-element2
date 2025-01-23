<!-- 日期范围下拉框, 绑定 form 属性 -->
<template>
  <el-date-picker v-model="thisValue" @change="change" type="daterange" :size="size" :value-format="valueFormat"
    :format="format" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="clearable" />
</template>
<script>
export default {
  props: {
    // 值格式化
    valueFormat: {
      type: String,
      default: "yyyy-MM-dd"
    },
    // 显示内容格式化
    format: {
      type: String,
      default: 'yy-MM-dd'
    },
    // 大小
    size: {
      type: String,
      default: 'small'
    },
    // 表单 from, 由 field 进行绑定
    form: {
      type: Object,
    },
    // 字段, 绑定到 form 中的属性名, 第一个是开始时间, 第二个是结束时间
    field: {
      type: Array,
      default() {
        return ['startTime', 'endTime']
      }
    },
    // 是否可以清空, 默认 true
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      thisValue: []
    }
  },
  methods: {
    change(newValue) {
      if (newValue) {
        this.$set(this.form, this.field[0], newValue[0])
        this.$set(this.form, this.field[1], newValue[1])
        return;
      }
      this.$set(this.form, this.field[0], undefined)
      this.$set(this.form, this.field[1], undefined)
    }
  },
  watch: {
    // 监听上层属性改变
    form: {
      deep: true,
      handler: function (newValue) {
        let time1 = newValue[this.field[0]];
        let time2 = newValue[this.field[1]];
        if (time1 && time2) {
          this.thisValue = [time1, time2];
        } else {
          this.thisValue = undefined;
        }
      },
      immediate: true
    }
  }
}
</script>