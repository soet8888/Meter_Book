/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/colors';

export default class LoadingIndicator extends React.Component {
    render() {
        return (
            <View
                style={[
                    { flex: 1, },
                    { alignItems: 'center', justifyContent: 'center' },
                ]}>
                <ActivityIndicator size="large" color={Colors.textColor} />
            </View>
        );
    }
}
