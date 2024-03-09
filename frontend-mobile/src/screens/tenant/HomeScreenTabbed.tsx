import {View, StyleSheet, TouchableOpacity} from "react-native";
import Text from "../../components/Text"
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, {useEffect, useState} from "react";
import {useAuthContext} from "../../hooks/useAuthContext";
import {TenantProperty} from "../../../types";
import {config} from "../../../config";

type HomeProps = {
    navigation: NavigationProp<ParamListBase>;
};

const SERVER_URL = config.SERVER_URL;

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {

    const { state } = useAuthContext();
    const { user } = state;

    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<TenantProperty[] | null>(null);

    const newServiceRequest = (propertyName: string | null) => {

    }

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
    }, [user]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Property: </Text>
            <Text>{properties ? properties[0].name : null}</Text>
            <Text>{properties ? properties[0].streetAddress: null}</Text>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate("TenantServiceRequest")} style={styles.button}>
                    <Text>New Service Request</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate("Homie", {propertyId: properties ? properties[0].id : null})} style={styles.button}>
                    <Text>Chat with homie</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
    },
    button: {
        marginLeft: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 4,
    },
});
export default HomeScreen;