import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, Button, ActivityIndicator, TextInput } from "react-native";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from "../constants/colors";
import { insertMeterRecord, updateMeterStatus } from "../helpers/sqlite_service";
import { Languages } from "../constants/language";
import { LanguageContext } from "../helpers/langague_service";
const schema = Yup.object().shape({
    totalAmount: Yup.string().min(2, 'Too short!')
        .required('total amount is required.'),
    payAmount: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('pay amount is required.'),
    meter: Yup.string()
        .min(1, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Meter  is required.'),
});

export default function Meter({ navigation, route }) {
    const { params } = route;
    const { code } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false)
    const [routeData, setRouteData] = useState(params.meter)
    const [formData, setFormData] = useState({ totalAmount: "", payAmount: "", meter: "" })
    const isCreate = params && params.type === "create";
    const onCreate = async (values) => {
        setLoading(true);
        const { customerId } = routeData;
        const { meter, payAmount, totalAmount } = values
        const createdAt = (new Date()).getTime();
        const status = payAmount !== totalAmount ? "remain" : "paid";
        const res = await insertMeterRecord({ customerId, payAmount, totalAmount, status, createdAt, meter });
        if (res.success) {
            navigation.pop();
        }
        setLoading(false);
    }
    const onUpdate = async (status, id) => {
        setLoading(true);
        const res = await updateMeterStatus({ status, id });
        if (res.success) {
            navigation.pop();
        }
        setLoading(false);
    }
    const CreateForm = () => {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{Languages[code].addMeterPay} </Text>
                <Formik
                    validationSchema={schema}
                    initialValues={formData}
                    onSubmit={onCreate}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={styles.item}>
                            <Text style={styles.text} >{routeData.customerName || ""} </Text>
                            <Text style={styles.text} >{routeData.customerPhone || ""} </Text>
                            <TextInput
                                placeholder={Languages[code].totalAmount}
                                placeholderTextColor="black"
                                keyboardType='numeric'
                                style={styles.inputText}
                                onChangeText={handleChange('totalAmount')}
                                onBlur={handleBlur('totalAmount')}
                                value={values.totalAmount}
                            />
                            {errors.totalAmount && touched.totalAmount ? (
                                <Text style={styles.errorText}>{errors.totalAmount}</Text>
                            ) : null}
                            <TextInput
                                placeholder={Languages[code].payAmount}
                                placeholderTextColor="black"
                                keyboardType='numeric'
                                style={styles.inputText}
                                onChangeText={handleChange('payAmount')}
                                onBlur={handleBlur('payAmount')}
                                value={values.payAmount}
                            />
                            {errors.payAmount && touched.payAmount ? (
                                <Text style={styles.errorText}>{errors.payAmount}</Text>
                            ) : null}
                            <TextInput
                                placeholder={Languages[code].meter}
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
                            {
                                !loading ?
                                    <Button color={Colors.buttonColor} onPress={handleSubmit} title="Add Pay" /> :
                                    <View style={styles.loading}>
                                        <ActivityIndicator size="small" color="black" />
                                        <Text style={{ alignSelf: 'center' }}>loading...</Text>
                                    </View>
                            }
                        </View>
                    )}
                </Formik>
            </View>
        )
    }
    const UpdateForm = () => {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>{Languages[code].updateMeterPay} </Text>
                <View style={{ flex: 1, alignItems: 'flex-start', padding: 10 }}>
                    <View style={[styles.viewContainer, { elevation: 0.9, borderBottomColor: 'black' }]}>
                        <Text style={styles.viewText}> ID:     {routeData.id || ""}</Text>
                        <Text style={styles.viewText}> {Languages[code].user}:     {routeData.name || routeData.customerName || ""}</Text>
                        <Text style={styles.viewText}> {Languages[code].totalAmount}: {routeData.totalAmount || ""}</Text>
                        <Text style={styles.viewText}> {Languages[code].payAmount}:  {routeData.payAmount || ""}</Text>
                        <Text style={styles.viewText}> {Languages[code].meter}:  {routeData.meter || ""}</Text>
                        <Text style={styles.viewText}> Status:       {routeData.status || ""}</Text>
                        {routeData.status === 'remain' && <Text style={[styles.viewText, { color: 'red' }]}> {Languages[code].creditAmount}:  {routeData.totalAmount - routeData.payAmount}</Text>}
                    </View>
                    <View style={[styles.viewContainer, { minHeight: '30%', }]}>
                        {routeData.status !== 'paid' && (!loading ?
                            <Button color={Colors.buttonColor} onPress={() => onUpdate("paid", routeData.id)} title="Complete Pay" /> :
                            <View style={styles.loading}>
                                <ActivityIndicator size="small" color="black" />
                                <Text style={{ alignSelf: 'center' }}>loading...</Text>
                            </View>)
                        }
                        <View style={{ marginTop: 10 }}>
                            {!loading ?
                                <Button color={'red'} onPress={() => onUpdate("cancel", routeData.id)} title="Cancel Pay" /> :
                                <View style={styles.loading}>
                                    <ActivityIndicator size="small" color="black" />
                                    <Text style={{ alignSelf: 'center' }}>loading...</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    if (isCreate) {
        return <CreateForm />
    } else {
        return <UpdateForm />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2
    },
    text: {
        color: 'black',
        padding: 4,
        marginLeft: 2,
    },
    item: {
        width: '100%'
    },
    loading: {
        margin: 5,
        height: 35,
        textAlign: 'center',
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center'
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
})