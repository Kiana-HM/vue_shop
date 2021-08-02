<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域 -->
    <el-card>
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input v-model='queryInfo.query' placeholder='请输入内容'>
            <el-button slot='append' icon='el-icon-search' @click='getGoodsList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='goAddPage'>添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data='goodslist' border stripe>
        <el-table-column label='序号' type='index'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格(元)' prop='goods_price' width='95px'></el-table-column>
        <el-table-column label='商品重量' prop='goods_weight' width='70px'></el-table-column>
        <el-table-column label='创建时间' prop='add_time' width='140px'>
          <template slot-scope='scope'>
            {{ scope.row.add_time * 1000 | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='130px'>
          <template slot-scope='scope'>
            <el-button icon='el-icon-edit' size='mini' type='primary' @click='editById(scope.row.goods_id)'></el-button>
            <el-button icon='el-icon-delete' size='mini' type='danger'
                       @click='removeById(scope.row.goods_id)'></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        :current-page='queryInfo.pagenum'
        :page-size='queryInfo.pagesize'
        :page-sizes='[5, 10, 15, 20]'
        :total='total'
        background
        layout='total, sizes, prev, pager, next, jumper'
        @size-change='handleSizeChange' @current-change='handleCurrentChange'>
      </el-pagination>
    </el-card>

    <!--编辑商品信息对话框-->
    <el-dialog
      :visible.sync='editGoodsDialogVisible'
      title='修改商品信息'
      width='50%'
      @close='editGoodsDialogVisibleClose'>
      <el-form ref='editGoodsFormRef' :model='editGoodsForm' :rules='editGoodsFormRules' label-width='80px'>
        <el-form-item label='商品名称' prop='goods_name'>
          <el-input v-model='editGoodsForm.goods_name'></el-input>
        </el-form-item>
        <el-form-item label='商品价格' prop='goods_price'>
          <el-input v-model='editGoodsForm.goods_price'></el-input>
        </el-form-item>
        <el-form-item label='商品重量' prop='goods_weight'>
          <el-input v-model='editGoodsForm.goods_weight'></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class='dialog-footer'>
      <el-button @click='editGoodsDialogVisible = false'>取 消</el-button>
      <el-button type='primary' @click='editGoods'>确 定</el-button>
    </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
      // 展示修改对话框
      editGoodsDialogVisible: false,
      editGoodsForm: {
        goods_id: '',
        goods_name: '',
        goods_price: '',
        goods_weight: ''
      },
      editGoodsFormRules: {
        goods_name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const {
        data: res
      } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      await this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 展示编辑商品信息的对话框
    async editById(id) {
      const {data: res} = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200){
        return this.$message.error('获取商品信息失败')
      }

      this.editGoodsForm = res.data
      this.editGoodsDialogVisible = true
    },
    // 监听编辑商品对话框关闭事件
    editGoodsDialogVisibleClose() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    // 编辑商品信息
    editGoods() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单验证失败，请重新填写表单')
        const { data: res } = await this.$http.put(`goods/${this.editGoodsForm.goods_id}`, this.editGoodsForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品信息失败')
        }
        this.$message.success('修改商品信息成功')
        this.editGoodsDialogVisible = false
        await this.getGoodsList()
      })
    }
  }
}
</script>

<style lang='less' scoped>

</style>
