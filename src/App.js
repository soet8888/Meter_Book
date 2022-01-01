import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux";
import { ToastAndroid } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DashboardScreen from './dashboard/dashboard';
import SettingsScreen from './setting/setting';
import HistoryScreen from './history/history';
import RemainHistoryScreen from './history/history_remain';
import LoginScreen from './login/login';
import UserLit from './users/user_list';
import User from './users/user';
import UserGroupList from './users/user_group_list';
import AddUserGroup from './users/add_user_group';
import UserGroup from './users/user_group';
import Meter from './meter/meter';
import DBScreen from './database/screen';
import ImportDBScreen from './database/import_database';
import ExportDBscreen from './database/export_database';
import LanguageSetting from './setting/language'
import MonthlyReport from './reports/monthly_report';

import GoogleDrive from './google/google_drive';
import { Colors } from "./constants/colors";
import { InitializeDB } from "./helpers/sqlite_service";
import { LanguageProvider, LanguageContext } from './helpers/langague_service';
import { Languages } from './constants/language'
import store from './store';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MainTabs(props) {
    const { code } = React.useContext(LanguageContext);
    return (
        <Tab.Navigator>
            <Tab.Screen
                name={Languages[code].dashboard}
                component={DashboardScreen}
                options={{
                    tabBarActiveBackgroundColor: "#babab6",
                    tabBarLabel: Languages[code].dashboard,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: Colors.primary, height: 40 },
                    tabBarLabelStyle: { color: Colors.textColor },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dashboard" color={Colors.buttonColor} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name={Languages[code].history}
                component={HistoryScreen}
                options={{
                    tabBarActiveBackgroundColor: "#babab6",
                    tabBarLabel: Languages[code].history,
                    headerTitleAlign: 'center',
                    tabBarLabelStyle: { color: Colors.textColor },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="history" color={Colors.buttonColor} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name={Languages[code].actions}
                component={SettingsScreen}
                options={{
                    tabBarActiveBackgroundColor: "#babab6",
                    tabBarLabel: Languages[code].actions,
                    headerTitleAlign: 'center',
                    tabBarLabelStyle: { color: Colors.textColor },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="menu" color={Colors.buttonColor} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
function Navs() {
    const { code } = React.useContext(LanguageContext);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                <Stack.Screen name="Home" options={{ headerShown: false }} component={MainTabs} />
                <Stack.Screen name="Users" options={{ title: Languages[code].users }} component={UserLit} />
                <Stack.Screen name="User" options={{ title: Languages[code].user }} component={User} />
                <Stack.Screen name="Database" options={{ title: Languages[code].database }} component={DBScreen} />
                <Stack.Screen name="Credit" options={{ title: Languages[code].credit }} component={RemainHistoryScreen} />
                <Stack.Screen name="Report" component={MonthlyReport} />
                <Stack.Screen name="UserGroups" options={{ title: Languages[code].userGroups }} component={UserGroupList} />
                <Stack.Screen name="UserGroup" options={{ title: Languages[code].userGroup }} component={UserGroup} />
                <Stack.Screen name="AddUserGroup" options={{ title: Languages[code].addUserGroup }} component={AddUserGroup} />
                <Stack.Screen name="Meter" options={{ title: Languages[code].meter }} component={Meter} />
                <Stack.Screen name="Language" options={{ title: Languages[code].language }} component={LanguageSetting} />
                <Stack.Screen name="Export" options={{ title: Languages[code].exportDatabase }} component={ExportDBscreen} />
                <Stack.Screen name="Import" options={{ title: Languages[code].importDatabase }} component={ImportDBScreen} />
                <Stack.Screen name="GoogleDrive" component={GoogleDrive} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default function App() {
    React.useEffect(() => {
        InitializeDB((success) => {
            let msg = "connection success";
            if (!success) {
                msg = "connection failed"
            }
            ToastAndroid.showWithGravity(
                msg,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        });
    }, [])
    return (
        <Provider store={store}>
            <LanguageProvider>
                <Navs />
            </LanguageProvider>
        </Provider >

    );
}