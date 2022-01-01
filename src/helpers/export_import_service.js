import { stat } from "react-native-fs";
import { DB } from "./sqlite_service";
//[{"address": "မကွေးမြို့", "id": 1, "meter": 96784, "name": "ဦးကျော်စွာမင်း", "phone": "096585234"}]
export const setCustomerMany = async (data = []) => {
    try {
        const db = await DB;
        let querys = [];
        for (const customer of data) {
            const _q = `INSERT OR Replace INTO customers(id,name,phone,meter,address) VALUES(?,?,?,?,?)`;
            const { id, name, phone, address, meter } = customer;
            const params = [id, name, phone || '', meter, address || ''];
            querys.push(db.executeSql(_q, params));
        }
        await Promise.all([...querys]);
    } catch (error) {
        console.error(error)
        return { success: false }
    }
    return { success: true }
}
//[{"id": 1, "name": "တောင်‌ပိုင်း အရှေ့ ကွက်သစ်", "totalCount": 4, "updateAt": "2021-12-29 07:21:31"}]
export const setGroupMany = async (data = []) => {
    try {
        const db = await DB;
        let querys = [];
        for (const group of data) {
            const _q = `INSERT OR Replace INTO groups(id,name) VALUES(?,?)`;
            const { id, name } = group;
            const params = [id, name];
            querys.push(db.executeSql(_q, params));
        }
        await Promise.all([...querys]);
    } catch (error) {
        console.error(error)
        return { success: false }
    }
    return { success: true }
}

//[{"customerId": 1, "groupId": 1, "id": 1, "updateAt": "2021-12-29 07:26:08"}]
export const setCustomerGroupMany = async (data = []) => {
    try {
        const db = await DB;
        let querys = [];
        for (const cg of data) {
            const _q = `INSERT OR Replace INTO customerGroup(customerId,groupId) VALUES(?,?)`;
            const { customerId, groupId } = cg;
            const params = [customerId, groupId];
            querys.push(db.executeSql(_q, params));
        }
        await Promise.all([...querys]);
    } catch (error) {
        console.error(error)
        return { success: false }
    }
    return { success: true }
}

//[{"createdAt": 1640764945207, "customerId": 1, "id": 9, "meter": 4, "name": "ဦးကျော်စွာမင်း", "payAmount": 4000, "phone": "096585234", "status": "paid", "totalAmount": 4000, "updateAt": "2021-12-29 08:02:25"}]
export const setMeterRecordMany = async (data = []) => {
    try {
        const db = await DB;
        let querys = [];
        for (const record of data) {
            const _q = `INSERT OR Replace INTO meterRecords(id,customerId,totalAmount,payAmount,status,meter,createdAt) VALUES(?,?,?,?,?,?,?)`;
            const { id, customerId, totalAmount, payAmount, status, meter, createdAt } = record;
            const params = [id, customerId, totalAmount, payAmount, status, meter, createdAt];
            querys.push(db.executeSql(_q, params));
        }
        await Promise.all([...querys]);
    } catch (error) {
        console.error(error)
        return { success: false }
    }
    return { success: true }
}
