import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeownerTabNavigator from './HOTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import {Button, View} from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type HomeProps = {
    navigation: NavigationProp<ParamListBase>;
};

const Drawer = createDrawerNavigator();

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                onPress={() => navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        </View>
    );
}
const HomeownerDrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="HomeTabs" component={HomeownerTabNavigator} options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
};

export default HomeownerDrawerNavigator;
