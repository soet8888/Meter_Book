import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getMonthlySummary } from "../helpers/sqlite_service";
import { Colors } from "../constants/colors";
import { formatMoney } from '../utils';
import { Languages } from "../constants/language";
import { LanguageContext } from "../helpers/langague_service";
export default function RMonthly(props) {
    const { navigation } = props;
    const { code } = useContext(LanguageContext);
    const [state, setState] = useState({ status: 'none', paidData: [], creditData: [] });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getMonthlySummary().then(res => {
                let _state = { status: 'loaded', paidData: [], creditData: [] };
                if (res.success) {
                    const creditData = res.creditSummary.reduce((obj, cur) => ({ ...obj, [cur.yearMonth]: cur }), {})
                    _state = { ..._state, paidData: res.paidSummary, creditData }
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
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>{Languages[code].monthlyReport}</Text>
            <FlatList
                data={state.paidData}
                keyExtractor={item => item.yearMonth}
                ListEmptyComponent={<Empty />}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { }}>
                        <View style={styles.listItem}>
                            <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 4 }}>

                                <Fontisto
                                    name="date"
                                    color={'black'}
                                    size={20}
                                />
                                <Text style={[styles.listItemText]}>{item.yearMonth}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[styles.listItemText,]}>{Languages[code].totalAmount}:{formatMoney(item.totalAmount || 0)}</Text>
                                <Text style={[styles.listItemText,]}>{Languages[code].totalMeter}:{formatMoney(item.totalMeter || 0)}</Text>
                            </View>
                            {state.creditData[item.yearMonth] &&
                                <View style={[{ marginLeft: 'auto', paddingRight: 2, }]} >
                                    <Text style={[{ color: 'black' }]}>{Languages[code].creditAmount} </Text>
                                    <Text style={[{ color: Colors.pendingColor, fontSize: 12, fontWeight: 'bold' }]}>{formatMoney(state.creditData[item.yearMonth].totalAmount - state.creditData[item.yearMonth].totalPayAmount)}</Text>
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
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
