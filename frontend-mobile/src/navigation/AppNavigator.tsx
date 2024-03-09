import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import HomeownerDrawerNavigator from "./HODrawerNavigator";
import TenantDrawerNavigator from "./TenantDrawerNavigator";
import ServiceRequest from "../screens/tenant/ServiceRequest";
// import ServiceProviderDrawerNavigator from "./SPDrawerNavigator";


const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeownerDashboard" component={HomeownerDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TenantDashboard" component={TenantDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TenantServiceRequest" component={ServiceRequest}/>
            {/*<Stack.Screen name="ServiceProviderDashboard" component={ServiceProviderDrawerNavigator} />*/}
        </Stack.Navigator>
    );
}

export default AppNavigator;
