/**
 * 数据表格列类型注册定义
 * 现已支持的列类型:
 * 1. text    文本 与 fmt 函数
 * 2. switch  开关
 * 3. tag     标签
 * 4. button  多按钮
 * 5. link    链接
 */
import TextCol from "./cols/TextCol.vue";
import SwitchCol from "./cols/SwitchCol.vue";
import TagCol from "./cols/TagCol.vue";
import ButtonsCol from "./cols/ButtonsCol.vue";
import LinkCol from "./cols/LinkCol.vue";

export default {
  text: TextCol,
  switch: SwitchCol,
  tag: TagCol,
  button: ButtonsCol,
  link: LinkCol
};
