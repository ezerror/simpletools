<template>
    <el-row class="container" :style="defaultHeight">
        <el-row class="sql-content">
            <el-col class="item">
                <el-row class="sqlHandle">
                    <div class="toolItem" @click="formatSql" effect="dark" content="格式化" placement="top">
                        <i class="iconfont icon-database"></i>
                        <transition name="el-fade-in">
                            <div class="tooltips">格式化</div>
                        </transition>
                    </div>
                    <div class="toolItem" @click="generate" effect="dark"
                         content="生成" placement="top">
                        <i class="iconfont icon-file-excel-o"></i>
                        <transition name="el-fade-in">
                            <div class="tooltips">生成</div>
                        </transition>
                    </div>
                    <div class="toolItem" @click="clear">
                        <i class="iconfont icon-trash-o"></i>
                        <transition name="el-fade-in">
                            <div class="tooltips">清空</div>
                        </transition>
                    </div>
                    <div class="toolItem" @click="dowload">
                        <i class="iconfont icon-cloud-download"></i>
                        <transition name="el-fade-in">
                            <div class="tooltips">另存为</div>
                        </transition>
                    </div>
                    <div @click="copyValue" class="toolItem">
                        <i class="iconfont icon-copy"></i>
                        <transition name="el-fade-in">
                            <div class="tooltips">复制</div>
                        </transition>
                    </div>
                    <div class="toolItem" :class="{'active':isKeyUpper}" @click="isKeyUpper = !isKeyUpper" effect="dark"
                         content="转XML" placement="top">
                        是否关键字大写
                    </div>
                    <div class="toolItem" :class="{'active':isUpper}" @click="isUpper = !isUpper" effect="dark"
                         content="转XML" placement="top">
                        是否大写
                    </div>
                </el-row>
                <el-input resize="none" type="textarea" v-model="inputData" class="upTextarea"
                          placeholder="在此输入Sql语句"></el-input>
            </el-col>
        </el-row>
        <br>
        <el-row class="sql-content">
            <el-col class="item">
                <el-input resize="none" type="textarea" v-model="outputData" class="downTextarea"></el-input>
            </el-col>
        </el-row>
    </el-row>
</template>
<script>

    // import VueJsonPretty from 'vue-json-pretty'
    import VueJsonPretty from '../../components/json-beautiful/app'
    import {formatSql,generate} from '../../utils/Utils'
    import sqlFormatter from 'sql-formatter'
    let fs = require('fs');
    export default {
        name: 'sql-builder',
        components: {
            VueJsonPretty
        },
        created() {
            //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
            window.addEventListener("resize", this.getHeight);
            this.getHeight();
        },
        data() {
            return {
                checkList: ['关键字大写', '语句大写'],
                show: false,
                json: {},
                inputData: '',
                outputData: '',
                transformError: false,
                isUpper: true,//
                isKeyUpper: true,
                showXml: false,
                defaultHeight: {
                    height: ""
                }
            }
        },
        methods: {
            formatSql() {
                this.inputData = formatSql(this.inputData, this.isUpper, this.isKeyUpper);
                // this.inputData = sqlFormatter.format(this.inputData)
            },
            generate(){
                let res =generate(this.inputData);
                this.outputData = res;

            },
            getHeight() {
                this.defaultHeight.height = window.innerHeight - 75 + "px";
            },
            clear() {
                this.inputData = '';
            },
            copyValue() {
                if (this.showMini) {
                    this.$electron.clipboard.writeText(this.miniData);
                } else if (this.showXml) {
                    this.$electron.clipboard.writeText(this.xmlData);
                } else {
                    this.$electron.clipboard.writeText(JSON.stringify(this.json, '', '\t'));
                }
                this.$message('复制成功');
            },
            dowload() {
                this.$electron.remote.dialog.showSaveDialog({
                    title: '文件另存为',
                    defaultPath: 'data.json'
                }, filePath => {
                    if (filePath) {
                        fs.writeFileSync(filePath, JSON.stringify(this.json, '', '\t'));
                        this.$message('保存成功');
                    }
                });
            }
        },
        mounted: function () {
            if (this.$cache.get('jsonData')) {
                this.json = this.$cache.get('jsonData').json;
                this.inputData = this.$cache.get('jsonData').inputData;
            }
        }
    }
</script>
<style lang="scss">
    .container {
        width: 100vw;
        height: auto;
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

        .sql-content {
            height: calc(49%);
            overflow: auto;

            .item {
                height: 100%;
                overflow: auto;
                box-sizing: border-box;
                position: relative;

                &:last-child {
                    border-left: solid 1px #E5EBEE;
                }

                .upTextarea {
                    width: 100%;
                    height: 80%;

                    .el-textarea__inner {
                        height: 100%;
                        box-sizing: border-box;
                        border: 1px solid black;

                        &:focus {
                            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
                        }
                    }
                }

                .downTextarea {
                    width: 100%;
                    height: 95%;

                    .el-textarea__inner {
                        height: 100%;
                        box-sizing: border-box;
                        border: 1px solid black;

                        &:focus {
                            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
                        }
                    }
                }

                .sqlHandle {
                    height: 50px;
                    padding: 10px;
                    box-sizing: border-box;
                    border-bottom: solid 1px #eee;
                    background-color: #fff;
                    font-size: 12px;
                    color: #999;
                    display: flex;

                    .toolItem {
                        padding: 0 20px;
                        cursor: pointer;
                        position: relative;

                        .tooltips {
                            position: absolute;
                            line-height: 20px;
                            // padding: 0 10px;
                            border-radius: 4px;
                            background: #000;
                            color: #fff;
                            box-sizing: border-box;
                            min-width: 40px;
                            text-align: center;
                            top: 23px;
                            left: 50%;
                            transform: translateX(-50%);
                            display: none;
                            transition: all .3s cubic-bezier(.55, 0, .1, 1);

                            &::after {
                                content: '';
                                border-width: 0 5px 5px;
                                border-style: solid;
                                border-color: transparent transparent #000; /*透明 透明  黄*/
                                width: 0;
                                height: 0;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                top: -5px;
                            }
                        }

                        &.active {
                            color: #15b374;
                        }

                        &:hover {
                            color: #15b374;

                            .tooltips {
                                display: block;
                            }
                        }
                    }
                }

                .jsonContent {
                    height: calc(100% - 40px);
                    overflow: auto;
                    box-sizing: border-box;
                    padding: 10px;

                    .error {
                        color: #f1592a;
                        font-weight: bold;
                        font-size: 12px;
                        white-space: pre-line;
                        padding: 0 20px;
                    }
                }

                .vjs-key {
                    color: #92278f;
                    font-weight: bold;
                }

                .vjs-tree {
                    font-size: 12px;

                    .vjs-tree__content {
                        padding-left: 2em;

                        div {
                            line-height: 2em;
                        }
                    }
                }
            }
        }

    }
</style>
