import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/tenant/HomeScreenTabbed";
import SRScreen from '../screens/tenant/SRScreenTabbed';

const Tab = createBottomTabNavigator();

const TenantTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="TenantHome" component={HomeScreen} />
            <Tab.Screen name="TenantServiceRequests" component={SRScreen} />
        </Tab.Navigator>
    );
};

export default TenantTabNavigator;
