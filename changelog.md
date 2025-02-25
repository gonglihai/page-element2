# 变更日志 Changelog

## [0.1.26] - 2025-02-25

### ✨ 新增

- tree, search, button, table 组件 refs 映射



### 🛠️ 变更

- 查询条件 searchClick 方法名修改为 search



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