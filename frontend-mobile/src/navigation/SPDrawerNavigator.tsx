import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SPTabNavigator from './SPTabNavigator';
import SPServices from '../screens/service-provider/SPServices';
import SettingsScreen from '../screens/Settings';

const Drawer = createDrawerNavigator();

const ServiceProviderDrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="SPHomeTabs" component={SPTabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="SPServices" component={SPServices} options={{ title: 'My Services' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
};

export default ServiceProviderDrawerNavigator;
