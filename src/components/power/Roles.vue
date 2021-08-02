<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type='primary' @click='showAddRolesDialog'>添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色列表区域-->
      <el-table :data='rolelist' border stripe>
        <!--展开列-->
        <el-table-column type='expand'>
          <template slot-scope='scope'>
            <el-row v-for='(item1,i1) in scope.row.children' :key='item1.id'
                    :class="['bdbottom', i1 === 0 ? 'bdtop' :'','vcenter']">
              <!--渲染一级权限-->
              <el-col :span='5'>
                <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{ item1.authName }}
                </el-tag>
                <i class='el-icon-caret-right'></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span='19'>
                <!--通过for循环嵌套渲染二级权限-->
                <el-row v-for='(item2,i2) in item1.children' :key='item2.id'
                        :class="[i2 === 0? '' :'bdtop','vcenter']">
                  <el-col :span='6'>
                    <el-tag closable type='success' @close='removeRightById(scope.row,item2.id)'>
                      {{ item2.authName }}
                    </el-tag>
                    <i class='el-icon-caret-right'></i>
                  </el-col>
                  <el-col :span='18'>
                    <!-- v-for="(item3,i3) -->
                    <el-tag v-for='(item3) in item2.children' :key='item3.id' closable
                            type='warning' @close='removeRightById(scope.row,item3.id)'>
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--<pre>-->
            <!--  {{scope.row}}-->
            <!--</pre>-->
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column label='序号' type='index'></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='300px'>
          <template slot-scope='scope'>
            <el-button icon='el-icon-edit' size='mini' type='primary' @click='showEditRoles(scope.row.id)'>
              编辑
            </el-button>
            <el-button icon='el-icon-delete' size='mini' type='danger'
                       @click='removeRolesDialog(scope.row.id)'>删除
            </el-button>
            <el-button icon='el-icon-setting' size='mini' type='warning'
                       @click='showSetRightDialog(scope.row)'>分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限的对话框-->
    <el-dialog :visible.sync='setRightDialogVisible' title='分配权限' width='50%' @close='setRightDialogClosed'>
      <!--树形控件-->
      <el-tree ref='treeRef' :data='rightsList' :default-checked-keys='defKeys' :props='treeProps'
               default-expand-all node-key='id' show-checkbox></el-tree>

      <span slot='footer' class='dialog-footer'>
				<el-button @click='setRightDialogVisible = false'>取 消</el-button>
				<el-button type='primary' @click='allotRights'>确 定</el-button>
			</span>
    </el-dialog>

    <!--添加用户的对话框-->
    <el-dialog :visible.sync='addRolesDialogVisible' title='添加用户' width='50%' @close='addRolesDialogClosed'>
      <el-form ref='addRolesFormRef' :model='addRolesForm' :rules='addRolesFormRules' label-width='100px'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='addRolesForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='addRolesForm.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class='dialog-footer'>
					<el-button @click='addRolesDialogVisible = false'>取 消</el-button>
					<el-button type='primary' @click='addRoles'>确 定</el-button>
				</span>
      </template>
    </el-dialog>

    <!--编辑角色对话框-->
    <el-dialog
      :visible.sync='editRolesDialogVisible'
      title='编辑角色'
      width='50%'
      @close='editRolesDialogClosed'>
      <el-form ref='editRolesFormRef' :model='editRolesForm' label-width='100px'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='editRolesForm.roleName' disabled></el-input>
        </el-form-item>

        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='editRolesForm.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class='dialog-footer'>
      <el-button @click='editRolesDialogVisible = false'>取 消</el-button>
      <el-button type='primary' @click='editRoles'>确 定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roldId: '',

      // 控制添加角色对话框的显示与隐藏
      addRolesDialogVisible: false,

      // 控制修改角色对话框的显示与隐藏
      editRolesDialogVisible: false,

      // 添加用户的表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }]
      },
      // 修改表单的数据对象
      editRolesForm:{}
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const {
        data: res
      } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.$message.success('获取角色列表成功')
      this.rolelist = res.data

      console.log(this.rolelist)
    },

    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }

      // this.getRolesList()
      role.children = res.data
    },

    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roldId = role.id
      // 获取所有权限的数据
      const {
        data: res
      } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data
      console.log(this.rightsList)
      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到desKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },

    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const {
        data: res
      } = await this.$http.post(`roles/${this.roldId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      await this.getRolesList()
      this.setRightDialogVisible = false
    },

    // 展示添加角色对话框
    showAddRolesDialog() {
      this.addRolesDialogVisible = true
    },

    // 点击按钮，添加新角色
    addRoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.post('roles', this.addRolesForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }

        this.$message.success('添加角色成功')

        await this.getRolesList()
        this.addRolesDialogVisible = false
      })
    },
    // 监听添加用户对话框的关闭事件
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 删除角色
    async removeRolesDialog(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {
        data: res
      } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      await this.getRolesList()
    },
    // 展示编辑角色对话框
    async showEditRoles(id) {
      this.editRolesDialogVisible = true

      const {data:res} = await this.$http.get(`roles/${id}`)
      this.editRolesForm = res.data
    },
    // 重置修改表单
    editRolesDialogClosed() {
      this.$refs.editRolesFormRef.resetFields()
    },

    editRoles() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${this.editRolesForm.roleId}`,this.editRolesForm)

        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败')
        }
        await this.getRolesList()
        this.editRolesDialogVisible = false

      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
