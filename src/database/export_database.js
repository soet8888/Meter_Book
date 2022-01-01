import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, StyleSheet, ToastAndroid } from 'react-native';
import XLSX from 'xlsx';
import { getAllCustomer, getAllGroup, getMerterRecords, getCustomerGroup } from "../helpers/sqlite_service";
import { ExcelFileNames } from "../constants/excel_file_names";
var RNFS = require('react-native-fs');

const App = () => {
    const [loading, setLoading] = useState(false);
    const exportDataToExcel = async (exportType) => {
        let filename = null, data = [];
        setLoading(false);
        if (exportType === 'users') {
            filename = ExcelFileNames.users;
            const res = await getAllCustomer();
            if (res.success) {
                data = res.data;
            }
        }
        if (exportType === "meters") {
            filename = ExcelFileNames.meterRecords;
            const res = await getMerterRecords();
            if (res.success) {
                data = res.data;
            }
        }
        if (exportType === "groups") {
            filename = ExcelFileNames.groups;
            const res = await getAllGroup();
            if (res.success) {
                data = res.data;
            }
        }
        if (exportType === "usergroups") {
            filename = ExcelFileNames.userGroups;
            const res = await getCustomerGroup();
            if (res.success) {
                data = res.data;
            }
        }
        if (filename && data && data.length > 0) {
            //   let sample_data_to_export = [{ id: '1', name: 'First User' }, { id: '2', name: 'Second User' }];
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(data)
            XLSX.utils.book_append_sheet(wb, ws, exportType)
            const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
            let msg = `success export ${exportType}`;
            // Write generated excel to Storage
            RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${filename}`, wbout, 'ascii').then((r) => {
                console.log('Success');
            }).catch((e) => {
                console.log('Error 2222', e);
                msg = `failed export ${exportType}`;
            });
            ToastAndroid.showWithGravity(
                msg,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
        setLoading(false);
    }
    const handleClick = async (exportType) => {

        try {
            // Check for Permission (check if permission is already given or not)
            let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

            if (!isPermitedExternalStorage) {

                // Ask for permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "Storage permission needed",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );


                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission Granted (calling our exportDataToExcel function)
                    exportDataToExcel(exportType);
                    console.log("Permission granted");
                } else {
                    // Permission denied
                    console.log("Permission denied");
                }
            } else {
                // Already have Permission (calling our exportDataToExcel function)
                exportDataToExcel(exportType);
            }
        } catch (e) {
            console.log('Error while checking permission');
            console.log(e);
            return
        }

    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleClick('users')}
                style={[styles.item, { color: (loading === true) && styles.itemLoading.color }]}
                disabled={loading}
            >
                <Text style={styles.itemText}>
                    Export Users
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleClick('meters')}
                style={styles.item}
                disabled={loading}
            >
                <Text style={styles.itemText}>
                    Export Meters
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleClick('groups')}
                style={styles.item}
                disabled={loading}
            >
                <Text style={styles.itemText}>
                    Export Groups
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleClick('usergroups')}
                style={styles.item}
                disabled={loading}
            >
                <Text style={styles.itemText}>
                    Export User Groups
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    item: {
        width: '50%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 7,
        backgroundColor: '#0373fc',
        marginVertical: 20,
    },
    itemLoading: {
        color: '#6a85a1',
    },
    itemText: {
        textAlign: 'center', color: 'white'
    }
})
export default App;