// todo 优化为 search, tree, table, button, 等对象分开
export function defaultConfig() {
  return {
    table: {
      rowClickSelect: true,   // 行点击选中
    },
    tree: {
      width: '300px',         // 树宽度
      expandLevel: 1,         // 树展开级别
      response: (r) => {      // 树数据请求响应处理
        return r.data;
      },
      props: {
        label: 'name',        // 树节点显示字段
        value: 'id',          // 树节点值字段
        children: 'children', // 树子节点字段
      }
    },
    page: {
      pageNumber: 'pageNo',   // 页码
      pageSize: 'pageSize',   // 页大小
    },
    // 数据表格请求响应处理
    dataTableResponse: (response) => {
      return {
        'rows': response.data,
        'total': response.count
      }
    },
    tableSize: 'small',       // 默认表格大小
  }
}