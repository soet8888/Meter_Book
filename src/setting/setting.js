import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon2 from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { setAuthStatus } from "../helpers/sqlite_service";
import { LanguageContext, LanguageCode } from "../helpers/langague_service";
import { Languages } from '../constants/language';
const panelList = [
    {
        label: "Users",
        value: 20,
        lKey: "users",
        icon: <FontAwesome
            name="users"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Credit",
        value: 20,
        lKey: "credit",
        icon: <FontAwesome
            name="book"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Report",
        value: 20,
        lKey: "report",
        icon: <MaterialIcon
            name="finance"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "UserGroups",
        value: 20,
        lKey: "userGroup",
        icon: <MaterialIcon
            name="account-group"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Language",
        value: 20,
        lKey: "language",
        icon: <MaterialIcon2
            name="language"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Database",
        value: 20,
        lKey: "database",
        icon: <MaterialIcon
            name="database-remove"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Export",
        value: 20,
        lKey: "exportDatabase",
        icon: <MaterialIcon
            name="database-export"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Import",
        value: 20,
        lKey: "importDatabase",
        icon: <MaterialIcon
            name="database-import"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "GoogleDrive",
        value: 20,
        lKey: "googleDrive",
        icon: <Entypo
            name="google-drive"
            color="black"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
    {
        label: "Logout",
        value: 15,
        lKey: "logout",
        icon: <AntDesign
            name="logout"
            color="red"
            size={40}
            style={{ alignSelf: 'center' }}
        />
    },
];
const Setting = ({ navigation }) => {
    const { code } = React.useContext(LanguageContext);
    const handleClick = (data) => {
        if (data.label === "Logout") {
            Alert.alert(
                'Logout',
                'Are you sure to logout?',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            setAuthStatus("logout");
                            navigation.navigate('Login');
                        },
                    },
                ],
                { cancelable: true, }
            );
        } else {
            navigation.navigate(data.label);
        }
    }
    return (
        <View style={{ padding: 0, flex: 1 }}>
            <View style={[styles.row]}>
                {
                    panelList.map(panel => {
                        return (
                            <View key={panel.label} style={[styles.widgets]}>
                                <TouchableOpacity onPress={() => handleClick(panel)}>
                                    {panel.icon}
                                </TouchableOpacity>
                                <Text style={styles.text}>{Languages[code][panel.lKey]}</Text>
                            </View>
                        );
                    })
                }
            </View>
            <View style={styles.developerContainer} >
                <Text style={styles.developerText}>©Copyright {(new Date().getFullYear())}| Powered by Soe Thu</Text>
            </View>
        </View >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 8,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: '30%',
        height: '30%'
    },
    widgets: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 5,
        backgroundColor: "white",
        alignSelf: "flex-start",
        marginHorizontal: "1%",
        marginBottom: 6,
        shadowColor: 'black',
        elevation: 3.0,
        marginTop: 5,
        marginBottom: 10,
        minHeight: "45%",
        minWidth: "48%",
        textAlign: "center",
    },
    text: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    developerContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        textAlign: 'center',
        bottom: 20,
        right: '20%',
    },
    developerText: {
        color: '#6f7275',
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default Setting;