import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeownerTabNavigator from './HOTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { COLOURS } from '../components/Theme';

const Drawer = createDrawerNavigator();
const screenOptions = {
    headerStyle: {backgroundColor: COLOURS.blue,},
    headerTitleStyle: {color: 'white', fontFamily: 'Montserrat-Regular'},
    headerTintColor: 'white',
    drawerActiveTintColor: COLOURS.blue,
    drawerInactiveTintColor: 'gray',
}

const HomeownerDrawerNavigator = () => {
    return (
        <Drawer.Navigator screenOptions={screenOptions}>
            <Drawer.Screen name="HOHomeTabs" component={HomeownerTabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
};

export default HomeownerDrawerNavigator;
