<template>
    <el-row class="container" :style="defaultHeight">
        <el-alert
            title="该TAB功能已暂停开发！"
            type="error">
        </el-alert>
        <el-row class="content">
            <el-col :span="12" class="item">
                <el-row class="dbHeader">
                    <div class="toolItem old">
                        <i class="iconfont icon-database"></i>
                        原始库
                    </div>
                </el-row>
                <l-db-panel ref="leftData"></l-db-panel>
                <el-button @click="getLeftData()">重置</el-button>
            </el-col>
            <el-col :span="12" class="item">
                <el-row class="dbHeader">
                    <div class="toolItem new">
                        <i class="iconfont icon-database"></i>
                        更新库
                    </div>
                </el-row>
                <r-db-panel></r-db-panel>
            </el-col>
        </el-row>
    </el-row>
</template>
<script>
    import {db} from '../../utils/sad'
    import LDbPanel from '../../components/db-diff/LDbPanel'
    import RDbPanel from '../../components/db-diff/RDbPanel'
    let that;
    export default {
        name: 'db-diff',
        components: {
            LDbPanel,RDbPanel
        },
        computed: {},
        watch: {},
        beforeCreate: function () {
            that = this;
        },
        created() {
            //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
            window.addEventListener("resize", this.getHeight);
            this.getHeight();
        },
        data() {
            return {
                oldDbForm: {
                    host: 'localhost',
                    username: 'root',
                    password: 'shiyuan',
                    database: 'springboot'
                },
                oldTableData: [],
                multipleSelection: [],
                defaultHeight: {
                    height: ""
                }
            }
        },
        methods: {
            getHeight() {
                this.defaultHeight.height = window.innerHeight - 75 + "px";
            },
            getOldTables(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const formData=this.$refs[formName].model;
                        const config  = {
                            database : formData.database,
                            host : formData.host,
                            user : formData.username,
                            password : formData.password
                        };
                        const dbPool =db.createPool(config);
                        dbPool.query('select * from INFORMATION_SCHEMA.TABLES where table_schema = '+ "'"+config.database+"'", function (err, results, fields) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            that.oldTableData = results
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
                if(data == null) {
                    return null
                }
                let dt = new Date(data)
                return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
            },
            getLeftData(){
                console.log(this.$refs.leftData.$data.ltableData);
            }
        },
        mounted: function () {

        }
    }
</script>
<style lang="scss">
    .container {
        width: 100vw;
        height: 90vh;
        overflow: auto;
        box-sizing: border-box;
        background: #fff;
        color: #4A5560;
        font-size: 12px;
        font-family: menlo, monospace, Tahoma, "微软雅黑", "幼圆";

        &::-webkit-scrollbar {
            display: none;
        }

        .header {
            line-height: 50px;
            border-bottom: solid 1px #E5EBEE;
            padding: 0 15px;

            .logo {
                color: #0fd59d;
                font-size: 20px;
            }

            .link {
                display: flex;
                justify-content: flex-end;
                padding: 0 20px;

                .item {
                    cursor: pointer;
                    color: #4A5560;
                    font-weight: bold;
                }
            }
        }

        .content {
            height: calc(100% - 50px);
            overflow: auto;

            .item {
                height: 100%;
                overflow: auto;
                box-sizing: border-box;
                position: relative;

                &:last-child {
                    border-left: solid 1px #E5EBEE;
                }

                .dbHeader {
                    height: 40px;
                    padding: 10px;
                    box-sizing: border-box;
                    border-bottom: solid 1px #eee;
                    background-color: #fff;
                    font-size: 12px;
                    color: #999;
                    display: flex;

                    .toolItem {
                        padding: 0 20px;
                        position: relative;
                    }

                    .old {
                        color: #15b374;
                    }

                    .new {
                        color: #4e58df;
                    }
                }

                .dbForm {
                    margin: 40px auto; /* 上下间距160px，左右自动居中*/

                }

            }
        }

    }
</style>
