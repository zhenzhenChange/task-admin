<template>
  <div>
    <el-card class="card">
      <el-date-picker
        size="medium"
        class="ml-20"
        align="center"
        unlink-panels
        v-model="value"
        @change="filterDate"
        type="datetimerange"
        range-separator="至"
        end-placeholder="结束日期"
        start-placeholder="开始日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </el-card>
    <el-table
      stripe
      border
      ref="filterTable"
      :data="data.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
    >
      <el-table-column
        sortable
        width="180"
        align="center"
        label="提现日期"
        prop="wb_datetime"
        column-key="wb_datetime"
      >
        <template v-slot="scope">
          <i class="el-icon-time"></i>
          <span class="ml-10">{{ scope.row.wb_datetime | date }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="wb_id" label="流水编号"></el-table-column>
      <el-table-column align="center" prop="wb_uid" label="提现账号"></el-table-column>
      <el-table-column align="center" prop="wb_remark" label="备注"></el-table-column>
      <el-table-column align="center" label="提现金额">
        <template v-slot="scope">
          <span class="ml-10">{{ scope.row.wb_fee / 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-success"
            @click="openAgreed(scope.row.wb_id, scope.row.wb_uid, scope.row.wb_fee)"
          >
            同意申请
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-warning"
            @click="openRejected(scope.row.wb_id)"
          >
            驳回申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt-20 mb-20"
      :total="data.length"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @size-change="sizeChange"
      :current-page="currentPage"
      @current-change="currentChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      data: [],
      pageSize: 10,
      currentPage: 1,
      foreverData: [],
      pageSizes: [10, 20, 50, 100, 200, 300, 400],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: "",
    };
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapGetters(["userID", "key"]),
  },
  methods: {
    async getData() {
      const { data } = await this.$http.post(`/admin/doAdminShowWdApply`, {
        uid: this.userID,
        key: this.key,
      });
      if (Array.isArray(data)) {
        this.data = data;
      } else {
        this.$message.error({ message: `提现功能为${data}，或重新登录系统`, offset: 10 });
      }
    },
    filterDate(value) {
      if (!value) {
        this.data = this.foreverData;
        return;
      }
      this.data = this.foreverData;
      const start = value[0];
      const end = value[1];
      const dataTable = this.data.filter(dataTable => {
        return (
          new Date(dataTable.wb_datetime) >= new Date(start) &&
          new Date(dataTable.wb_datetime) <= new Date(end)
        );
      });
      this.data = dataTable;
    },
    sizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    currentChange(val) {
      this.currentPage = val;
    },
    openAgreed(id, uid, fee) {
      this.$confirm("确定同意提现申请吗？", "提示", { type: "info" })
        .then(async () => {
          const { data } = await this.$http.post(`/recv/withdrawApply`, {
            wb_id: id,
            wb_uid: uid,
            uid: this.userID,
            wb_fee: fee / 100,
            key: this.key,
          });
          if (data.ret === "true") {
            this.$message.success({ message: data.msg, offset: 10 });
          } else {
            this.$message.error({ message: data.msg, offset: 10 });
          }
        })
        .catch(() => {});
    },
    openRejected(wb_id) {
      this.$confirm("确定驳回提现申请吗？", "提示", { type: "info" })
        .then(async () => {
          const { data } = await this.$http.post(`/admin/doAdminRefuseWithdraw`, {
            wb_id,
            uid: this.userID,
          });
          this.$message.success({ message: `操作${data}`, offset: 10 });
          this.getData();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.part-table-expand {
  font-size: 0;
  label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>
