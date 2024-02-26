import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React from "react";

type SettingsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Settings</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Settings;