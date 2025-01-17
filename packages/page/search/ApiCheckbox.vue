<template>
  <div>
    <el-button-group v-if="thisOption.length > 5">
      <el-button @click="colsSelect('all')" size="mini">全选</el-button>
      <el-button @click="colsSelect('empty')" size="mini">全不选</el-button>
      <el-button @click="colsSelect('invert')" size="mini">反选</el-button>
    </el-button-group>
    <el-checkbox-group :value="value" @input="change" style="display: flex; flex-wrap: wrap;">
      <el-checkbox v-for="item in thisOption" :label="item[thisProps.value]" :style="{ minWidth: width }"
        style="flex-shrink: 1; flex-grow: 0;">
        {{ item[thisProps.label] }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  props: {
    // 宽度
    width: {
      type: String,
      default: undefined
    },
    // 选项
    option: {
      type: Array,
      default() {
        return []
      }
    },
    // option 映射
    props: {
      type: Object,
      default: undefined
    },
    // 值
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    thisOption() {
      return this.option && this.option.length ? this.option : this.apiOption;
    },
    thisProps() {
      return {
        label: this.props?.label || "label",
        value: this.props?.value || "label",
        checked: this.props?.checked || 'checked'
      }
    },
  },
  data() {
    return {
      apiOption: []
    }
  },
  methods: {
    change(newValue) {
      this.$emit("input", newValue);
      this.$emit("change", newValue);
    },
    // 全选/全不选/反选
    colsSelect(type) {
      switch (type) {
        case 'all': // 全选
          this.change(this.thisOption.map(item => item[this.thisProps.value]));
          break;
        case 'empty': // 全不选
          this.change([]);
          break;
        case 'invert': // 反选
          this.change(this.thisOption.filter(item => !this.value.includes(item[this.thisProps.value])).map(item => item[this.thisProps.value]));
          break;
      }
    },
  }
}
</script>