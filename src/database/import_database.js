import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    ToastAndroid
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
var RNFS = require('react-native-fs');
import { ExcelFileNames } from "../constants/excel_file_names";
import Entypo from 'react-native-vector-icons/Entypo';
import { chunk } from "../utils";
import { setCustomerMany, setGroupMany, setCustomerGroupMany, setMeterRecordMany } from "../helpers/export_import_service";
const App = () => {
    const [singleFile, setSingleFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const selectOneFile = async () => {
        setLoading(true);
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.xlsx],
            });
            const fileName = res[0].name;

            const exportedFileContent = await RNFS.readFile(res[0].uri, 'ascii');
            const readedData = XLSX.read(exportedFileContent, { type: 'binary' });
            let data = []
            const sheets = readedData.SheetNames
            for (let i = 0; i < sheets.length; i++) {
                const temp = XLSX.utils.sheet_to_json(
                    readedData.Sheets[readedData.SheetNames[i]]);
                temp.forEach((res) => {
                    data.push(res)
                });
            }
            setSingleFile(res[0]);
            // console.log('read data', data.length)
            let msg = "Invalid import file";
            if (fileName) {
                const _chunks = chunk(data, 50);
                //  console.log('check data', _chunks.length);
                for (const records of _chunks) {
                    if (fileName === ExcelFileNames.users) {
                        const res = await setCustomerMany(records);
                        if (res.success) {
                            msg = "Success users import";
                        } else {
                            msg = "Failed users import";
                        }
                    }
                    if (fileName === ExcelFileNames.groups) {
                        const res = await setGroupMany(records);
                        if (res.success) {
                            msg = "Success groups import";
                        } else {
                            msg = "Failed groups import";
                        }
                    }
                    if (fileName === ExcelFileNames.userGroups) {
                        const res = await setCustomerGroupMany(records);
                        if (res.success) {
                            msg = "Success user groups import";
                        } else {
                            msg = "Failed user groups import";
                        }
                    }
                    if (fileName === ExcelFileNames.meterRecords) {
                        const res = await setMeterRecordMany(records);
                        if (res.success) {
                            msg = "Success meter records import";
                        } else {
                            msg = "Failed meter records import";
                        }
                    }
                }
            }
            ToastAndroid.showWithGravity(
                msg,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
        setLoading(false);
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.titleText}>
                Data import to Meter Book
            </Text>
            <Text style={styles.guideTextSyle}>
                Guide lines:
                {'\n'}
                1). Please clear your data from your application .
                {'\n'}
                2).Import your exported users file ({ExcelFileNames.users}).
                {'\n'}
                3).Import your exported groups file ({ExcelFileNames.groups}).
                {'\n'}
                4).Import your exported user groups file ({ExcelFileNames.userGroups}).
                {'\n'}
                5).Import your exported meter file ({ExcelFileNames.meterRecords}).
                {'\n'}
            </Text>
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttonStyle}
                    onPress={selectOneFile}
                    disabled={loading}
                >
                    {/*Single file selection button*/}
                    <Text style={{ marginRight: 10, fontSize: 19 }}>
                        {loading ? 'Data is importing.....' : ' Click here to pick file'}
                    </Text>
                    {loading ? <ActivityIndicator style={{ marginLeft: 'auto' }} size="small" color="black" /> :
                        <Entypo
                            name="attachment"
                            color={'black'}
                            size={20}
                            style={{ alignSelf: 'center', marginLeft: 'auto' }}
                        />
                    }
                </TouchableOpacity>
                {singleFile && <Text style={styles.textStyle}>
                    File Name: {singleFile.name ? singleFile.name : ''}
                    {'\n'}
                    Type: {singleFile.type ? singleFile.type : ''}
                    {'\n'}
                    File Size: {singleFile.size ? singleFile.size : ''}
                </Text>}
                {loading && <Text style={styles.warnText}>
                    Warning!
                    {'\n'}
                    1). Don't close your phone when data is importing .
                    {'\n'}
                    2).Don't make any actions when data is importing.
                    {'\n'}
                </Text>
                }
            </View>
        </SafeAreaView>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        padding: 16,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
        color: 'black'
    },
    textStyle: {
        fontSize: 15,
        marginTop: 16,
        color: 'black',
    },
    guideTextSyle: {
        padding: 4,
        fontSize: 15,
        marginTop: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'black',
    },
    buttonStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#79a0c9',
        padding: 5,
        borderRadius: 5,
    },
    imageIconStyle: {
        height: 20,
        width: 20,
        resizeMode: 'stretch',
    },
    warnText: {
        color: 'red',
        fontSize: 18,
        marginTop: 15,
        fontWeight: 'bold',
        fontStyle: 'italic'
    }
});