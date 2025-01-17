<template>
  <el-cascader style="width: 100%" :value="value" :options="thisOption" @change="valueChange" :clearable="clearable"
    :props="thisProps" :size="size" ref="cascader" :show-all-levels="showAllLevels" filterable :disabled="disabled"
    :placeholder="placeholder"></el-cascader>
</template>
<script>
import api from "../api/index.js";
import Util from '../util.js';
export default {
  name: 'ApiCascader',
  props: {
    value: {
      type: [String, Array, Number],
    },
    option: {
      type: [Array]
    },
    api: {
      type: String
    },
    size: {
      type: String,
      default: "small",
    },
    // 名称, 值, 备注重命名
    props: {
      type: Object,
      default: () => {
        return {
          label: "name",
          value: "id",
          children: "children",
          emitPath: false,
          checkStrictly: true
        };
      },
    },
    // 允许清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 仅显示最后一级
    showAllLevels: {
      type: Boolean,
      default: false
    },
    // 自动选择第一项
    autoSelectFirst: {
      type: Boolean,
      default: false
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      thisOption: this.option,
      thisProps: {
        label: this.props.label || "name",
        value: this.props.value || "id",
        children: this.props.children || "children",
        emitPath: this.props.emitPath || false,           // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
        checkStrictly: this.props.checkStrictly || true,  // 父子节点取消选中关联
        multiple: this.props.multiple || false,           // 多选
      },
    };
  },
  created() {
    this.setOptionSource();
  },
  methods: {
    /**
     * 设置 option 源
     * 优先级别: option > api > elementCode
     */
    setOptionSource() {
      // 优先使用设置的
      if (this.option) {
        return;
      }
      if (this.api) {
        api.get(this.api).then((r) => {
          this.changeOptions(r.data)
        });
        return;
      }
    },
    // 修改选项
    changeOptions(options) {
      this.thisOption = options;
      // 新的选项为空, 设置值为空
      if (!this.thisOption || !this.thisOption.length) {
        this.valueChange(null);
        return;
      }
      // 新的选项包含已选择的值 (单选)
      const has = Util.treeSearchFirst(this.thisOption, (item) => item[this.thisProps.value] == this.value);
      if (has) {
        return;
      }

      // 自动选择第一项
      if (this.autoSelectFirst) {
        this.valueChange(this.thisOption[0][this.thisProps.value]);
        return;
      }

      // 新的选项不包含新的值
      this.valueChange(null);
    },
    valueChange(newValue) {
      this.$emit('input', newValue);
      this.$emit('change', newValue);
    },
  },
  computed: {

  },
  watch: {
    // api 变更, 更新选项, 更新值
    api(newVal) {
      api.get(newVal).then((r) => {
        this.changeOptions(r.data);
      });
    }
  }
}
</script>