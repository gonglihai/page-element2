export const config = {
  leftTreeWidth: '300px', // 左侧树默认宽度
  page: {
    pageNumber: 'pageNo', // 页码
    pageSize: 'pageSize', // 页大小
  },
  // 数据表格请求响应处理
  dataTableResponse: (response) => {
    return {
      'rows': response.data,
      'total': response.count
    }
  },
  tableSize: 'small', // 默认表格大小
  // 树数据请求响应处理
  treeResponse: (response) => {
    return response.data;
  },
  treeExpandLevel: 1, // 树展开级别
}