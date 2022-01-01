import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);
export const DB = SQLite.openDatabase({ location: 'default', name: 'MeterData.db', })
const query = {
    sqlMaster: "select * from sqlite_master",
    foreignKey: "PRAGMA foreign_keys = ON",
    UTF8: "PRAGMA encoding=\"UTF-8\"",
    users: "select * from  users",
    deleteUserTable: "drop table users",
    deleteLanguageTable: "drop table languages",
    deleteCustomerTable: "drop table customers",
    deleteMeterRecordTable: "drop table meterRecords",
    deleteCustomerGroupTable: "drop table customerGroup",
    deleteGroupTable: "drop table groups",
    languageTable: "CREATE TABLE IF NOT EXISTS languages (id INTEGER PRIMARY KEY AUTOINCREMENT, code varchar(225))",
    groupTable: "CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(225), updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    customerGroupTable: "CREATE TABLE IF NOT EXISTS customerGroup (id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER not null,groupId INTEGER not null, updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,UNIQUE(customerId,groupId))",
    userTable: "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), password VARCHAR(255),status VARCHAR(255), address VARCHAR(255))",
    customerTable: "CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(225) NOT NULL, phone VARCHAR(255) ,meter INTEGER NOT NULL UNIQUE, address VARCHAR(255))",
    meterRecordTable: "CREATE TABLE IF NOT EXISTS meterRecords(id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER,totalAmount INTEGER default 0, payAmount INTEGER default 0,status VARCHAR(50), meter INTEGER default 0,createdAt INTEGER not null, updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (customerId) REFERENCES customers (id))",
    setUser: "INSERT OR Replace INTO users  VALUES (?,?,?,?,?)",
    insertUser: "INSERT INTO users VALUES(?,?,?,?)"
}
const consoleResult = (results = []) => {
    console.log("result", results)
    var len = results.rows.length;
    for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        console.log('row', row);
    };
}
export const InitializeDB = async (cb) => {
    try {
        const db = await DB;
        await db.executeSql(query.foreignKey, []);
        await db.executeSql(query.UTF8, []);
        await db.executeSql(query.userTable, []);
        await db.executeSql(query.customerTable, []);
        await db.executeSql(query.groupTable, []);
        //  await db.executeSql(query.deleteLanguageTable, []);
        await db.executeSql(query.languageTable, []);
        await db.executeSql(query.customerGroupTable, []);
        await db.executeSql(query.meterRecordTable);
        const [{ rows }] = await db.executeSql(query.users, []);
        if (rows.length === 0) {
            await db.executeSql(query.setUser, [1, 'admin', '123456', 'logout', "Magway,Pahtoe Village ဦးဇော်အောင်"]);
        }
        if (cb) cb(true);
    } catch (error) {
        console.error(error);
        if (cb) cb(false)
    }
}
export const getSqlMater = async (cb) => {
    try {
        const db = await DB;
        const [{ rows }] = await db.executeSql(query.sqlMaster, []);
        let customers = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            customers.push(row)
        };
        return { success: true, data: customers }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const checkAuth = (name, password, cb) => {
    DB.then(db => {
        db.transaction(tx => {
            tx.executeSql(query.users, []).then(([tx, results]) => {
                let user = { name: null, password: null, status: null, address: null };
                if (results.rows.length > 0) {
                    const data = results.rows.item(0);
                    user.name = data.name;
                    user.password = data.password;
                    user.status = data.status;
                    user.address = data.address;
                }
                if (user.status && user.status === "loggedIn") {
                    if (cb) cb({ success: true, user });
                } else if ((name && name === user.name) && (password && password === user.password)) {
                    if (cb) cb({ success: true, user });
                } else {
                    if (cb) cb({ success: false, user });
                }
            }).catch(err => {
                if (cb) cb({ success: false, message: err });
            });
        }).catch(err => {
            if (cb) cb({ success: false, message: err });
        })
    })
}
export const setAuthStatus = (status, cb) => {
    DB.then(db => {
        db.transaction(tx => {
            tx.executeSql(query.setUser, [1, 'admin', '123456', status, "Magway,Pahtoe Village ဦးဇော်အောင်"]);
            if (cb) cb(true);
        }).then((result) => {
            // if (db) db.close();
        }).catch((err) => {
            if (cb) cb(false)
            console.log(err);
        });
    }).catch(error => {
        if (cb) cb(false)
        console.error(error);
    })
};
//name,phone,meter,address/
export const insertCustomer = async (customer) => {
    try {
        const { name, phone, meter, address } = customer;
        const db = await DB;
        const _q = `INSERT INTO customers(name,phone,meter,address) VALUES(?,?,?,?)`;
        await db.executeSql(_q, [name, phone, meter, address]);
    } catch (error) {
        console.error(error);
        return { success: false }
    }

    return { success: true };
}
export const getAllCustomer = async () => {
    try {
        const db = await DB;
        const _q = `select * from customers`;
        const [{ rows }] = await db.executeSql(_q, []);
        let customers = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            customers.push(row)
        };
        return { success: true, data: customers }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
// customerId,totalAmount,payAmount,status,meter,createdAt

export const insertMeterRecord = async ({ customerId, totalAmount, payAmount, status, meter, createdAt }) => {

    try {
        const db = await DB;
        const _q = `INSERT INTO meterRecords(customerId,totalAmount,payAmount,status,meter,createdAt) VALUES(?,?,?,?,?,?)`;
        await db.executeSql(_q, [customerId, totalAmount, payAmount, status, meter, createdAt]);
        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const updateMeterStatus = async ({ status, id }) => {

    try {
        const db = await DB;
        const _q = `update meterRecords set status=? where id=?`;
        await db.executeSql(_q, [status, id]);
        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const getMerterRecords = async () => {
    try {
        const db = await DB;
        const _q2 = ` select mr.*,c.name,c.phone  from  meterRecords mr inner join customers c on c.id=mr.customerId order by createdAt desc limit 500 `
        const [{ rows }] = await db.executeSql(_q2, []);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: true, data: records }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const getRemainMerterRecords = async () => {
    try {
        const db = await DB;
        const _q2 = ` select mr.*,c.name,c.phone  from  meterRecords mr inner join customers c on c.id=mr.customerId where mr.status=? order by createdAt desc limit 500 `
        const [{ rows }] = await db.executeSql(_q2, ['remain']);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: true, data: records }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const getUserMerterRecords = async (id) => {
    try {
        const db = await DB;
        const _q2 = ` select mr.*,c.name,c.phone  from  meterRecords mr inner join customers c on c.id=mr.customerId where mr.customerId=${id} order by createdAt desc limit 100 `
        const [{ rows }] = await db.executeSql(_q2, []);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: true, data: records }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const getDashboard = async (id) => {
    try {
        const db = await DB;
        const _q1 = `select sum(totalAmount)as totalAmount,sum(payAmount) as totalPayAmount from meterRecords where status=?`;
        const results1 = await db.executeSql(_q1, ['remain']);
        const _row1 = results1[0].rows;
        let records1 = [];
        for (let k = 0; k < _row1.length; k++) {
            const row = _row1.item(k);
            records1.push(row)
        };
        const _q2 = `select sum(totalAmount)as totalAmount,sum(meter) as totalMeter,(select count(*) from customers) as totalUser from meterRecords where status=?`;
        const results = await db.executeSql(_q2, ['paid']);
        const _row2 = results[0].rows;
        let records2 = [];
        for (let k = 0; k < _row2.length; k++) {
            const row = _row2.item(k);
            records2.push(row)
        };
        const _q3 = `select c.*,(select max(createdAt) from meterRecords mmr where mmr.customerId=c.id) as lastActiveAt,(select sum(meter) from meterRecords mmr where mmr.customerId=c.id and mmr.status=?) as totalMeter,(select sum(totalAmount) from meterRecords mmr where mmr.customerId=c.id and mmr.status=?) as totalAmount from customers c where (select avg(meter) from meterRecords mrr where mrr.status=?) < (select sum(meter) from meterRecords mr where mr.customerId=c.id and mr.status=?) order by totalMeter desc `;
        const [{ rows }] = await db.executeSql(_q3, ['paid', 'paid', 'paid', 'paid']);
        let records3 = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records3.push(row)
        };
        return { success: true, summary: records2, topUser: records3, credit: records1 }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const truncateMeterRecord = async (id) => {
    try {
        const db = await DB;
        await db.executeSql(query.deleteMeterRecordTable, []);
        await db.executeSql(query.foreignKey, []);
        await db.executeSql(query.meterRecordTable, []);
        return { success: true, }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export const truncateUser = async (id) => {
    try {
        const db = await DB;
        await db.executeSql(query.deleteCustomerTable, []);
        await db.executeSql(query.customerTable, []);
        return { success: true, }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export const truncateUserAndMeterRecord = async (id) => {
    try {
        const db = await DB;
        await db.executeSql(query.deleteGroupTable, []);
        await db.executeSql(query.deleteCustomerTable, []);
        await db.executeSql(query.deleteMeterRecordTable, []);
        await db.executeSql(query.deleteCustomerGroupTable, []);
        await db.executeSql(query.foreignKey, []);
        await db.executeSql(query.groupTable, []);
        await db.executeSql(query.meterRecordTable, []);
        await db.executeSql(query.customerTable, []);
        await db.executeSql(query.customerGroupTable, []);
        return { success: true, }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}
export const getMonthlySummary = async () => {
    try {
        const db = await DB;
        const _q2 = ` select sum(totalAmount) totalAmount,sum(meter) totalMeter, strftime('%Y-%m', createdAt / 1000, 'unixepoch') yearMonth from meterRecords  where status=? group by yearMonth order by yearMonth desc`
        const [{ rows }] = await db.executeSql(_q2, ['paid']);
        let paidSummary = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            paidSummary.push(row)
        };
        const _q3 = `select sum(totalAmount) totalAmount,sum(meter) totalMeter,sum(payAmount) totalPayAmount , strftime('%Y-%m', createdAt / 1000, 'unixepoch') yearMonth from meterRecords  where status=? group by yearMonth order by yearMonth desc`;
        const result3 = await db.executeSql(_q3, ['remain']);
        const _row3 = result3[0].rows;
        let creditSummary = [];
        for (let i = 0; i < _row3.length; i++) {
            const row = _row3.item(i);
            creditSummary.push(row);
        };
        return { success: true, paidSummary, creditSummary }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export const insertGroup = async (name) => {
    try {
        const db = await DB;
        const _q1 = `INSERT INTO groups(name) VALUES(?)`;
        await db.executeSql(_q1, [name]);
    } catch (error) {
        console.error(error);
        return { success: false }
    }

    return { success: true };
}
export const getAllGroup = async () => {
    try {
        const db = await DB;
        const _q1 = `select gp.*,(select count(*) from customerGroup cg where cg.groupId=gp.id) as totalCount from groups gp`;
        const [{ rows }] = await db.executeSql(_q1, []);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: true, data: records };
    } catch (error) {
        console.error(error);
        return { success: false }
    }
}
export const getUserGroups = async (userId) => {
    try {
        const db = await DB;
        const _q1 = `select * from customerGroup cg where cg.customerId=?`;
        const [{ rows }] = await db.executeSql(_q1, [userId]);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: true, data: records };
    } catch (error) {
        console.error(error);
        return { success: false }
    }
}
export const getGroupUsers = async (id) => {
    try {

        const db = await DB;
        const qq = `select gp.*, cc.id userId, cc.name userName, cc.meter userMeter, cc.address userAddress, cc.phone userPhone from customerGroup gp inner join customers cc on cc.id = gp.customerId where gp.groupId =?`
        const [{ rows }] = await db.executeSql(qq, [id]);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        //const gps = records.reduce((obj, cur) => ({ ...obj, [curl.]: cur }), {})
        return { success: true, data: records };
    } catch (error) {
        console.error(error);
        return { success: false }
    }

}
export const insertCustomerGroup = async (customerId, groupId) => {
    try {
        const db = await DB;
        const _q2 = `INSERT INTO customerGroup(customerId,groupId) VALUES(?,?)`;
        await db.executeSql(_q2, [customerId, groupId])
    } catch (error) {
        console.error(error);
        return { success: false }
    }
    return { success: true };
}
export const getCustomerGroup = async () => {
    try {
        const db = await DB;
        const _q2 = ` select * from customerGroup`;
        const [{ rows }] = await db.executeSql(_q2, []);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: true, data: records }
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export const setLanguageCode = async (code) => {
    try {
        const db = await DB;
        const _q1 = `INSERT OR Replace INTO languages  VALUES (?,?)`;
        await db.executeSql(_q1, [1, code]);
    } catch (error) {
        console.error(error);
        return { success: false }
    }

    return { success: true };
}


export const getLanguageCode = async () => {
    try {
        const db = await DB;
        const _q1 = `select * from languages`;
        const [{ rows }] = await db.executeSql(_q1, []);
        let records = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            records.push(row)
        };
        return { success: records.length === 1, data: records.length === 1 ? records[0] : null };
    } catch (error) {
        console.error(error);
        return { success: false }
    }

}