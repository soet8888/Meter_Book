import React, { useState, useEffect, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Colors } from "../constants/colors";
import { insertCustomer, getUserMerterRecords } from "../helpers/sqlite_service";
import { Languages } from "../constants/language";
import { LanguageContext } from "../helpers/langague_service";
//money-bill
const schema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short!')
        .required('Name is required.'),
    phone: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Phone number is required.'),
    meter: Yup.string()
        .min(1, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Meter number is required.'),
});
export default function User({ navigation, route }) {
    const { params } = route;
    const [loading, setLoading] = useState(false)
    const { code } = useContext(LanguageContext);
    const [user, setUser] = useState(params.user)
    const [userHistory, setUserHistory] = useState([]);
    const [formData, setFormData] = useState({ name: "", phone: "", meter: "", address: "" })
    const isCreate = params && params.type === "create";
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isCreate === false) {
                getUserMerterRecords(user.id).then(res => {
                    if (res.success) {
                        setUserHistory(res.data);
                    }
                })
            }
        });
        return unsubscribe;
    }, [isCreate, user, navigation])
    const onCreate = async (values) => {
        setLoading(true);
        const res = await insertCustomer(values);
        if (res.success) {
            navigation.pop();
        }
        setLoading(false);
    }

    const CreateForm = () => {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{Languages[code].addNewUser}</Text>
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
                            <TextInput
                                placeholder={Languages[code].phoneNumber}
                                placeholderTextColor="black"
                                keyboardType='numeric'
                                style={styles.inputText}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                            />
                            {errors.phone && touched.phone ? (
                                <Text style={styles.errorText}>{errors.phone}</Text>
                            ) : null}
                            <TextInput
                                placeholder={Languages[code].meterNumber}
                                placeholderTextColor="black"
                                keyboardType='numeric'
                                style={styles.inputText}
                                onChangeText={handleChange('meter')}
                                onBlur={handleBlur('meter')}
                                value={values.meter}
                            />
                            {errors.meter && touched.meter ? (
                                <Text style={styles.errorText}>{errors.meter}</Text>
                            ) : null}
                            <TextInput
                                placeholder={Languages[code].address}
                                placeholderTextColor="black"
                                style={styles.inputText}
                                onChangeText={handleChange('address')}
                                onBlur={handleBlur('address')}
                                value={values.address}
                            />
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
                    <Text style={styles.viewText}> ID:     {user.id || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].name}:     {user.name || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].phoneNumber}: {user.phone || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].meterNumber}:  {user.meter || ""}</Text>
                    <Text style={styles.viewText}> {Languages[code].address}:       {user.address || ""}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', height: 40, maxHeight: 40 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>{Languages[code].history}</Text>
                    </View>
                    <View style={{ marginLeft: 'auto', }}>
                        <Button onPress={() => {
                            navigation.navigate({
                                name: 'AddUserGroup',
                                params: { type: "create", user: user },
                            });
                        }} title="Add Group" />
                    </View>
                </View>
                <View style={[styles.viewContainer, { minHeight: '45%' }]}>
                    <FlatList
                        data={userHistory}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={<Empty />}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                navigation.navigate({
                                    name: 'Meter',
                                    params: { type: "update", meter: item },
                                });
                            }} >
                                <View style={[styles.viewListItem, { textAlign: 'center', borderColor: 'black' }]}>
                                    <Text style={[styles.viewText]}>{(new Date(item.createdAt)).toDateString()}</Text>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={[styles.viewText,]}>{Languages[code].totalAmount}:{item.totalAmount}</Text>
                                        <Text style={[styles.viewText,]}>{Languages[code].payAmount}:{item.payAmount}</Text>
                                        {item.status === 'remain' && <Text style={[styles.viewText, { color: Colors.pendingColor }]}>{Languages[code].creditAmount}:{item.totalAmount - item.payAmount}</Text>}
                                    </View>
                                    <Text style={[styles.viewText, { marginLeft: 'auto', color: item.status === 'paid' ? 'green' : Colors.pendingColor }]}>{`${item.status}`}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => {
                        navigation.navigate({
                            name: 'Meter',
                            params: {
                                type: "create", meter: {
                                    customerId: user.id,
                                    customerName: user.name,
                                    customerPhone: user.phone
                                }
                            },
                        });
                    }}>
                        <AntDesign
                            name="pay-circle-o1"
                            color={Colors.primary}
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
        backgroundColor: 'black',
        borderRadius: 20,
        bottom: 10,
        right: 20,
    },
});