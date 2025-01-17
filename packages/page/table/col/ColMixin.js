/**
 * 数据表格列 混入
 */
export default {
  props: {
    col: Object, // 列配置 page.table.col[item] 的配置
    scope: Object, // element-ui Table-column Scoped
  },
  computed: {
    /**
     * 计算后的表格内容, 如果有 fmt 函数, 使用 fmt 函数格式化
     * fmt 函数参数顺序: (value, row, index, col, scope)
     *    value 字段列值  scope.row[col.field]
     *    row   数据行    scope.row
     *    index 序号      scope.$index
     *    col   列配置    page.table.col[item]
     *    scope element-ui Table-column Scoped
     * @returns {Object} row[col.field] 或 fmt 函数执行的结果
     */
    content() {
      const col = this.col;
      const scope = this.scope;
      // fmt 函数参数顺序: (value, row, index, col, scope)
      return col.fmt
        ? col.fmt(scope.row[col.field], scope.row, scope.$index, col, scope)
        : scope.row[col.field];
    },
  },
};
