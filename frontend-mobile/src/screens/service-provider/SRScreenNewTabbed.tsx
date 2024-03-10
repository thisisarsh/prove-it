import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import Text from '../../components/Text';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { useAuthContext } from "../../hooks/useAuthContext";
import { ServiceRequestSP } from "../../../types";
import {config} from "../../../config";

const SERVER_URL = config.SERVER_URL;

type TicketItemProps = {
    item: ServiceRequestSP;
    onDetailClick: (id: string) => void;
    onQuoteClick: (id: string) => void;
    onWithdrawClick: (id: string) => void;
};
const TicketItem: React.FC<TicketItemProps> = ({ item, onDetailClick, onQuoteClick, onWithdrawClick }) => {
    const handleActionClick = () => {
        if (item.status === 'initiated') {
            onQuoteClick(item.id);
        } else {
            onWithdrawClick(item.id);
        }
    };

    return (
        <View style={styles.ticketRow}>
            <Text style={styles.ticketCell}>{item.serviceType?.serviceType || 'NULL'}</Text>
            <Text style={styles.ticketCell}>{item.property.name}</Text>
            <View style={styles.ticketCell}>
                <TouchableOpacity onPress={() => onDetailClick(item.id)} style={styles.button}>
                    <Text>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleActionClick} style={[styles.button, item.status === 'initiated' ? {} : styles.buttonSecondary]}>
                    <Text>{item.status === 'initiated' ? 'Quote' : 'Withdraw'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;

    const [tickets, setTickets] = useState<ServiceRequestSP[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/sp-service-requests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            const updatedTickets = data.data.map((ticket: ServiceRequestSP) => ({
                ...ticket,
                serviceType: ticket.serviceType || "NULL"
            }));
            setTickets(updatedTickets);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [user])
    );

    // TODO: Implement handleTicketDetailClick, handleWithdrawClick, and handleQuoteClick
    // Implement navigation or modal display as needed.
    const handleTicketDetailClick = (id: string) => {
        console.log('Detail Clicked', id);
        // Implement navigation or action
    };

    const handleWithdrawClick = (id: string) => {
        console.log('Withdraw Clicked', id);
        // Implement action
    };

    const handleQuoteClick = (id: string) => {
        console.log('Quote Clicked', id);
        // Implement action
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>New Tickets</Text>
            <FlatList
                data={tickets?.filter(t => t.status === "initiated" || t.status === "submitted")}
                renderItem={({ item }) => (
                    <TicketItem
                        item={item}
                        onDetailClick={handleTicketDetailClick}
                        onQuoteClick={handleQuoteClick}
                        onWithdrawClick={handleWithdrawClick}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    headerCell: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    ticketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    ticketCell: {
        flex: 1,
        textAlign: 'center',
    },
    button: {
        marginHorizontal: 5,
        padding: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    buttonSecondary: {
        backgroundColor: 'maroon',
    },
});

export default ServiceRequests;
