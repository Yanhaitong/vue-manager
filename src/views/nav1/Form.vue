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
            <el-form :model="viewForm" label-width="80px" :rules="viewFormRules" ref="viewForm">
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
                    <el-radio-group v-model="viewForm.interestRateType"  disabled="true">
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
                <el-form-item label="图标地址" prop="iconUrl">
                    <el-input v-model="editForm.iconUrl" style="width: 80%;"></el-input>
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
                <el-form-item label="图标地址" prop="iconUrl">
                    <el-input v-model="addForm.iconUrl" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
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
                listLoading: false,
                sels: [],//列表选中列

                //查看界面数据
                viewFormVisible: false,//详情界面是否显示
                viewForm: "",

                //编辑界面数据
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editForm: {},
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
                    ],
                    iconUrl: [
                        {required: true, message: '图标地址', trigger: 'blur'}
                    ]
                },

                //新增界面数据
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addForm: {},
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
                    ],
                    iconUrl: [
                        {required: true, message: '图标地址', trigger: 'blur'}
                    ]
                }

            }
        },
        methods: {
            //分页
            handleCurrentChange(val) {
                this.page = val;
                this.getProductList();
            },

            //获取产品列表
            getProductList() {
                let para = {
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                this.$http.post('http://localhost:8086/loanProduct/getLoanProductInfoList', para, {emulateJSON: true}).then(result => {
                    this.total = result.body.data.total;
                    this.users = result.body.data.records;
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
            },

            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            this.$http.post('http://localhost:8086/sysManager/addLoanProduct', para, {emulateJSON: true}).then(result => {
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
                            this.$http.post('http://localhost:8086/sysManager/updateLoanProduct', para, {emulateJSON: true}).then(result => {
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

            //隐藏
            handleHidden: function (index, row) {
                this.$confirm('确认隐藏该产品吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {productId: row.id, isHide: 1};
                    this.$http.post('http://localhost:8086/sysManager/hiddenOrShowProduct', para, {emulateJSON: true}).then(result => {
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


            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getProductList();
        }
    }

</script>

<style scoped>

</style>