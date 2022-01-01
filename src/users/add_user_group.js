import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from "../constants/colors";
import { insertCustomerGroup, getAllGroup, getUserGroups } from "../helpers/sqlite_service";
import { LanguageContext } from "../helpers/langague_service";
import { Languages } from '../constants/language';
import UserGroupListItem from '../components/user_group_list_item';
//money-bill
export default function AddUserGroup({ navigation, route }) {
    const { code, } = React.useContext(LanguageContext);
    const { params } = route;
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(params.user)
    const [groups, setGroups] = useState([]);
    const [formData, setFormData] = useState({ groupId: "", })
    const isCreate = params && params.type === "create";
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isCreate) {
                getAllGroup().then(res => {
                    if (res.success) {
                        let data = res.data;
                        getUserGroups(user.id).then(res2 => {
                            if (res2.success) {
                                data = data.map(d => {
                                    const isActive = res2.data.findIndex(vv => vv.groupId === d.id) !== -1;
                                    return {
                                        ...d,
                                        isActive
                                    }
                                });
                            }
                            setGroups(data);
                        });
                        // console.log('res group', res)
                    }
                })
            }
        });
        return unsubscribe;
    }, [isCreate, user, navigation])
    const onCreate = async (gpId) => {
        setLoading(true);
        const res = await insertCustomerGroup(user.id, gpId);
        if (res.success) {
            navigation.pop();
        }
        setLoading(false);
    }

    const CreateForm = () => {
        return (

            <View style={styles.container}>
                <Text style={styles.titleText}>{Languages[code].addUserGroup} </Text>
                <View style={[styles.viewContainer, { elevation: 0.9, borderBottomColor: 'black' }]}>
                    <Text style={styles.viewText}> ID:     {user.id || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].name}:     {user.name || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].phoneNumber}: {user.phone || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].meterNumber}:  {user.meter || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].address}:       {user.address || ""}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', height: 40, maxHeight: 40 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{Languages[code].userGroups}</Text>
                    </View>
                </View>
                <View style={[{ flex: 1, width: '100%', minWidth: '100%', padding: 5, }]}>
                    <ScrollView>
                        {
                            groups.map((gp) => {
                                return (
                                    <UserGroupListItem
                                        key={gp.id}
                                        gpId={gp.id}
                                        isActive={gp.isActive}
                                        name={gp.name}
                                        totalCount={gp.totalCount}
                                        addUserGroup={onCreate}
                                    />
                                );
                            }
                            )
                        }
                        {/* <UserGroupListItem
                                    key={gp.id}
                                    isActive={false}
                                    name={gp.name}
                                    totalCount={gp.totalCount}
                                    addUserGroup={onCreate}
                                /> */}
                        {/* {
                            groups.map(gp => {
                                return (
                                    <View key={gp.id} style={[styles.item, { margin: 5 }]}>
                                        {!loading ?
                                            <Button color={Colors.buttonColor} onPress={() => onCreate(gp.id)} title={`Add Group (${gp.name})`} /> :
                                            <View style={styles.loading}>
                                                <ActivityIndicator size="small" color="black" />
                                                <Text style={{ alignSelf: 'center' }}>loading...</Text>
                                            </View>
                                        }
                                    </View>
                                );
                            })
                        } */}
                    </ScrollView>
                </View>
            </View>
        );
    };
    return (
        <CreateForm />
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        alignItems: 'center'
    },
    item: {
        width: '100%'
    },
    inputText: {
        backgroundColor: '#e3e1da',
        // paddingHorizontal: 20,
        color: 'black',
        borderRadius: 8,
        padding: 4,
        borderColor: 'black',
        margin: 5,
    },
    titleText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    },
    errorText: {
        color: 'red',
        marginLeft: 4,
    },
    button: {
        alignItems: 'center',
        borderRadius: 5,
        width: '50%'
    },
    loading: {
        margin: 5,
        height: 35,
        textAlign: 'center',
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    viewContainer: {
        flex: 1,
        marginTop: 8,
        maxHeight: '25%',
        minWidth: '100%'
    },
    viewText: {
        color: 'black',
        fontWeight: 'bold',
        padding: 4,
    },
});