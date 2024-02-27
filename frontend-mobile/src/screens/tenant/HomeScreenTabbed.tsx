import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, {useEffect, useState} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {useAuthContext} from "../../hooks/useAuthContext";
import {TenantProperty} from "../../../types";

type HomeProps = {
    navigation: NavigationProp<ParamListBase>;
};

const Drawer = createDrawerNavigator();
const SERVER_URL = process.env.SERVER_URL;

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {

    const { state } = useAuthContext();
    const { user } = state;

    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<TenantProperty[] | null>(null);

    const [propertyID, setPropertyID] = useState<string>("");

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            fetch(SERVER_URL + "/properties-tenant" + "?tenantId=" + user.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsLoading(false);
                    setProperties(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });
        }
    });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Property: </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default HomeScreen;