<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="name" label="日期">
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column prop="registerCount" label="app注册数">
            </el-table-column>
            <el-table-column prop="loginCount" label="app登录数">
            </el-table-column>
            <el-table-column prop="clickUVCount" label="app点击UV">
            </el-table-column>
        </el-table>

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