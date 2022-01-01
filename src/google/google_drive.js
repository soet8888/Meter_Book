import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    PermissionsAndroid,
    ScrollView,
    ToastAndroid,
    SafeAreaView,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GDrive, MimeTypes, ListQueryBuilder } from "@robinbobin/react-native-google-drive-api-wrapper";
import RNFS from "react-native-fs";
import XLSX from 'xlsx';
import { getAllCustomer, getAllGroup, getCustomerGroup, getMerterRecords } from "../helpers/sqlite_service";
import { getMilliseconds } from '../utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ExcelFileNames } from '../constants/excel_file_names';
let apiToken = null

function setApiToken(token) {
    apiToken = token
}

function parseAndHandleErrors(response) {
    console.log(response)
    if (response.ok) {
        return response.json()
    }
    return response.json()
        .then((error) => {
            throw new Error(JSON.stringify(error))
        })
}

/**
 * require write storage permission
 */
async function requestWriteStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                'title': 'Write your android storage Permission',
                'message': 'Write your android storage to save your data'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can write storage")
        } else {
            console.log("Write Storage permission denied")
        }
    } catch (err) {
        console.warn(err)
    }
}

async function requestReadStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'title': 'Read your android storage Permission',
                'message': 'Read your android storage to save your data'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can Read storage")
        } else {
            console.log("Read Storage permission denied")
        }
    } catch (err) {
        console.warn(err)
    }
}

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            loading: false,
        }

        this.checkPermission();
    }
    // check storage permission
    checkPermission = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((writeGranted) => {
            console.log('writeGranted', writeGranted)
            if (!writeGranted) {
                requestWriteStoragePermission()
            }
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((readGranted) => {
                console.log('readGranted', readGranted)
                if (!readGranted) {
                    requestReadStoragePermission()
                }
            })
        })
    }

    getDataFromGoogleDrive = async () => {
        this.setState({ loading: true });
        await this.initialGoogle()
        let dataFiles = [];
        if (apiToken) {
            const gdrive = new GDrive();
            gdrive.accessToken = apiToken;
            const fileList = await gdrive.files.list()
            for (const gfile of fileList["files"]) {
                console.log('gfile \n Id:', gfile.id, "\n Name", gfile.name);
                // const delRes = gdrive.files.delete(gfile.id);
                // console.log('del res', delRes);
                //  const res = await gdrive.files.getJson(gfile.id, {});
                // console.log('object of json', res)
                //(new Date(item.createdAt)).toDateString()

                const displaName = (new Date(parseInt(gfile.name.split('_')[0] || 0))).toDateString()
                dataFiles.push({ id: gfile.id, name: gfile.name, displaName })
            }
        }
        this.setState({ loading: false, data: dataFiles })
    }
    downloadFromGoogleDrive = async (fileId) => {
        await this.initialGoogle();
        if (apiToken) {
            const gdrive = new GDrive();
            gdrive.accessToken = apiToken;
            const res = await gdrive.files.getJson(fileId, {});
            const users = res["users"] || [], userGroups = res["userGroups"] || [], groups = res["groups"] || [], merterRecords = res["merterRecords"] || [];
            if (users.length > 0) {
                const fileName = ExcelFileNames.users;
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.json_to_sheet(users)
                XLSX.utils.book_append_sheet(wb, ws, "users")
                const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                let msg = `success export users`;
                // Write generated excel to Storage
                RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, wbout, 'ascii').then((r) => {
                    console.log('Success');
                }).catch((e) => {
                    console.log('Error 2222', e);
                    msg = `failed export users`;
                });
                ToastAndroid.showWithGravity(
                    msg,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            }
            if (userGroups.length > 0) {
                const fileName = ExcelFileNames.userGroups;
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.json_to_sheet(userGroups)
                XLSX.utils.book_append_sheet(wb, ws, "usergroups")
                const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                let msg = `success export user groups`;
                // Write generated excel to Storage
                RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, wbout, 'ascii').then((r) => {
                    console.log('Success');
                }).catch((e) => {
                    console.log('Error 2222', e);
                    msg = `failed export user groups`;
                });
                ToastAndroid.showWithGravity(
                    msg,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            }
            if (groups.length > 0) {
                const fileName = ExcelFileNames.groups;
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.json_to_sheet(groups)
                XLSX.utils.book_append_sheet(wb, ws, "groups")
                const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                let msg = `success export groups`;
                // Write generated excel to Storage
                RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, wbout, 'ascii').then((r) => {
                    console.log('Success');
                }).catch((e) => {
                    console.log('Error 2222', e);
                    msg = `failed export groups`;
                });
                ToastAndroid.showWithGravity(
                    msg,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            }
            if (merterRecords.length > 0) {
                const fileName = ExcelFileNames.meterRecords;
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.json_to_sheet(merterRecords)
                XLSX.utils.book_append_sheet(wb, ws, "meters")
                const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
                let msg = `success export meter records`;
                // Write generated excel to Storage
                RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, wbout, 'ascii').then((r) => {
                    console.log('Success');
                }).catch((e) => {
                    console.log('Error 2222', e);
                    msg = `failed export meter records`;
                });
                ToastAndroid.showWithGravity(
                    msg,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            }
            console.log('\n users:', users.length, '\n user groups', userGroups.length, '\n groups', groups.length, '\n records', merterRecords.length)
        }
    }
    setDataFromGoogleDrive = async () => {
        this.setState({ loading: true, data: [] });
        await this.initialGoogle();
        if (apiToken) {
            this.uploadDataToGoogleDrive();
        }
        this.setState({ loading: false });
    }
    uploadDataToGoogleDrive = async () => {
        let msg = "Invalid Google Account Authorized."
        try {
            msg = "Success upload to Google Drive.";
            const gdrive = new GDrive();
            gdrive.accessToken = apiToken;
            const fileName = `${getMilliseconds()}_meterData.json`;
            let content = { users: [], userGroups: [], groups: [], merterRecords: [] }
            const userRes = await getAllCustomer();
            if (userRes.success) {
                content.users = userRes.data;
            }
            const meterRes = await getMerterRecords();
            if (meterRes.success) {
                content.merterRecords = meterRes.data;
            }
            const groupRes = await getAllGroup();
            if (groupRes.success) {
                content.groups = groupRes.data;
            }
            const ugRes = await getCustomerGroup();
            if (ugRes.success) {
                content.userGroups = ugRes.data;
            }
            await gdrive.files.newMultipartUploader()
                .setData(JSON.stringify(content), MimeTypes.JSON)
                .setRequestBody({
                    name: fileName,
                })
                .setQueryParameters()
                .execute();
        } catch (error) {
            console.log('error', JSON.stringify(error))
            // msg = "Failed to upload Google drive."
        }
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
        );
    }

    initialGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            await GoogleSignin.configure({
                scopes: ['https://www.googleapis.com/auth/drive'],
                shouldFetchBasicProfile: true,
               // webClientId: '96959650637-iijpivhahrfk68r9su2o8v8n7oiuotha.apps.googleusercontent.com',
                // webClientId: "96959650637-sm4uklrmsvhodpo9r5b1m18ocuog82gh.apps.googleusercontent.com",
               // offlineAccess: true
            });
            //1640862964935
            //1346142933585
            await GoogleSignin.signIn();
            const token = await GoogleSignin.getTokens();
            setApiToken(token.accessToken)
        } catch (error) {
            ToastAndroid.showWithGravity(
                "Failed to login google account.",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.titleText}>
                    Backup with Google Drive
                </Text>
                <Text style={styles.guideTextSyle}>
                    Guide lines:
                    {'\n'}
                    🌐 Please open your mobile internet or Wifi connection.
                    {'\n'}
                    ✔️ Your mobile need to support google play services.
                    {'\n'}
                    👍 You need one google account (xxxxx@gmail.com).
                    {'\n'}
                    👍 When you click upload button below , application upload data automatically.
                    {'\n'}
                    👈 when you click download button belows , application automatically downloaded enter (Downloads folder) in your phone.
                    {'\n'}
                    👌 After downloaded backup data , you can import data with system data import process.
                </Text>
                <View style={styles.container}>
                    <TouchableHighlight style={styles.buttonGetData} onPress={this.setDataFromGoogleDrive}>
                        <Text style={styles.text}>
                            {this.state.loading ? 'loading.....' : 'Upload To Google Drive'}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.buttonGetData} onPress={this.getDataFromGoogleDrive}>
                        <Text style={styles.text}>
                            {this.state.loading ? 'loading.....' : ' Get Files From Google Drive'}
                        </Text>
                    </TouchableHighlight>
                    {(!this.state.loading && this.state.data.length > 0) &&
                        <FlatList
                            data={this.state.data}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={
                                <View style={{ flex: 1, alignItems: 'center', marginTop: "5%" }}>
                                    <AntDesign
                                        name="inbox"
                                        color={'#e3e1da'}
                                        size={60}
                                        style={{ alignSelf: 'center' }}
                                    />
                                    <Text style={{ color: 'black', fontStyle: 'italic' }}> Empty Record</Text>
                                </View>}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => this.downloadFromGoogleDrive(item.id)}>
                                    <View style={styles.listItem}>
                                        <Text style={[styles.listItemText]}>{item.displaName}</Text>
                                        <Text style={[styles.listItemText, { marginLeft: 20 }]}>{'Download'}</Text>
                                        <View style={{ marginLeft: 'auto' }}>
                                            <AntDesign
                                                name="clouddownload"
                                                color={'#0373fc'}
                                                size={30}
                                                style={{ alignSelf: 'center' }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    }
                </View>
                {this.state.loading && <Text style={styles.warnText}>
                    Warning!
                    {'\n'}
                    1). Don't close your phone during processing .
                    {'\n'}
                    2).Don't close your mobile internet or wifi .
                    {'\n'}
                </Text>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 12
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 4,
        color: 'black'
    },
    guideTextSyle: {
        padding: 4,
        fontSize: 15,
        marginTop: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: 'black',
    },
    text: {
        textAlign: 'center',
        color: 'black',
        margin: 5,
    },
    textData: {
        textAlign: 'center',
        color: 'black',
        margin: 5,
    },
    buttonGetData: {
        backgroundColor: '#0373fc',
        padding: 10,
        margin: 3,
    },
    warnText: {
        color: 'red',
        fontSize: 18,
        marginTop: 15,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 5,
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '90%',
        minWidth: '95%',
        height: 50,
        elevation: 0.6,
    },
    listItemText: {
        fontSize: 15,
        color: 'black',
        textAlign: 'center',
        maxWidth: "50%",
        // minWidth: "70%",
        overflow: 'scroll'
    }
});