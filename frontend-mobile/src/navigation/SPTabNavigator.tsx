import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SRScreenNew from "../screens/service-provider/SRScreenNewTabbed";
import SRScreenActive from "../screens/service-provider/SRScreenActiveTabbed";
import SRScreenCompleted from "../screens/service-provider/SRScreenCompletedTabbed";


const Tab = createBottomTabNavigator();

const ServiceProviderTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="SPServiceRequestsNew" component={SRScreenNew} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="SPServiceRequestsActive" component={SRScreenActive} options={{
                headerShown: false
            }}/>
            <Tab.Screen name="SPServiceRequestsCompleted" component={SRScreenCompleted} options={{
                headerShown: false
            }}/>
        </Tab.Navigator>
    );
};

export default ServiceProviderTabNavigator;
