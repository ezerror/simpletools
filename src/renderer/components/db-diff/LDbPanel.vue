<template>
    <el-row >
        <el-row class="dbForm">
            <el-form :model="lformData" ref="lform" label-width="100px">
                <el-form-item label="连接地址" prop="host">
                    <el-input v-model="lformData.host"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="lformData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="lformData.password"></el-input>
                </el-form-item>
                <el-form-item label="数据库名" prop="database">
                    <el-input v-model="lformData.database"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTables('lform')">连接</el-button>
                    <el-button @click="resetForm('lform')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table
                    :data="ltableData"
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="TABLE_NAME"
                        label="表名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="CREATE_TIME"
                        label="创建日期"
                        width="auto"
                        :formatter="formatDate">
                </el-table-column>
            </el-table>
        </el-row>
    </el-row>
</template>

<script>
    import {db} from '../../utils/sad'

    let that;
    export default {
        name: "LDbPanel",
        beforeCreate: function () {
            that = this;
        },
        data() {
            return {
                lformData: {
                    host: 'localhost',
                    username: 'root',
                    password: 'shiyuan',
                    database: 'springboot'
                },
                ltableData: [],
                lmultipleSelection: [],
            }
        },
        methods: {
            getTables(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const lformData = this.$refs[formName].model;
                        const config = {
                            database: lformData.database,
                            host: lformData.host,
                            user: lformData.username,
                            password: lformData.password
                        };
                        console.log(config)
                        const dbPool = db.createPool(config);
                        dbPool.query('select * from INFORMATION_SCHEMA.TABLES where table_schema = ' + "'" + config.database + "'", function (err, results, fields) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            that.ltableData = results;
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //方法区
            formatDate(row, column) {
                // 获取单元格数据
                let data = row[column.property]
                if (data == null) {
                    return null
                }
                let dt = new Date(data)
                return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
            }
        },
        mounted: function () {

        }
    }
</script>

<style scoped>

</style>