import React, { useState, useEffect, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Colors } from "../constants/colors";
import { insertGroup, getGroupUsers } from "../helpers/sqlite_service";
import { LanguageContext } from "../helpers/langague_service";
import { Languages } from '../constants/language';
//money-bill
const schema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short!')
        .required('Name is required.'),
});
export default function UserGroup({ navigation, route }) {
    const { params } = route;
    const { code, } = React.useContext(LanguageContext);
    const [loading, setLoading] = useState(false)
    const [group, setGroup] = useState(params.group)
    const [groupUser, setGroupUser] = useState([]);
    const [formData, setFormData] = useState({ name: "", })
    const isCreate = params && params.type === "create";
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isCreate === false) {
                getGroupUsers(group.id).then(res => {
                    if (res.success) {
                        setGroupUser(res.data);
                    }
                })
            }
        });
        return unsubscribe;
    }, [isCreate, group, navigation])
    const onCreate = async (values) => {
        setLoading(true);
        const res = await insertGroup(values.name);
        if (res.success) {
            navigation.pop();
        }
        setLoading(false);
    }

    const CreateForm = () => {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{Languages[code].addUserGroup}</Text>
                <Formik
                    validationSchema={schema}
                    initialValues={formData}
                    onSubmit={onCreate}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={styles.item}>
                            <TextInput
                                style={styles.inputText}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                placeholder={Languages[code].name}
                                placeholderTextColor="black"
                                value={values.name}
                            />
                            {errors.name && touched.name ? (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            ) : null}
                            {
                                !loading ?
                                    <Button color={Colors.buttonColor} onPress={handleSubmit} title={Languages[code].create} /> :
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="small" color="black" />
                                        <Text style={{ alignSelf: 'center' }}>loading...</Text>
                                    </View>
                            }
                        </View>
                    )}
                </Formik>
            </View>
        );
    };
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
    const ViewForm = () => {
        return (
            <View style={{ flex: 1, alignItems: 'flex-start', padding: 10 }}>
                <View style={[styles.viewContainer, { elevation: 0.9, borderBottomColor: 'black' }]}>
                    <Text style={styles.viewText}> ID:     {group.id || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].name}:     {group.name || ""}</Text>
                </View>
                <View style={[styles.viewContainer, { minHeight: '60%' }]}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{Languages[code].users}</Text>
                    <FlatList
                        data={groupUser}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Empty />}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate({
                                    name: 'User',
                                    params: { type: "update", user: { id: item.userId, name: item.userName, address: item.userAddress, phone: item.userPhone } },
                                });
                            }} >
                                <View style={[styles.viewListItem, { textAlign: 'center', borderColor: 'black' }]}>
                                    <Text style={[styles.viewText]}>{item.userName}</Text>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={[styles.viewText,]}>{item.userPhone}</Text>
                                        <Text style={[styles.viewText,]}>{item.userAddress}</Text>
                                    </View>
                                    <Text style={[styles.viewText, { marginLeft: 'auto', color: Colors.pendingColor }]}>{`M-${item.userMeter}`}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => {
                        navigation.navigate({
                            name: 'Users',
                        });
                    }}>
                        <AntDesign
                            name="addusergroup"
                            color={'black'}
                            size={40}
                            style={{ alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>);
    }
    if (isCreate) {
        return <CreateForm />
    } else {
        return <ViewForm />
    }

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
        minWidth: '100%',
    },
    viewText: {
        color: 'black',
        fontWeight: 'bold',
        padding: 4,
    },
    viewListItem: {
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
    addButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
       // backgroundColor: 'black',
        borderRadius: 20,
        bottom: 10,
        right: 20,
    },
});