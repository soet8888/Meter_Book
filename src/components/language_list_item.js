import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class LanguageListItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleLocaleChange = this.handleLocaleChange.bind(this);
    }

    handleLocaleChange() {
        Alert.alert(
            `Are you sure to change ${this.props.englishName}`,
            null,
            [
                {
                    text: "cancel",
                    style: 'cancel'
                },
                {
                    text: "Okay",
                    onPress: () => this.props.onChangeLocale(this.props),
                    style: 'destructive'
                }
            ]
        )
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={this.handleLocaleChange}
                disabled={this.props.isActive}
            >
                <View style={styles.textWrapper}>
                    <Text style={[
                        styles.title, (this.props.isActive && styles.active)
                    ]}>
                        {this.props.name}
                    </Text>
                    {
                        this.props.englishName &&
                        <Text style={styles.subtitle}>{this.props.englishName}</Text>
                    }
                </View>
                {
                    this.props.isActive &&
                    <Icon
                        style={styles.active}
                        name="ios-checkmark-circle-outline"
                        size={30}
                    />
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignItems: 'center',
        padding: 10
    },
    textWrapper: {
        width: '90%',
        marginLeft: 10
    },
    title: {
        fontSize: 18,
        color: '#434343'
    },
    subtitle: {
        color: '#AAAAAA'
    },
    active: {
        color: '#03a87c'
    }
});

export default LanguageListItem;