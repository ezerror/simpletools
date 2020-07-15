import th from "element-ui/src/locale/lang/th";

const mysql = require('mysql'); // mysql node driver
class Db {
    constructor(pool, config) {
        this.pool = pool;
        this.config = config;
    }

    createPool(config) {
        this.config = config;
        this.pool = mysql.createPool({
            connectionLimit: 10,    // 连接数量
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
        })
    }

    queryTableName() {
        console.log(operate.queryTableName(this))
        return operate.queryTableName(this);
    }

    getThis() {
        return this;
    }

}

const operate = {


    queryTableName(that) {
        console.log(that)
        let result;
        const pool = that.pool;
        pool.query('select * from INFORMATION_SCHEMA.TABLES', function (err, results, fields) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(results)
            result = results;
            return results
        });
        return result;
    }

}

export {
    Db, operate
}