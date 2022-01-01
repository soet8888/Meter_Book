import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Button
} from "react-native";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Colors } from "../constants/colors";
import { checkAuth, setAuthStatus } from "../helpers/sqlite_service";
import LoadingIndicator from "../components/loading_indicator";

const schema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short!')
        .required('Name is required.'),
    password: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Password is required.'),
});
const initData = {
    name: "",
    password: ""
}
export default function App(props) {
    const [error, setError] = useState();
    const [authState, setAuthState] = useState({ status: 'loading', })
    const { navigation } = props
    useEffect(() => {
        let isCancelled = false;
        checkAuth(null, null, (res) => {
            if (!isCancelled) {
                if (res.success === true) {
                    navigation.replace("Home");
                    setAuthState({ status: 'loggedIn', user: res.user });
                } else {
                    navigation.navigate("Login");
                    setAuthState({ status: 'logout', user: res.user });
                }
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [navigation, setAuthState]);
    const onSubmit = (values) => {
        let { name, password } = values
        name = name.toLocaleLowerCase();
        checkAuth(name, password, (res) => {
            //console.log('auth res', res)
            if (res.success) {
                setAuthStatus("loggedIn", (success) => { });
                setAuthState({ status: 'loggedIn', user: res.user });
                navigation.replace('Home');
            } else {
                setError("Invalid username and password.");
            }
        });
    }
    return (
        authState.status === "loading" ?
            <LoadingIndicator /> :
            < View style={styles.container} >
                <Image style={styles.image} source={require("../assets/logo.png")} />
                <Formik
                    validationSchema={schema}
                    initialValues={initData}
                    onSubmit={onSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.TextInput}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    placeholder="login username."
                                    placeholderTextColor="black"
                                    value={values.name}
                                />
                                {errors.name && touched.name ? (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                ) : null}
                            </View>

                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.TextInput}
                                    placeholder="Enter password"
                                    placeholderTextColor="black"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                />
                                {errors.password && touched.password ? (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                ) : null}
                            </View>
                            <View style={styles.loginBtn}>
                                <Button color={Colors.buttonColor} style={styles.loginBtn} onPress={handleSubmit} title="Login" />
                                {error && <Text style={styles.errorText}>{error}</Text>}
                            </View>
                        </View>
                    )}
                </Formik>
            </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        marginBottom: 40,
        height: "30%",
        resizeMode: 'contain',
    },

    inputView: {
        borderRadius: 5,
        width: "100%",
        minWidth: '70%',
        margin: 5,
        padding: 0,
        alignItems: "center",
    },
    TextInput: {
        backgroundColor: '#e3e1da',
        width: '100%',
        borderRadius: 5,
        padding: 5,
        margin: 5,
        color: 'black',
        minWidth: '70%'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    loginBtn: {
        width: '100%',
        minWidth: '70%',
        marginLeft: 6,
        marginTop: 20,
    },
});

// const mapStateToProps = (state) => {
//     return { state };
// }
// const mapStateDispatch = (dispatch) => {
//     return {};
// }
//export default connect(mapStateToProps, mapStateDispatch)(App);