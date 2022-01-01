import React, { useState } from 'react'
import { View, StyleSheet, Text, Button, Alert, ActivityIndicator } from "react-native";
import { truncateMeterRecord, truncateUserAndMeterRecord } from "../helpers/sqlite_service";
import { Colors } from "../constants/colors";
export default function SettingScreen(props) {
    const [loading, setLoading] = useState(false)
    const handleFactoryReset = async () => {
        Alert.alert(
            'Delete All Records',
            'Are you sure to delete users and meters?',
            [
                {
                    text: 'Ok',
                    onPress: async () => {
                        setLoading(true);
                        await truncateUserAndMeterRecord();
                        setLoading(false);
                    },
                },
            ],
            { cancelable: true, }
        );
    }
    const handleReset = async () => {
        Alert.alert(
            'Delete Meter Records',
            'Are you sure to delete meters?',
            [
                {
                    text: 'Ok',
                    onPress: async () => {
                        setLoading(true);
                        await truncateMeterRecord();
                        setLoading(false);
                    },
                },
            ],
            { cancelable: true, }
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                {
                    !loading ? <Button color={'orange'} onPress={handleReset} title="Reset Database" /> :
                        <View style={styles.loading}>
                            <ActivityIndicator size="small" color="black" />
                            <Text style={{ alignSelf: 'center' }}>loading...</Text>
                        </View>
                }

            </View>
            <View style={styles.item}>
                {
                    !loading ? <Button color={'red'} onPress={handleFactoryReset} title="Factory Reset" /> :
                        <View style={styles.loading}>
                            <ActivityIndicator size="small" color="black" />
                            <Text style={{ alignSelf: 'center' }}>loading...</Text>
                        </View>
                }

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        margin: 5,
    },
    loading: {
        height: 35,
        textAlign: 'center',
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center'
    },
})