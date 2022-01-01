import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, Button, StyleSheet, FlatList, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../constants/colors';
import { getAllCustomer, insertMeterRecord, getMerterRecords } from "../helpers/sqlite_service";
const RenderHeader = (props) => {
    const [query, setQueryText] = useState("");
    const onSearch = () => {
        if (props.cb) props.cb(query);
    }
    return (
        <View
            style={{
                padding: 10,
                marginVertical: 0,
                borderRadius: 20,
                width: '100%',
                minWidth: '100%'
            }}
        >
            <TextInput
                autoCapitalize="none"
                autoCorrect={true}
                clearButtonMode="always"
                value={query}
                onChangeText={queryText => setQueryText(queryText)}
                placeholder="Search..."
                placeholderTextColor="black"
                onSubmitEditing={onSearch}
                style={{
                    backgroundColor: '#e3e1da',
                    paddingHorizontal: 20,
                    color: 'black',
                    borderRadius: 8,
                    borderColor: 'black',
                    marginRight: 4
                }}
            />
        </View>
    );
};
export default function UserList(props) {
    const [state, setState] = useState({ status: 'none', data: [], orgin: [] });
    const { navigation } = props
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAllCustomer().then(res => {
                let data = { status: 'loaded', data: [], origin: [] }
                if (res.success) {
                    data = { ...data, data: res.data, origin: res.data }
                }
                setState({ ...data })
            });
        });
        return unsubscribe;
    }, [navigation]);
    const handleSearch = (term) => {
        const { origin } = state;
        const data = origin.filter(obj => obj.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
        setState({ ...state, status: 'loaded', data, origin })
    }
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <View style={styles.container} >
                    <FlatList
                        ListHeaderComponent={<RenderHeader cb={(term) => handleSearch(term)} {...props} />}
                        data={state.data}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Empty />}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate({
                                    name: 'User',
                                    params: { type: "view", user: item },
                                });
                            }}>
                                <View style={styles.listItem}>
                                    <Text style={[styles.listItemText]}>{item.name}</Text>
                                    <Text style={[styles.listItemText, { marginLeft: 20 }]}>{item.phone}</Text>
                                    <Text style={[styles.listItemText, { marginLeft: 'auto' }]}>{`M-${item.meter}`}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => {
                        navigation.navigate({
                            name: 'User',
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 1,
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
        color: 'black',
        textAlign: 'center',
        maxWidth: "50%",
        // minWidth: "70%",
        overflow: 'scroll'
    }
});