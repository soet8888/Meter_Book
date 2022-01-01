import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';

class LanguageListItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleLocaleChange = this.handleLocaleChange.bind(this);
    }

    handleLocaleChange() {
        Alert.alert(
            `Are you sure to Add ${this.props.name}`,
            null,
            [
                {
                    text: "cancel",
                    style: 'cancel'
                },
                {
                    text: "Okay",
                    onPress: () => this.props.addUserGroup(this.props.gpId),
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
                disabled={this.props.isActive === true}
            >
                <View style={styles.textWrapper}>
                    <Text style={[
                        styles.title, (this.props.isActive && styles.active)
                    ]}>
                        {this.props.name || "Name"}
                    </Text>
                    <Text style={[styles.subtitle, { color: 'green' }]}> {'\u2B24'} {this.props.totalCount}</Text>
                </View>
                {
                    this.props.isActive &&
                    <Icon
                        style={styles.active}
                        name="ios-checkmark-circle-outline"
                        size={30}
                    />
                }
                {!this.props.isActive && <AntIcon
                    style={styles.inactive}
                    name="addusergroup"
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
    },
    inactive: {
        color: '#6b6765'
    },
});

export default LanguageListItem;