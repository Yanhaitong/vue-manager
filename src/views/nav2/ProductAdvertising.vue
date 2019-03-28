<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="产品名称">
                    <el-input v-model="filters.productName" placeholder="请输入产品名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户端">
                    <el-select v-model="filters.clientName" placeholder="请选择客户端" clearable>
                        <el-option v-for="item in clientNameList" :label="item.clientName" :value="item.clientName"></el-option>
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
        <el-table :data="advertisingList" highlight-current-row v-loading="listLoading" style="width: 100%;">
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
                <el-form-item label="产品名称" prop="productInfoId">
                    <el-select v-model="addForm.productInfoId" placeholder="请选择产品" @change="testChange">
                        <el-option v-for="item in productInfoList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择广告位置">
                        <el-option label="启动图" value="0">启动图</el-option>
                        <el-option label="首页弹框" value="1">首页弹框</el-option>
                        <el-option label="首页轮播图" value="2">首页轮播图</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端" prop="clientNames">
                    <el-checkbox-group v-model="addForm.clientNames">
                        <el-checkbox v-for="item in clientNameList" :label="item.clientName" :value="item.clientName"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="icon">
                    <el-upload
                            class="upload-demo"
                            :action="upload_qiniu_url"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleError"
                            :before-upload="beforeAvatarUpload"
                            :data="qiniuData">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="产品名称">
                    <el-select v-model="editForm.productInfoId" placeholder="请选择产品">
                        <el-option v-for="item in productInfoList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位置">
                    <el-select v-model="editForm.type" placeholder="请选择广告位置">
                        <el-option label="启动图" :value="0">启动图</el-option>
                        <el-option label="首页弹框" :value="1">首页弹框</el-option>
                        <el-option label="首页轮播图" :value="2">首页轮播图</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端">
                    <el-select v-model="editForm.clientName" placeholder="请选择客户端">
                        <el-option v-for="item in clientNameList" :label="item.clientName" :value="item.clientName"></el-option>
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

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 88px;
        height: 88px;
        line-height: 88px;
        text-align: center;
    }
    .avatar {
        width: 88px;
        height: 88px;
        display: block;
    }
</style>

<script>
    export default {
        data() {
            return {
                filters: {
                    productName: '',
                    clientName: ''
                },
                advertisingList: [],
                total: 0,
                page: 1,
                pageSize: 20,
                listLoading: false,
                sels: [],//列表选中列

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    productInfoId: '',
                    type: '',
                    clientNames: ''
                },
                addFormRules: {
                    productInfoId: [
                        {required: true, message: '请选择产品', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'}
                    ],
                    clientNames: [
                        {required: true, message: '请选择客户端', trigger: 'blur'}
                    ],
                },
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    productInfoId: '',
                    type: '',
                    clientName: ''
                },
                productInfoList: '',
                clientNameList: '',
                qiniuData: {
                    key: "test_1553781030199.png",
                    token: "BlO3EQW0iUXWqfG-ftiUCN-XM2JPyvvq-WaVoyWg:qE2s-0IYK-YU_MmV-fVG8VZggAM=:eyJzY29wZSI6ImFwcF9wYWNrYWdlOnRlc3RfMTU1Mzc4MTAzMDE5OS5wbmciLCJkZWFkbGluZSI6MTU1Mzc4MTMzMH0="
                },
                // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
                upload_qiniu_url: "https://upload-z0.qiniup.com",
                // 七牛云返回储存图片的子域名
                upload_qiniu_addr: "http://abc.clouddn.com/",
                imageUrl: "",
                Global: {
                    dataUrl: 'http://yoursite.com'
                }
            }
        },
        methods: {

            beforeAvatarUpload: function(file) {
                const isJPG = file.type === "image/jpeg";
                const isPNG = file.type === "image/png";
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG && !isPNG) {
                    this.$message.error("图片只能是 JPG/PNG 格式!");
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error("图片大小不能超过 2MB!");
                    return false;
                }
            },
            handleAvatarSuccess: function(res, file) {
                this.imageUrl = this.upload_qiniu_addr + res.key;
                console.log(this.imageUrl);
            },
            handleError: function(res) {
                this.$message({
                    message: "上传失败",
                    duration: 2000,
                    type: "warning"
                });
            },

            //分页
            handleCurrentChange(val) {
                this.page = val;
                this.getProductAdvertisingList();
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
                let json = JSON.stringify(para);
                this.$http.post('http://localhost:8086/advertising/getAdvertisingList', json, {emulateJSON: true}).then(result => {
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
                            let json = JSON.stringify(para);
                            this.$http.post('http://localhost:8086/advertising/addAdvertising', json, {emulateJSON: true}).then(result => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                //清空数据
                                this.addForm.clientNames = '';
                                this.addForm.productInfoId = '';
                                this.addForm.type = '';
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
                            let json = JSON.stringify(para);
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
                    this.productInfoList = result.body.data;
                })
            },

            //获取客户端列表（条件查询使用）
            getAllClients() {
                this.$http.post('http://localhost:8086/clientManager/getAllClients', null, {emulateJSON: true}).then(result => {
                    this.clientNameList = result.body.data;
                })
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

            testChange: function (s) {
                this.addForm.productInfoId = s;
            }

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