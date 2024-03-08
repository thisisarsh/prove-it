import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropertyListScreen from '../screens/homeowner/PropertyListScreen';
import HomeownerProfileScreen from '../screens/homeowner/TenantListScreen';

const Tab = createBottomTabNavigator();

const HomeownerTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="HOProperties" component={PropertyListScreen} />
            <Tab.Screen name="HOProfile" component={HomeownerProfileScreen} />
        </Tab.Navigator>
    );
};

export default HomeownerTabNavigator;
