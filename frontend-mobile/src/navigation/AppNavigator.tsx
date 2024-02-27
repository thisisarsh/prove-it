import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import HomeownerDrawerNavigator from "./HODrawerNavigator";
import TenantDrawerNavigator from "./TenantDrawerNavigator";
// import ServiceProviderDrawerNavigator from "./SPDrawerNavigator";


const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeownerDashboard" component={HomeownerDrawerNavigator} />
            <Stack.Screen name="TenantDashboard" component={TenantDrawerNavigator} />
            {/*<Stack.Screen name="ServiceProviderDashboard" component={ServiceProviderDrawerNavigator} />*/}
        </Stack.Navigator>
    );
}

export default AppNavigator;
