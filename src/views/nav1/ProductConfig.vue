<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; width: 100%">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="filters.title" placeholder="请输入产品名称" style="width: 22%"></el-input>
                    <el-select v-model="filters.client" placeholder="请选择客户端" style="width: 22%">
                        <el-option v-for="item in clientNameList" :label="item.clientnName" :value="item.clientnName"></el-option>
                    </el-select>
                    <el-select v-model="filters.product" placeholder="请选择产品" style="width: 22%">
                        <el-option v-for="item in productNameList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 20%">
                    <el-button type="primary" v-on:click="getProductList">查询</el-button>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="productList" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="name" label="产品名称">
            </el-table-column>
            <el-table-column prop="title" label="分类">
            </el-table-column>
            <el-table-column prop="clientName" label="客户端">
            </el-table-column>
            <el-table-column prop="channelName" label="渠道">
            </el-table-column>
            <el-table-column prop="recommend" label="推荐">
            </el-table-column>
            <el-table-column prop="carefullySelect" label="精选">
            </el-table-column>
            <el-table-column prop="latestProduct" label="最新">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="产品" prop="product">
                    <el-select v-model="addForm.productInfoId" placeholder="请选择产品">
                        <el-option v-for="item in product" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类" prop="classify">
                    <el-select v-model="addForm.classifyId" placeholder="请选择分类">
                        <el-option v-for="item in classify" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端" prop="client">
                    <el-checkbox-group v-model="addForm.clientNames">
                        <el-checkbox v-for="item in client" :label="item.clientName" :key="item.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-checkbox-group v-model="addForm.channelNames">
                        <el-checkbox v-for="item in channel" :label="item.channelName" :key="item.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="推荐" prop="recommend">
                    <el-radio-group v-model="addForm.recommend">
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="精品" prop="carefullySelect">
                    <el-radio-group v-model="addForm.carefullySelect">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="最新" prop="latestProduct">
                    <el-radio-group v-model="addForm.latestProduct">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="addForm">
                <el-form-item label="产品" prop="product">
                    <el-select v-model="editForm.productInfoId" placeholder="请选择产品">
                        <el-option v-for="item in product" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分类" prop="classify">
                    <el-select v-model="editForm.classifyId" placeholder="请选择分类">
                        <el-option v-for="item in classify" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端" prop="client">
                    <el-checkbox-group v-model="editForm.clientNames">
                        <el-checkbox v-for="item in client" :label="item.clientName" :key="item.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-checkbox-group v-model="editForm.channelNames">
                        <el-checkbox v-for="item in channel" :label="item.channelName" :key="item.id"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="推荐" prop="recommend">
                    <el-radio-group v-model="editForm.recommend">
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="精品" prop="carefullySelect">
                    <el-radio-group v-model="editForm.carefullySelect">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="最新" prop="latestProduct">
                    <el-radio-group v-model="editForm.latestProduct">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                total: 0,
                page: 1,
                pageSize: 20,
                listLoading: false,
                sels: [],//列表选中列
                clientNameList: '',
                productNameList: '',
                productList: '',
                filters: {
                    title: '',
                    client: '',
                    product: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    productInfoId: '',
                    classifyId: '',
                    clientNames: [],
                    channelNames: [],
                    recommend: '',
                    carefullySelect: '',
                    latestProduct: ''
                },
                addFormRules: {},

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {},
                editForm: {},
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
            },

            //获取产品列表
            getProductList() {
                let para = {
                    title: this.title,
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                let json = JSON.parse(para);
                this.listLoading = true;
                this.$http.post('http://localhost:8086/loanProductConfig/getLoanProductConfigList', json, {emulateJSON: true}).then(result => {
                    this.listLoading = false;
                    this.total = result.body.data.total;
                    this.productList = result.body.data.records;
                })
            },

            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    });
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

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                            });
                        });
                    }
                });
            },

            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            var json = JSON.stringify(para);
                            this.$http.post('http://localhost:8086/loanProductConfig/addLoanProductConfig', json, {emulateJSON: true}).then(result => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.addFormVisible = false;
                                this.getProductList();
                            })
                        });
                    }
                });
            },
        },

        //获取产品列表（条件查询使用）
        getAllProducts() {
            this.$http.post('http://localhost:8086/loanProduct/getAllProducts', null, {emulateJSON: true}).then(result => {
                this.productNameList = result.body.data;
            })
        },

        //获取客户端列表（条件查询使用）
        getAllClients() {
            this.$http.post('http://localhost:8086/clientManager/getAllClients', null, {emulateJSON: true}).then(result => {
                this.clientNameList = result.body.data;
            })
        },

        mounted() {
            this.getProductList();
            this.getAllProducts();
            this.getAllClients();
        }
    }

</script>

<style scoped>

</style>