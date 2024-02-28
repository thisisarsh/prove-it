import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Text from '../../components/Text';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { useAuthContext } from "../../hooks/useAuthContext";
import { ServiceRequest } from "../../../types";
import {config} from "../../../config";
import {RefreshControl} from "react-native-gesture-handler";

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
        <View style={styles.container}>
            <Text style={styles.header}>Tickets:</Text>
            <FlatList
                data={tickets?.filter(t => ['withdrawn', 'rejected', 'completed'].includes(t.status))}
                renderItem={({ item }) => (
                    <TicketItem
                        item={item}
                        onDetailClick={handleTicketDetailClick}
                    />
                )}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={loadData} />
                }
            />
        </View>
    );
};

const TicketItem: React.FC<TicketItemProps> = ({ item, onDetailClick }) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{item.serviceType.serviceType}</Text>
        <Text style={item.status === "completed" ? styles.statusCompleted : styles.statusDanger}>
            {item.status.toUpperCase()}
        </Text>
        <View style={styles.actions}>
            <TouchableOpacity onPress={() => onDetailClick(item.id)} style={styles.button}>
                <Text>Details</Text>
            </TouchableOpacity>
        </View>
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
});

export default ServiceRequests;
