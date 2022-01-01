import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getMerterRecords } from "../helpers/sqlite_service";
import { Colors } from "../constants/colors";
import { formatMoney } from '../utils';
import { Languages } from "../constants/language";
import { LanguageContext } from "../helpers/langague_service";
export default function History(props) {
    const { navigation } = props;
    const { code } = useContext(LanguageContext);
    const [state, setState] = useState({ status: 'none', data: [] });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getMerterRecords().then(res => {
                let _state = { status: 'loaded', data: [] };
                if (res.success) {
                    _state = { ..._state, data: res.data }
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
            <FlatList
                data={state.data}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Empty />}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        navigation.navigate({
                            name: 'Meter',
                            params: { type: "update", meter: item },
                        });
                    }}>
                        <View style={styles.listItem}>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[styles.listItemText]}>{item.name}</Text>
                                <Text style={[styles.listItemText]}>{(new Date(item.createdAt)).toDateString()}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[styles.listItemText,]}>{Languages[code].totalAmount}:{formatMoney(item.totalAmount)}</Text>
                                <Text style={[styles.listItemText,]}>{Languages[code].payAmount}:{formatMoney(item.payAmount)}</Text>
                                {item.status === 'remain' && <Text style={[styles.viewText, { color: Colors.pendingColor }]}>{Languages[code].creditAmount}:{formatMoney(item.totalAmount - item.payAmount)}</Text>}
                            </View>
                            <Text style={[{ marginLeft: 'auto', paddingRight: 2, color: item.status === 'paid' ? 'green' : Colors.pendingColor }]}>{`${item.status}`}</Text>
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
