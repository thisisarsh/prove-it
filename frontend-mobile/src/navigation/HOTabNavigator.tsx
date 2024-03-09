import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropertyListScreen from '../screens/homeowner/PropertyListScreen';
import HomeownerProfileScreen from '../screens/homeowner/TenantListScreen';
import { FontAwesome6 } from '@expo/vector-icons';

import { SIZES, COLOURS, FONTWEIGHT } from '../components/Theme';

const Tab = createBottomTabNavigator();
const screenOptions = {
    headerStyle: {backgroundColor: COLOURS.blue,},
    headerTitleStyle: {color: 'white'},
    headerTintColor: 'white',
    drawerActiveTintColor: COLOURS.blue,
    drawerInactiveTintColor: 'gray',
}

const HomeownerTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={
                ({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Properties') {
                            iconName = 'building';
                        } else if (route.name === 'Profile') {
                            iconName = 'user';
                        }

                        // You can return any component that you like here!
                        return <FontAwesome6 name={iconName} size={24} color={color} />;
                    },
                    headerShown: false,
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {backgroundColor: COLOURS.blue},
                }
            )}
        >
            <Tab.Screen name="HOProperties" component={PropertyListScreen} />
            <Tab.Screen name="HOProfile" component={HomeownerProfileScreen} />
        </Tab.Navigator>
    );
};

export default HomeownerTabNavigator;
