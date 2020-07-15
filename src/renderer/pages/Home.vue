<template>
    <div class="tabs">
        <el-tabs  v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="JSON格式化" name="json-beautiful">
                <json-beautiful></json-beautiful>
            </el-tab-pane>
            <el-tab-pane label="数据库比对" name="db-diff">
                <db-diff></db-diff>
            </el-tab-pane>
            <el-tab-pane label="Sql拼接" name="sql-builder"> <sql-builder></sql-builder></el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
</el-tabs>
    </div>
</template>

<script>
import jsonBeautiful from '@/pages/tabs/json-beautiful'
import dbDiff from  '@/pages/tabs/db-diff'
import sqlBuilder from  '@/pages/tabs/sql-builder'
export default {
    name: 'tabs',
    components:{
        jsonBeautiful:jsonBeautiful,
        dbDiff:dbDiff,
        sqlBuilder:sqlBuilder
    },
    data() {
        return {
            activeName: "sql-builder"
        }
    },
    methods: {
      handleClick(tab, event) {
        this.activeName=tab.name;
      }
    }
}
</script>