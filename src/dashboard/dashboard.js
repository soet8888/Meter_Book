import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { getDashboard } from "../helpers/sqlite_service";

import { Colors } from "../constants/colors";
import { Languages } from "../constants/language";
import { LanguageContext } from "../helpers/langague_service";
import { formatMoney } from "../utils";
const panelList = [
    {
        label: "User",
        value: 20,
        dataKey: "totalUser",
        lKey: "user",
        icon: <FontAwesome
            name="users"
            color="black"
            size={20}
        />
    },
    {
        label: "Meter",
        value: 1234,
        lKey: "meter",
        dataKey: "totalMeter",
        icon: <FontAwesome
            name="tachometer"
            color="black"
            size={20}
        />
    },
    {
        label: "Money",
        value: 123444440,
        dataKey: "totalAmount",
        lKey: "totalAmount",
        icon: <FontAwesome
            name="money"
            color="black"
            size={20}
        />
    },
    {
        label: "Credit",
        value: 15,
        dataKey: "totalCredit",
        lKey: 'creditAmount',
        icon: <Entypo
            name="credit"
            color="black"
            size={20}
        />
    },
];

const initSummary = { totalUser: 0, totalMeter: 0, totalAmount: 0, totalCredit: 0 };
const Dashboard = (props) => {
    const { navigation } = props;
    const { code } = useContext(LanguageContext)
    const [state, setState] = useState({ status: 'none', summary: initSummary, topUser: [] });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDashboard().then(res => {
                const _state = { status: 'loaded', summary: initSummary, topUser: [] };
                if (res.success) {
                    const clen = res.credit.length;
                    const creditTotalAmount = clen === 1 ? res.credit[0].totalAmount : 0;
                    const creditToalPayAmount = clen === 1 ? res.credit[0].totalPayAmount : 0;
                    _state.topUser = res.topUser;
                    _state.summary = res.summary.length === 1 ? res.summary[0] : initSummary;
                    _state.summary.totalCredit = creditTotalAmount - creditToalPayAmount;
                }
                setState({ ..._state });
            });
        });

        return unsubscribe;

    }, [navigation]);
    const Empty = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', marginTop: "40%" }}>
                <AntDesign
                    name="inbox"
                    color={'#e3e1da'}
                    size={60}
                    style={{ alignSelf: 'center' }}
                />
                <Text style={{ color: 'black', fontStyle: 'italic' }}> Empty Record</Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, borderRadius: 10 }}>
            <LinearGradient colors={[Colors.textColor, Colors.buttonColor, '#268805',]} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 50 }}>
                <View style={[styles.row,]}>
                    {
                        panelList.map(panel => {
                            return (
                                <View key={panel.label} style={[styles.widgets]}>
                                    <View style={{ flex: 1, flexDirection: 'column', }}>
                                        <View
                                            style={{ flex: 1, maxHeight: '50%', flexDirection: 'row', justifyContent: 'space-between' }}
                                        >
                                            <Text style={styles.text}>{Languages[code][panel.lKey]}</Text>
                                            {panel.icon}
                                        </View>
                                        <Text style={[styles.text]}>{formatMoney(state.summary[panel.dataKey] || 0)}</Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>
            </LinearGradient>
            <View style={[styles.container]}>
                <View><Text style={[styles.text, { textAlign: 'left', marginTop: 5 }]}>{Languages[code].topUsers}</Text></View>
                <FlatList
                    data={state.topUser}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Empty />}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            navigation.navigate({
                                name: 'User',
                                params: { type: "update", user: item },
                            });
                        }}>
                            <View style={styles.listItem}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text style={[styles.listItemText]}>{item.name}</Text>
                                    <Text style={[styles.listItemText, { color: 'gray' }]}> {'\u2B24'}{(new Date(item.lastActiveAt)).toDateString()}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text style={[styles.listItemText,]}>{Languages[code].totalMeter}: {item.totalMeter || 0}</Text>
                                    <Text style={[styles.listItemText,]}>{Languages[code].totalAmount}: {item.totalAmount || 0}</Text>
                                </View>
                                <View style={[{ marginLeft: 'auto', paddingRight: 5 }]}>
                                    <FontAwesome5
                                        name="crown"
                                        color="#a8a832"
                                        size={25}
                                    /></View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
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
        justifyContent: 'center',
        minHeight: '30%',
        height: '30%',
        borderRadius: 10,
        borderBottomLeftRadius: 30,
    },
    widgets: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 5,
        backgroundColor: "white",
        alignSelf: "flex-start",
        marginHorizontal: "2%",
        marginBottom: 6,
        shadowColor: 'black',
        elevation: 3.0,
        marginTop: 5,
        minHeight: "40%",
        minWidth: "40%",
        textAlign: "center",
    },
    text: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
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
        height: 90,
        elevation: 0.3,
    },
    listItemText: {
        color: 'black'
    },
})

export default Dashboard;