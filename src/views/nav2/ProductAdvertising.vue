<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="产品名称">
                    <el-input v-model="filters.productName" placeholder="请输入产品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户端" prop="client">
                    <el-select v-model="filters.clientName" placeholder="请选择客户端" clearable>
                        <el-option v-for="item in client" :label="item.clientName" :value="item.clientName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProductAdvertisingList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="advertisingList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="productName" label="产品">
            </el-table-column>
            <el-table-column prop="typeName" label="位置">
            </el-table-column>
            <el-table-column prop="clientName" label="客户端">
            </el-table-column>
            <el-table-column prop="dataTime" label="添加时间">
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
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="产品名称" prop="product">
                    <el-select v-model="addForm.productInfoId" placeholder="请选择产品">
                        <el-option v-for="item in product" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置" prop="type" @change="typeChange">
                    <el-select v-model="addForm.type" placeholder="请选择广告位置">
                        <el-option label="启动图" value="0"></el-option>
                        <el-option label="首页弹框" value="1"></el-option>
                        <el-option label="首页轮播图" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端" prop="client" @change="clientChange">
                    <el-checkbox-group v-model="addForm.clientNames">
                        <el-checkbox v-for="item in client" :label="item.clientName" :key="item.id"></el-checkbox>
                    </el-checkbox-group>
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
                <el-form-item label="产品名称" prop="product">
                    <el-select v-model="editForm.productInfoId" placeholder="请选择产品">
                        <el-option v-for="item in product" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置" prop="type">
                    <el-select v-model="editForm.type" placeholder="请选择广告位置">
                        <el-option label="启动图" value="0">启动图</el-option>
                        <el-option label="首页弹框" value="1">首页弹框</el-option>
                        <el-option label="首页轮播图" value="2">首页轮播图</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端" prop="client" @change="clientChange">
                    <el-select v-model="editForm.clientName" placeholder="请选择客户端">
                        <el-option v-for="item in client" :label="item.clientName" :value="item.clientName"></el-option>
                    </el-select>
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
                filters: {
                    productName: '',
                    clientName: ''
                },
                total: 0,
                page: 1,
                pageSize: 20,
                listLoading: false,
                sels: [],//列表选中列
                addForm: {
                    clientNames: []
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                editFormVisible: false,
                editForm: {
                    typeName: ''
                },
                editLoading: false,

            }
        },
        methods: {
            //分页
            handleCurrentChange(val) {
                this.page = val;
                this.getProductList();
            },

            //获取广告配置列表
            getProductAdvertisingList() {
                let para = {
                    productName: this.filters.productName,
                    clientName: this.filters.clientName,
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                this.$http.post('http://localhost:8086/advertising/getAdvertisingList', para, {emulateJSON: true}).then(result => {
                    this.total = result.body.data.total;
                    this.advertisingList = result.body.data.records;
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
                            var json = JSON.stringify(para);
                            this.$http.post('http://localhost:8086/advertising/addAdvertising', json, {emulateJSON: true}).then(result => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.addFormVisible = false;
                                this.getProductAdvertisingList();
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
                            let para = {
                                id: this.editForm.id,
                                productInfoId: this.editForm.productInfoId,
                                type: this.editForm.type,
                                clientName: this.editForm.clientName
                            };
                            var json = JSON.stringify(para);
                            this.$http.post('http://localhost:8086/advertising/upDateAdvertising', json, {emulateJSON: true}).then(result => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.editFormVisible = false;
                                this.getProductAdvertisingList();
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
                    this.$http.post('http://localhost:8086/advertising/deleteAdvertising', para, {emulateJSON: true}).then(result => {
                        this.editLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getProductAdvertisingList();
                    })
                }).catch(() => {

                });
            },

            //获取产品信息列表（条件查询使用）
            getAllProducts() {
                this.$http.post('http://localhost:8086/loanProduct/getAllProducts', null, {emulateJSON: true}).then(result => {
                    this.product = result.body.data;
                })
            },

            //获取客户端列表（条件查询使用）
            getAllClients() {
                this.$http.post('http://localhost:8086/clientManager/getAllClients', null, {emulateJSON: true}).then(result => {
                    this.client = result.body.data;
                })
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.editForm.type = 1;
            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            clientChange: function (sels) {
                this.clientName = sels;
            },

            typeChange: function (sels) {
                this.type = sels;
            },
        },
        mounted() {
            this.getProductAdvertisingList();
            this.getAllProducts();
            this.getAllClients();
        }
    }

</script>

<style scoped>

</style>