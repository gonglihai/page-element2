<!-- 折叠展开按钮
  -- @author GongLiHai
 -->
<template>
  <button :title="(fold ? '展开' : '折叠') + name" @click="$emit('update:fold', !fold)" class="fold-button"
    :class="[buttonClass]">
    <i :class="[iconClass]" />
  </button>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: "y",
    },
    fold: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: "",
    },
  },
  computed: {
    buttonClass() {
      switch (this.direction) {
        case "x":
          return "fold-button-x";
        case "y":
        default:
          return "fold-button-y";
      }
    },
    iconClass() {
      switch (this.direction) {
        case "x":
          return this.fold ? "el-icon-caret-right " : "el-icon-caret-left";
        case "y":
        default:
          return this.fold ? "el-icon-caret-bottom" : "el-icon-caret-top";
      }
    },
  },
};
</script>
<style scoped>
.fold-button {
  border-radius: 10px;
  background-color: #f4f4f5;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  transition: all .3s;
}

.fold-button:hover {
  background-color: #e9e9eb;
}

.fold-button-x {
  width: 16px;
  height: 100%
}

.fold-button-y {
  height: 16px;
  width: 100%;
}
</style>