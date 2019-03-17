<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name1" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="name" label="渠道">
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleHidden(scope.$index, scope.row)">隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="客户端名称" prop="clientName">
                    <el-input v-model="addForm.clientName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
</template>

<script>
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                total: 0,
                page: 1,
                pageSize: 20,
                addFormVisible: false,
                addForm: {},
                addLoading: false,
                listLoading: false,
                sels: [],//列表选中列

            }
        },
        methods: {
            //分页
            handleCurrentChange(val) {
                this.page = val;
                this.getProductList();
            },

            //获取客户端列表
            getChannelList() {
                let para = {
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                this.$http.post('http://localhost:8086/channelManager/getChannelList', para, {emulateJSON: true}).then(result => {
                    this.total = result.body.data.total;
                    this.users = result.body.data.records;
                    this.listLoading = false;
                })
            },

            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            this.$http.post('http://localhost:8086/channelManager/addChannel', para, {emulateJSON: true}).then(result => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.addFormVisible = false;
                                this.getChannelList();
                            })
                        });
                    }
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getChannelList();
        }
    }

</script>

<style scoped>

</style>