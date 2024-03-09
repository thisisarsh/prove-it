import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import HomeownerDrawerNavigator from "./HODrawerNavigator";
import TenantDrawerNavigator from "./TenantDrawerNavigator";
import SPDrawerNavigator from "./SPDrawerNavigator";
import ServiceRequest from "../screens/tenant/ServiceRequest";
import Homie from "../screens/tenant/Homie";

export type AppStackParamList = {
    Home: undefined;
    Login: undefined;
    HomeownerDashboard: undefined;
    TenantDashboard: undefined;
    SPDashboard: undefined;
    TenantServiceRequest: undefined;
    Homie: { propertyId: string | null };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="Home" component={Home} options={{gestureEnabled: false}} />
            <Stack.Screen name="Login" component={Login} options={{gestureEnabled: false}} />
            <Stack.Screen name="HomeownerDashboard" component={HomeownerDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TenantDashboard" component={TenantDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="SPDashboard" component={SPDrawerNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TenantServiceRequest" component={ServiceRequest} options={{ headerShown: true, headerBackTitle: "Back"}}/>
            <Stack.Screen name="Homie" component={Homie} initialParams={{ propertyId: null }} options={{ headerShown: true, headerBackTitle: "Back" }}/>
        </Stack.Navigator>
    );
}

export default AppNavigator;
