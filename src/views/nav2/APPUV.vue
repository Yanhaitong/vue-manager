<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="时间">
                    <el-date-picker
                            v-model="filters.name"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="客户端" prop="client">
                    <el-select v-model="filters.client" clearable placeholder="请选择客户端">
                        <el-option v-for="item in client" :label="item.clientName" :value="item.clientName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select v-model="filters.channel" clearable placeholder="请选择渠道">
                        <el-option v-for="item in channel" :label="item.channelName" :value="item.channelName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getAPPUVInfo">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="appUVList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column prop="dataTime" label="日期">
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
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
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                filters: {
                    name: '',
                    client: '',
                    channel: ''
                },
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
                this.getAPPUVInfo();
            },

            //获取APPUV点击列表
            getAPPUVInfo() {
                let para = {
                    clientName: this.filters.client,
                    channelName: this.filters.channel,
                    startTime: this.formatDateTime(this.filters.name[0]),
                    endTime: this.formatDateTime(this.filters.name[1]),
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                this.$http.post('http://localhost:8086/statistics/getAPPUVInfo', para, {emulateJSON: true}).then(result => {
                    this.total = result.body.data.total;
                    this.appUVList = result.body.data.records;
                    this.listLoading = false;
                })
            },

            //获取客户端列表（条件查询使用）
            getAllClients() {
                this.$http.post('http://localhost:8086/clientManager/getAllClients', null, {emulateJSON: true}).then(result => {
                    this.client = result.body.data;
                })
            },

            //获取渠道列表（条件查询使用）
            getAllChannels() {
                this.$http.post('http://localhost:8086/channelManager/getAllChannels', null, {emulateJSON: true}).then(result => {
                    this.channel = result.body.data;
                })
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            formatDateTime: function (date) {
                if (date) {
                    var y = date.getFullYear();
                    var m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    var d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    return y + '-' + m + '-' + d;
                } else {
                    return null;
                }
            }

        },
        mounted() {
            this.getAPPUVInfo();
            this.getAllClients();
            this.getAllChannels();
        }
    }

</script>

<style scoped>

</style>