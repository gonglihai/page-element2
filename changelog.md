# 变更日志 Changelog

## [0.2.4] - 2025-04-23
### 🐞 修复

- 解决 `search` 查询条件重置时, `searchItem` 查询表单项 `change` 不触发问题


### 🛠️ 变更

- `table` 不在主动进行初始化查询, 由 `search` 调用初始化查询, 同一查询条件, 去除 `initSearch`




## [0.2.3] - 2025-04-23
### ✨ 新增

- `search` 查询条件表单项对象添加 `change` 表单项值改变事件, 函数参数为查询条件表单值对象
- `DateRangeSelect.vue` 日期范围选择器
  - 添加 `fullDay` 属性。当 `valueFormat` 为 `'yyyy-MM-dd'` 时, 是否补全时间, 开始时间添加 `00:00:00`, 结束时间添加 `23:59:59`, 默认 `true`
  - 添加 `change` 事件

- `ApiSelect.vue` 
  - 添加 `disabled` 是否禁用
  - 当 `option` 选项发生变化时, 重新赋值, 与 `api` 发生变化时保持一致


### 🔥 移除
- `ApiSelect.vue` 移除选项分组



## [0.2.2] - 2025-03-18
### ✨ 新增
- `tree` 左侧树、`search` 查询条件添加 `fold` 属性, 是否默认折叠, true 默认折叠, false 默认不折叠




## [0.2.1] - 2025-03-05
### ✨ 新增

- 数据表格相关全局配置
  - `pageSizes` 页码选项
  - `stripe` 斑马纹
  - `select` 是否开启 checkbox 选择器
  - `rowClickSelect` 是否开启行点击选中
  - `pagination` 是否开启分页
  - `border` 是否显示竖边框(多级表头强制开启)
  - `defaultExpandAll` 树形表格, 默认展开全部
  - `size` 默认表格大小
  - `orderField` 请求参数, 排序字段名
  - `orderBy` 排序顺序方式数组, 第一位为正序, 第二位为倒序
- 左侧树添加全局配置 
  - `addRoot` 是否向数据添加根节点
  - `rootName` 添加的根节点显示名称
  - `rootValue` 添加的根节点的值
- 数据表格新增排序

### 🛠️ 变更

- 左侧树方法名变更, 从 `setTreeDataSource` 修改为 `reloadData`
- 左侧树全部配置 `props` 移除层级
- 数据表格全局配置 `page`、`props` 移除层级
- 左侧树 style 修改为 scoped


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