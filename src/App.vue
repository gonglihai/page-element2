<template>
  <div id="app">
    <CPage :page="pageOption"></CPage>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      pageOption: {
        tree: {
          field: 'deptId',
          api: '/mook/tree.json',
        },
        search: [
          { label: '企微账号', field: 'code' },
          { label: '姓名', field: 'name' },
          {
            label: '性别', field: 'gender', type: 'select', option: [
              { id: '0', name: '男' },
              { id: '1', name: '女' },
              { id: '2', name: '未知' }
            ]
          }
        ],
        button: [
          { name: '添加' },
          { name: '编辑' },
          { name: '删除' }
        ],
        table: {
          api: '/mook/table.json',
          col: [
            { field: "id", name: "编号" },
            { field: "name", name: "姓名" },
            { field: "gender", name: "性别" },
            { field: "birthday", name: "生日" },
            { field: "age", name: "年龄" },
            {
              name: '联系方式', children: [
                { field: "email", name: "电子邮件" },
                { field: "phone", name: "电话号码" },
              ]
            },
            { field: "city", name: "城市" },
            { field: "address", name: "地址" },
            { field: "occupation", name: "职业" },
            { field: "company", name: "公司" },
            { field: "hobbies", name: "爱好", fmt: (value) => value.join(',') },
            {
              name: '操作', type: "button", button: [
                { name: '详情' },
                { name: '编辑' },
                { name: '删除', confirmClick: ({ row }) => console.log('点击了删除, row: ', row) },
              ]
            }
          ]
        }
      }
    }
  }
}
</script>

<style>
body,
html,
#app {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

#app {
  padding: 8px;
  box-sizing: border-box;
}
</style>
