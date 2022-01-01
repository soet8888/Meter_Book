import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getAllGroup } from "../helpers/sqlite_service";
import { Colors } from '../constants/colors';
export default function UserGroup({ navigation, route }) {
    const [state, setState] = useState({ status: 'none', data: [] });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAllGroup().then(res => {
                let _state = { status: 'loaded', data: [] };
                if (res.success) {
                    _state.data = res.data
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
                            name: 'UserGroup',
                            params: { type: "view", group: item },
                        });
                    }}>
                        <View style={styles.listItem}>
                            <Text style={[styles.listItemText]}>{item.name}</Text>
                            <Text style={[styles.listItemText, { marginLeft: 'auto', backgroundColor: Colors.primary, borderRadius: 50, minWidth: 40 }]}>{item.totalCount}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => {
                navigation.navigate({
                    name: 'UserGroup',
                    params: { type: "create" },
                });
            }}>
                <AntDesign
                    name="pluscircle"
                    color={'black'}
                    size={40}
                    style={{ alignSelf: 'center' }}
                />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: 'black',
        textAlign: 'center'
    },
    addButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.buttonColor,
        borderRadius: 20,
        bottom: 10,
        right: 20,
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
        padding: 2,
        color: 'black',
        textAlign: 'center',
        maxWidth: "50%",
        // minWidth: "70%",
        overflow: 'scroll'
    }
})