import TableColTypes from "../table/col/TableColTypesRegister";

export function defaultConfig() {
  return {
    search: {
      size: 'small'             // 表单项和查询/重置按钮的大小
    },
    button: {
      size: 'small',            // 按钮大小
    },
    table: {
      rowClickSelect: false,    // 行点击选中
      size: 'small',            // 默认表格大小
      page: {
        pageNumber: 'pageNo',   // 请求参数, 页码字段名
        pageSize: 'pageSize',   // 请求参数, 页大小字段名
      },
      response: (r) => {        // 数据表格请求响应处理
        return {
          'rows': r.data,       // 此处 rows 字段名来源于下方 table.props.data 配置的值
          'total': r.count      // 此处 total 字段名来源于下方 table.props.total 配置的值
        }
      },
      props: {
        data: 'rows',           // 响应, 数据行的字段名
        total: 'total'          // 响应, 数据总条数的字段名
      },
      colType: TableColTypes    // 默认列类型
    },
    tree: {
      width: '300px',           // 树宽度
      expandLevel: 1,           // 树展开级别
      response: (r) => {        // 树数据请求响应处理
        return r.data;
      },
      props: {
        label: 'name',          // 树节点显示字段名
        value: 'id',            // 树节点值字段名
        children: 'children',   // 树子节点字段名
      }
    },
  }
}