<!-- 带自动请求 api 的下拉框
  -- @author GongLiHai
 -->
<template>
  <div>
    <el-select v-model="thisValue" :placeholder="placeholder" :size="size" :id="id" :multiple="multiple"
      :clearable="clearable" filterable ref="elSelect" @change="change">
      <!-- 分组 -->
      <template v-if="group">
        <el-option-group v-for="(l1, l1_) in thisOption" :key="'l1_' + l1_" :label="l1[thisProps.label]">
          <el-option v-for="(l2, l2_) in l1[thisProps.children]" :key="'l2_' + l2_" :label="l2[thisProps.label]"
            :value="l2[thisProps.value]">
          </el-option>
        </el-option-group>
      </template>
      <!-- 普通 -->
      <template v-else>
        <el-option v-for="(item, index) in thisOption" :key="index" :label="item[thisProps.label]"
          :value="item[thisProps.value]">
        </el-option>
      </template>
    </el-select>
  </div>
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
      type: [String, Array, Number],
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
    // 选项分组
    group: {
      type: Boolean,
      default: false,
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
    }
  },
  data() {
    return {
      // 本组件的 value, option
      thisValue: this.value,
      thisOption: this.option,
      // 键值对照, 分组二级key
      thisProps: {
        label: this.props.label || "name",
        value: this.props.value || "id",
        children: this.props.children || "children",
      },
    };
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
      let value;
      if (this.multiple && this.multipleValueType === "string") {
        value = Util.listToCommaString(newVal);
      } else {
        value = newVal;
      }
      this.$emit("input", value);
      this.$emit("change", value);
    },
    // 设置值
    setValue(value) {
      this.thisValue = value;
      this.change(value);
    },
    // 修改选项
    changeOptions(options) {
      this.thisOption = options;
      // 新的选项为空, 设置值为空
      if (!this.thisOption || !this.thisOption.length) {
        this.setValue(null);
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
      this.setValue(null);
    }
  },
  watch: {
    // 上层 value 改变, 本层 thisValue 改变
    value(newVal) {
      // 多选, 且多选值类型为 string 逗号分隔字符串
      let thisValue;
      if (this.multiple && this.multipleValueType === "string") {
        thisValue = Util.commaStringToList(newVal);
      } else {
        thisValue = newVal;
      }
      this.thisValue = thisValue;
    },
    // api 变更, 更新选项, 更新值
    api(newVal) {
      api.get(newVal).then((r) => {
        this.changeOptions(r.data);
      });
    }
  },
};
</script>
