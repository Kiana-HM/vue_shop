<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span='8'>
          <el-input placeholder='请输入内容'>
            <el-button slot='append' icon='el-icon-search'></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据-->
      <el-table :data='orderList' border stripe>
        <el-table-column label='序号' type='index'></el-table-column>
        <el-table-column label='订单编号' prop='order_number'></el-table-column>
        <el-table-column label='订单价格' prop='order_price'></el-table-column>
        <el-table-column label='是否付款' prop='pay_status'>
          <template slot-scope='scope'>
            <el-tag v-if="scope.row.pay_status === '1'" type='success'>已付款</el-tag>
            <el-tag v-else type='danger'>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='是否发货' prop='is_send'></el-table-column>
        <el-table-column label='下单时间' prop='create_time'>
          <template slot-scope='scope'>
            {{ scope.row.create_time * 1000 | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template>
            <el-button icon='el-icon-edit' size='mini' type='primary' @click='showBox'></el-button>
            <el-button icon='el-icon-location' size='mini' type='success' @click='showProgressBox'></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        :current-page='queryInfo.pagenum'
        :page-size='queryInfo.pagesize'
        :page-sizes='[5, 10, 15]'
        :total='total'
        layout='total, sizes, prev, pager, next, jumper'
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'>
      </el-pagination>
    </el-card>

    <!--修改地址的对话框-->
    <el-dialog
      :visible.sync='addressVisible'
      title='修改地址'
      width='50%' @close='addressDialogClosed'>
      <el-form ref='addressFormRef' :model='addressForm' :rules='addressFormRules' label-width='100px'>
        <el-form-item label='省市区/县' prop='address1'>
          <el-cascader v-model='addressForm.address1' :options='cityData'></el-cascader>
        </el-form-item>
        <el-form-item label='详细地址' prop='address2'>
          <el-input v-model='addressForm.address2'></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
    <span class='dialog-footer'>
      <el-button @click='addressVisible = false'>取 消</el-button>
      <el-button type='primary' @click='addressVisible = false'>确 定</el-button>
    </span>
      </template>
    </el-dialog>

    <!--展示物流进度的对话框-->
    <el-dialog
      :visible.sync='progressVisible'
      title='物流进度'
      width='50%'>
      <!--时间线-->
      <el-timeline>
        <el-timeline-item
          v-for='(activity, index) in progressInfo'
          :key='index'
          :timestamp='activity.timestamp'>
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/assets/citydata'
import Kuaidi from '@/assets/kuaidi'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{
          required: true,
          message: '请选择省市区/县',
          trigger: 'blur'
        }],
        address2: [{
          required: true,
          message: '请填写详细地址',
          trigger: 'blur'
        }]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }

      console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },

    async showProgressBox() {
      // const {data:res} =await this.$http.get('/kuaidi/1106975712662')
      // if (res.meta.status !== 200){
      //   return this.$message.error('获取物流进度失败')
      // }

      this.progressInfo = Kuaidi.data

      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>
