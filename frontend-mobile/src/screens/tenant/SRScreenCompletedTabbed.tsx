import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { NavigationProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from "react-native-gesture-handler";
import { FontAwesome6 } from '@expo/vector-icons';

import Text from '../../components/Text';
import ButtonPrimary from '../../components/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary';
import { useAuthContext } from "../../hooks/useAuthContext";
import { ServiceRequest } from "../../../types";
import {config} from "../../../config";

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

type TicketItemProps = {
    item: ServiceRequest;
    onDetailClick: (id: string) => void;
};

const SERVER_URL = config.SERVER_URL;

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;

    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [user])
    );

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = () => {
        setIsLoading(true);
        if (user) {
            fetch(`${SERVER_URL}/tenant/service-requests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
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
                    setTickets(data.data.serviceRequests);
                })
                .catch((error) => {
                    console.error("Error fetching data: ", error);
                });
        }
    }

    const handleTicketDetailClick = (id: string) => {
        console.log('Detail Clicked', id);
        // navigation.navigate('TicketDetail', { ticketId: id });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Completed Tickets</Text>
            <View style={styles.listContainer}>
                {isLoading ? (
                    <Text>Loading Tickets...</Text>
                ) : (
                    tickets?.map((item: ServiceRequest) => (
                        <View key={item.id}>
                            <TicketItem
                                item={item}
                                onDetailClick={handleTicketDetailClick}
                            />
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const TicketItem: React.FC<TicketItemProps> = ({ item, onDetailClick }) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{item.serviceType.serviceType}</Text>

        {/*
        <Text style={item.status === "completed" ? styles.statusCompleted : styles.statusDanger}>
            {item.status.toUpperCase()}
        </Text>
        */}

        <ButtonPrimary title={<FontAwesome6 name='magnifying-glass' color='white' />} onPress={() => {onDetailClick(item.id)}}></ButtonPrimary>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    cell: {
        flex: 1,
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
    withdrawButton: {
        // Needs style
    },
    statusCompleted: {
        // Needs style
    },
    statusDanger: {
        // Needs style
    },
    listContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'lightgray',
        borderStyle: 'solid',
        borderColor: 'black',
        borderCurve: 'circular',
        borderWidth: 1,
        borderRadius: 10,
    },
});

export default ServiceRequests;
