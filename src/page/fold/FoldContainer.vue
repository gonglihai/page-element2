<!-- 折叠容器 -->
<template>
  <div class="fold-container" :class="'fold-container-' + direction">
    <el-collapse-transition v-if="direction == 'y'">
      <div v-show="!fold">
        <slot></slot>
      </div>
    </el-collapse-transition>
    <div v-else-if="direction == 'x'" :style="{ width: fold ? 0 : width }">
      <slot></slot>
    </div>
    <fold-button :fold.sync="fold" :name="name" :direction="direction"></fold-button>
  </div>

</template>
<script>
import FoldButton from "./FoldButton.vue";

export default {
  components: {
    FoldButton,
  },
  props: {
    // 方向
    direction: {
      type: String,
      default: "y",
    },
    // 展开/折叠 xxxx
    name: {
      type: String,
      default: ''
    },
    // 当方向为 x 水平时, 容器宽度
    width: {
      type: String,
    },
    // 默认是否折叠, true 折叠, false 不折叠
    defaultFold: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fold: this.defaultFold
    }
  }
}
</script>
<style scoped>
.fold-container {
  display: flex;
}

.fold-container-y {
  flex-direction: column;
}

.fold-container-x {
  flex-direction: row;
}

.fold-container-x>div {
  overflow: hidden;
  transition: all 0.3s;
}
</style>