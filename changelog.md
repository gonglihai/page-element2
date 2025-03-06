# 变更日志 Changelog

## [0.2.1] - 2025-03-05
### ✨ 新增

- 数据表格相关全局配置
  - `page.pageSizes` 页码选项
  - `stripe` 斑马纹
  - `select` 是否开启 checkbox 选择器
  - `rowClickSelect` 是否开启行点击选中
  - `pagination` 是否开启分页
  - `border` 是否显示竖边框(多级表头强制开启)
  - `defaultExpandAll` 树形表格, 默认展开全部
  - `size` 默认表格大小
  - `sortable` 内置排序



### 🛠️ 变更

- 左侧树方法名变更, 从 `setTreeDataSource` 修改为 `reloadData`




### 🐞 修复

- 解决左侧树刷新数据后, 已选中数据消失问题




## [0.2.0] - 2025-03-05

### ✨ 新增

- 表格列类型扩展混入(`Mixin`)导出
- 全局配置增加 `table.colType` 列类型配置, 添加自定义列类型
- 表格分页左右增加插槽, `table-page-start` 分页之前、`table-page-end` 分页之后
- 操作按钮和查询条件 `size` 大小配置
- 数据表格行点击, `rowClickSelect` 取消选中配置
- 查询条件打印格式化



### 🛠️ 变更

- 全局配置 数据表格相关配置迁移到 table 下
  - `page` => `table.page`
  - `dataTableResponse` => `table.response`
  - `tableSize` => `table.size`
- 全局配置 tree 左侧树配置迁移
  - 新增 prop 属性名映射
  - `treeExpandLevel` => `tree.expandLevel`
  - `treeResponse` => `tree.response`
  - `leftTreeWidth` => `tree.width`



### 🐞 修复

- 左侧树选中的 label 不是字符串时, el-tooltip content 报错问题



### 🏗️ 构建

- 缩减体积, 减少无用依赖



## [0.1.26] - 2025-03-05

### ✨ 新增

- tree, search, button, table 组件 refs 映射
- 数据表格斑马纹 `stripe`



### 🛠️ 变更

- 查询条件 searchClick 方法名修改为 search
- 数据表格边框 (`border`) 默认为 true



### 🐞 修复
- 当查询条件 label 没有设置时 placeholder 显示 undefined 问题
- 查询条件 'date-range', 'year-month', 'date' 等类型 placeholder 动词错误问题
- 查询条件 移除 无用的 elementCode 属性
- 查询条件-下拉框, 解决选项内值为 Number 类型, 字符串分割后, 值为 String 类型, 导致 el-select 无法选中的问题 default 值不会选中 问题
- 日期, 日期范围 format 显示问题
- 默认 fetch 发送任何请求都是 get 方法的问题
- 默认 fetch 请求参数优化

















## 分类占位

**✨ 新增**：新功能

**🐞 修复**：修复 bug

**🛠️ 变更**：功能改动

**⚠️ 废弃**：即将废弃的功能

**🔥 移除**：删除的功能

**📖 文档**：文档更新

**🏗️ 构建**：构建、CI/CD 相关改动

**📝 其他**：其他小更新