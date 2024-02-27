import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React from "react";

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
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
export default ServiceRequests;