import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/tenant/HomeScreenTabbed";
import SRScreenActive from "../screens/tenant/SRScreenActiveTabbed";
import SRScreenCompleted from '../screens/tenant/SRScreenCompletedTabbed';

const Tab = createBottomTabNavigator();

const TenantTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="TenantHome" component={HomeScreen} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="TenantServiceRequestsActive" component={SRScreenActive} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="TenantServiceRequestsCompleted" component={SRScreenCompleted} options={{
                headerShown: false
            }}/>
        </Tab.Navigator>
    );
};

export default TenantTabNavigator;
