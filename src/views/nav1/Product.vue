<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getProductList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="loanProductInfoList" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="title" label="产品标题">
            </el-table-column>
            <el-table-column prop="name" label="产品名称">
            </el-table-column>
            <el-table-column prop="interestRate" label="贷款利率">
            </el-table-column>
            <el-table-column prop="interestRateType" label="利率类型">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button size="small" @click="handleView(scope.$index, scope.row)">详情</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleHidden(scope.$index, scope.row)">隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--详情界面-->
        <el-dialog title="详情" v-model="viewFormVisible" :close-on-click-modal="false">
            <el-form :model="viewForm" label-width="80px" ref="viewForm">
                <el-form-item label="产品标题">
                    <el-input v-model="viewForm.title" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="产品url">
                    <el-input v-model="viewForm.url" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-input v-model="viewForm.name" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="产品描述">
                    <el-input v-model="viewForm.description" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="产品说明">
                    <el-input v-model="viewForm.explainLabel" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="贷款利率" prop="interestRate">
                    <el-input v-model="viewForm.interestRate" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="利率类型" prop="interestRateType">
                    <el-radio-group v-model="viewForm.interestRateType" disabled="true">
                        <el-radio label="0">日利率</el-radio>
                        <el-radio label="1">月利率</el-radio>
                        <el-radio label="2">年利率</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="申请条件" prop="applyCondition">
                    <el-input v-model="viewForm.applyCondition" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所需资料" prop="needDatum">
                    <el-input v-model="viewForm.needDatum" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="贷款金额范围" prop="loanAmountScope">
                    <el-input v-model="viewForm.loanAmountScope" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="贷款期限范围" prop="loanTimeScope">
                    <el-input v-model="viewForm.loanTimeScope" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人数" prop="applyNum">
                    <el-input v-model="viewForm.applyNum" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="下款时间" prop="obtainTime">
                    <el-input v-model="viewForm.obtainTime" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="图标地址" prop="iconUrl">
                    <el-input v-model="viewForm.iconUrl" style="width: 80%;" disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="viewFormVisible = false">关闭</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="产品标题" prop="title">
                    <el-input v-model="editForm.title" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品url" prop="url">
                    <el-input v-model="editForm.url" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="name">
                    <el-input v-model="editForm.name" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品描述" prop="description">
                    <el-input v-model="editForm.description" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品说明" prop="explainLabel">
                    <el-input v-model="editForm.explainLabel" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="贷款利率" prop="interestRate">
                    <el-input v-model="editForm.interestRate" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="利率类型" prop="interestRateType">
                    <el-radio-group v-model="editForm.interestRateType">
                        <el-radio label="0">日利率</el-radio>
                        <el-radio label="1">月利率</el-radio>
                        <el-radio label="2">年利率</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="申请条件" prop="applyCondition">
                    <el-input v-model="editForm.applyCondition" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="所需资料" prop="needDatum">
                    <el-input v-model="editForm.needDatum" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="贷款金额范围" prop="loanAmountScope">
                    <el-input v-model="editForm.loanAmountScope" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="贷款期限范围" prop="loanTimeScope">
                    <el-input v-model="editForm.loanTimeScope" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="申请人数" prop="applyNum">
                    <el-input v-model="editForm.applyNum" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="下款时间" prop="obtainTime">
                    <el-input v-model="editForm.obtainTime" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="110px" :rules="addFormRules" ref="addForm">
                <el-form-item label="产品标题" prop="title">
                    <el-input v-model="addForm.title" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品url" prop="url">
                    <el-input v-model="addForm.url" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="name">
                    <el-input v-model="addForm.name" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品描述" prop="description">
                    <el-input v-model="addForm.description" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="产品说明" prop="explainLabel">
                    <el-input v-model="addForm.explainLabel" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="贷款利率" prop="interestRate">
                    <el-input v-model="addForm.interestRate" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="利率类型" prop="interestRateType">
                    <el-radio-group v-model="addForm.interestRateType">
                        <el-radio label="0">日利率</el-radio>
                        <el-radio label="1">月利率</el-radio>
                        <el-radio label="2">年利率</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="申请条件" prop="applyCondition">
                    <el-input v-model="addForm.applyCondition" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="所需资料" prop="needDatum">
                    <el-input v-model="addForm.needDatum" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="贷款金额范围" prop="loanAmountScope">
                    <el-input v-model="addForm.loanAmountScope" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="贷款期限范围" prop="loanTimeScope">
                    <el-input v-model="addForm.loanTimeScope" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="申请人数" prop="applyNum">
                    <el-input v-model="addForm.applyNum" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="下款时间" prop="obtainTime">
                    <el-input v-model="addForm.obtainTime" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-upload
                            class="upload-demo1"
                            :action="upload_qiniu_url"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleError"
                            :before-upload="beforeAvatarUpload"
                            :data="qiniuData">
                        <img v-if="addForm.iconUrl" :src="addForm.iconUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
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
                total: 0,
                page: 1,
                pageSize: 20,
                listLoading: false,
                sels: [],//列表选中列
                title: '',
                loanProductInfoList: [],

                //查看界面数据
                viewFormVisible: false,//详情界面是否显示
                viewForm: "",

                //编辑界面数据
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editForm: {
                    id: ''
                },
                editFormRules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '产品描述', trigger: 'blur'}
                    ],
                    explainLabel: [
                        {required: true, message: '产品说明', trigger: 'blur'}
                    ],
                    interestRate: [
                        {required: true, message: '贷款利率', trigger: 'blur'}
                    ],
                    interestRateType: [
                        {required: true, message: '利率类型', trigger: 'change'}
                    ],
                    applyCondition: [
                        {required: true, message: '申请条件', trigger: 'blur'}
                    ],
                    needDatum: [
                        {required: true, message: '所需资料', trigger: 'blur'}
                    ],
                    loanAmountScope: [
                        {required: true, message: '贷款金额范围', trigger: 'blur'}
                    ],
                    loanTimeScope: [
                        {required: true, message: '贷款期限范围', trigger: 'blur'}
                    ],
                    applyNum: [
                        {required: true, message: '申请人数', trigger: 'blur'}
                    ],
                    obtainTime: [
                        {required: true, message: '下款时间', trigger: 'blur'}
                    ]
                },

                //新增界面数据
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {
                    iconUrl: '',
                },
                addFormRules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '产品描述', trigger: 'blur'}
                    ],
                    explainLabel: [
                        {required: true, message: '产品说明', trigger: 'blur'}
                    ],
                    interestRate: [
                        {required: true, message: '贷款利率', trigger: 'blur'}
                    ],
                    interestRateType: [
                        {required: true, message: '利率类型', trigger: 'change'}
                    ],
                    applyCondition: [
                        {required: true, message: '申请条件', trigger: 'blur'}
                    ],
                    needDatum: [
                        {required: true, message: '所需资料', trigger: 'blur'}
                    ],
                    loanAmountScope: [
                        {required: true, message: '贷款金额范围', trigger: 'blur'}
                    ],
                    loanTimeScope: [
                        {required: true, message: '贷款期限范围', trigger: 'blur'}
                    ],
                    applyNum: [
                        {required: true, message: '申请人数', trigger: 'blur'}
                    ],
                    obtainTime: [
                        {required: true, message: '下款时间', trigger: 'blur'}
                    ]
                },
                qiniuData: {
                    key: "",
                    token: ""
                },
                // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
                upload_qiniu_url: "https://upload-z0.qiniup.com",
                // 七牛云返回储存图片的子域名
                upload_qiniu_addr: "http://poaj8rslu.bkt.clouddn.com/"
            }
        },

        methods: {
            //上传图片相关
            beforeAvatarUpload: function (file) {
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
            handleAvatarSuccess: function (res, file) {
                this.addForm.iconUrl = this.upload_qiniu_addr + res.key;
                console.log(this.addForm.iconUrl);
            },
            handleError: function (res) {
                this.$message({
                    message: "上传失败",
                    duration: 2000,
                    type: "warning"
                });
            },

            //获取上传token
            getUpLoadToken() {
                let para = {
                    bucketName: "app_package"
                };
                this.$http.post('http://localhost:8086/loanProduct/getUpLoadToken', para, {emulateJSON: true}).then(result => {
                    this.qiniuData.key = result.body.data.data.key;
                    this.qiniuData.token = result.body.data.data.token;
                })
            },

            //分页
            handleCurrentChange(val) {
                this.page = val;
                this.getProductList();
            },

            //获取产品列表
            getProductList() {
                let para = {
                    title: this.title,
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                this.$http.post('http://localhost:8086/loanProduct/getLoanProductList', para, {emulateJSON: true}).then(result => {
                    this.total = result.body.data.total;
                    this.loanProductInfoList = result.body.data.records;
                    this.listLoading = false;
                })

            },

            //显示详情界面
            handleView: function (index, row) {
                this.viewFormVisible = true;
                this.viewForm = Object.assign({}, row);
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.getUpLoadToken();
            },

            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            let json = JSON.stringify(para);
                            this.$http.post('http://localhost:8086/loanProduct/addLoanProduct', json, {emulateJSON: true}).then(result => {
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

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            let json = JSON.stringify(para);
                            this.$http.post('http://localhost:8086/loanProduct/updateLoanProduct', json, {emulateJSON: true}).then(result => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.editFormVisible = false;
                                this.getProductList();
                            })
                        });
                    }
                });
            },

            //隐藏
            handleHidden: function (index, row) {
                this.$confirm('确认隐藏该产品吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.addLoading = true;
                    let para = {productId: row.id, isHide: 1};
                    this.$http.post('http://localhost:8086/loanProduct/hiddenProduct', para, {emulateJSON: true}).then(result => {
                        this.addLoading = false;
                        this.$message({
                            message: '隐藏成功',
                            type: 'success'
                        });
                        this.addFormVisible = false;
                        this.getProductList();
                    })
                }).catch(() => {

                });
            },
        },
        mounted() {
            this.getProductList();
        }
    }

</script>

<style scoped>

</style>