<!-- 带自动请求 api 的下拉框
  -- @author GongLiHai
 -->
<template>
  <el-select :value="thisValue" :placeholder="placeholder" :size="size" :id="id" :multiple="multiple"
    :clearable="clearable" filterable ref="elSelect" @change="change" :disabled="disabled">
    <el-option v-for="(item, index) in thisOption" :key="index" :label="item[thisProps.label]"
      :value="item[thisProps.value]">
    </el-option>
  </el-select>
</template>

<script>
import api from "../api/index.js";
import Util from "../util.js";

export default {
  name: "ApiSelect",
  created() {
    // 获取 下拉框选择的数据
    this.setOptionSource();
  },
  props: {
    // label 标签 for 的id
    id: {
      type: String,
    },
    // 占位内容
    placeholder: {
      type: String,
    },
    // 表单值
    value: {
      type: [String, Array, Number, Boolean],
    },
    // 选项
    option: {
      type: Array,
    },
    // 获取数据的 地址
    api: String,
    // 大小
    size: {
      type: String,
      default: "small",
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 多选 状态下, 值的返回形式, string 逗号分隔字符串, array 数组
    multipleValueType: {
      type: String,
      default: "array",
    },
    // 名称, 值, 备注重命名
    props: {
      type: Object,
      default: () => {
        return {
          label: "name",
          value: "id",
          children: "children",
        };
      },
    },
    // 允许清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 自动选择第一个选项, 如果没有, 不选
    autoSelectFirst: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      thisOption: this.option,
      // 键值对照, 分组二级key
      thisProps: {
        label: this.props.label || "name",
        value: this.props.value || "id",
        children: this.props.children || "children",
      },
    };
  },
  computed: {
    thisValue() {
      // 多选, 且多选值类型为 string 逗号分隔字符串
      let thisValue;
      if (this.multiple && this.multipleValueType === "string") {
        thisValue = Util.commaStringToList(this.value);
        // 解决选项内值为 Number 类型, 字符串分割后, 值为 String 类型, 导致 el-select 无法选中的问题
        if (this.thisOption && this.thisOption.length && typeof this.thisOption[0][this.thisProps.value] == 'number') {
          thisValue = thisValue.map(item => Number(item));
        }
      } else {
        thisValue = this.value;
      }
      return thisValue;
    }
  },
  methods: {
    /**
     * 设置 option 源
     * 优先级别: option > api
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
    /**
     * focus 向上引出
     */
    focus() {
      this.$refs.elSelect.focus();
    },
    /**
     * change 事件
     */
    change(newVal) {
      if (newVal == this.value) {
        return;
      }
      let value;
      if (this.multiple && this.multipleValueType === "string") {
        value = Util.listToCommaString(newVal);
      } else {
        value = newVal;
      }
      this.$emit("input", value);
      this.$emit('change', value);
    },
    // 设置值
    setValue(value) {
      this.change(value);
    },
    // 修改选项
    changeOptions(options) {
      this.thisOption = options;
      // 新的选项为空, 设置值为空
      if (!this.thisOption || !this.thisOption.length) {
        this.setValue(undefined);
        return;
      }
      // 新的选项包含已选择的值 (单选)
      const has = this.thisOption.find(item => item[this.thisProps.value] == this.thisValue);
      if (has) {
        return;
      }

      // 自动选择第一项
      if (this.autoSelectFirst) {
        this.setValue(this.thisOption[0][this.thisProps.value]);
        return;
      }

      // 新的选项不包含新的值
      this.setValue(undefined);
    }
  },
  watch: {
    // api 变更, 更新选项, 更新值
    api(newVal) {
      api.get(newVal).then((r) => {
        this.changeOptions(r.data);
      });
    },
    // 监听上层选项改变, 更新选项, 更新值
    option(newVal) {
      this.changeOptions(newVal)
    }
  },
};
</script>
