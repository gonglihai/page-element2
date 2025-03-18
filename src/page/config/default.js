import TableColTypes from "../table/col/TableColTypesRegister";

export function defaultConfig() {
  return {
    search: {
      size: 'small',            // 表单项和查询/重置按钮的大小
      fold: false,              // 默认折叠, true 折叠, false 不折叠
    },
    button: {
      size: 'small',            // 按钮大小
    },
    table: {
      response: (r) => {        // 数据表格请求响应处理
        return {
          'rows': r.data,       // 此处 rows 字段名来源于下方 table.dataField 配置的值
          'total': r.count      // 此处 total 字段名来源于下方 table.totalField 配置的值
        }
      },
      colType: TableColTypes,   // 默认列类型
      stripe: false,            // 是否开启斑马纹
      select: true,             // 是否开启 checkbox 选择器
      rowClickSelect: false,    // 是否开启行点击选中

      border: false,            // 是否显示竖边框(多级表头强制开启)
      defaultExpandAll: false,  // 树形表格, 默认展开全部
      size: 'small',            // 默认表格大小

      // 分页相关
      pagination: true,         // 是否开启分页
      pageSizes: [20, 50, 100, 200], // 页码选项
      pageNumber: 'pageNo',     // 请求参数, 页码字段名
      pageSize: 'pageSize',     // 请求参数, 页大小字段名
      dataField: 'rows',        // 响应, 数据行的字段名
      totalField: 'total',      // 响应, 数据数量的字段名

      // 排序
      orderField: 'orderBy',    // 请求参数, 排序字段名
      orderBy: ['asc', 'desc'], // 排序顺序字段名数组, 第一位为正序, 第二位为倒序
    },
    tree: {
      width: '300px',           // 树宽度
      expand: false,            // 默认展开全部
      expandLevel: 1,           // 树展开级别
      response: (r) => r.data,  // 树数据请求响应处理
      labelField: 'name',       // 树节点显示字段名
      valueField: 'id',         // 树节点值字段名
      childrenField: 'children',// 树子节点字段名
      addRoot: false,           // 是否向数据添加根节点
      rootName: '全部',         // 添加的根节点显示名称
      rootValue: undefined,     // 添加的根节点的值
      fold: false,              // 默认折叠, true 折叠, false 不折叠
    },
  }
}