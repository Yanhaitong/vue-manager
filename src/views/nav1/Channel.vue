<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="channelName" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getChannelList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="channelList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="channelName" label="渠道">
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="渠道名称" prop="name">
                    <el-input v-model="addForm.channelName" style="width: 50%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="渠道名称" prop="name">
                    <el-input v-model="editForm.channelName" style="width: 50%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
                total: 0,
                page: 1,
                pageSize: 20,
                editFormVisible: false,
                editForm: {},
                editLoading: false,
                addFormVisible: false,
                addForm: {},
                addLoading: false,
                listLoading: false,
                sels: [],//列表选中列
                channelName: ''
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
                    channelName: this.channelName,
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                this.$http.post('http://localhost:8086/channelManager/getChannelList', para, {emulateJSON: true}).then(result => {
                    this.total = result.body.data.total;
                    this.channelList = result.body.data.records;
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

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = {id: this.editForm.id, channelName: this.editForm.channelName};
                            this.$http.post('http://localhost:8086/channelManager/updateChannel', para, {emulateJSON: true}).then(result => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.editFormVisible = false;
                                this.getChannelList();
                            })
                        });
                    }
                });
            },

            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.editLoading = true;
                    let para = {id: row.id};
                    this.$http.post('http://localhost:8086/channelManager/updateChannel', para, {emulateJSON: true}).then(result => {
                        this.editLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getChannelList();
                    })
                }).catch(() => {

                });
            },


            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
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