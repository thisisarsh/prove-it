import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Modal, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import Text from '../../components/Text';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { useAuthContext } from "../../hooks/useAuthContext";
import { ServiceRequestSP } from "../../../types";
import {config} from "../../../config";

const SERVER_URL = config.SERVER_URL;

type TicketItemProps = {
    item: ServiceRequestSP;
    onDetailClick: (id: string) => void;
    //onQuoteClick: (id: string) => void;
    onWithdrawClick: (id: string) => void;
};
const TicketItem: React.FC<TicketItemProps> = ({ item, onDetailClick, /*onQuoteClick,*/ onWithdrawClick }) => {
    const handleActionClick = () => {
        if (item.status === 'initiated') {
            //onQuoteClick(item.id);
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
                {/*<TouchableOpacity onPress={handleActionClick} style={[styles.button, item.status === 'initiated' ? {} : styles.buttonSecondary]}>
                    <Text>{item.status === 'initiated' ? 'Quote' : 'Withdraw'}</Text>
                </TouchableOpacity>*/}
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
    const [ticketDetail, setTicketDetail] = useState<ServiceRequestSP | undefined>(undefined);
    const [showTicketDetail, setShowTicketDetail] = useState<boolean>(false);
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
        if (tickets != null) {
            const ticket = tickets.find((obj) => obj.id === id);
            setTicketDetail(ticket);
            setShowTicketDetail(true);
        }
    };

    const handleCloseTicketDetail = () => {
        setTicketDetail(undefined);
        setShowTicketDetail(false);
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
                        //onQuoteClick={handleQuoteClick}
                        onWithdrawClick={handleWithdrawClick}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
            />
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showTicketDetail}
                    onRequestClose={handleCloseTicketDetail}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Job Details</Text>
                        {ticketDetail != null ? (
                            <>
                                <Text style={styles.modalText}>Service Type: {ticketDetail.serviceType.serviceType}</Text>
                                <Text style={styles.modalText}>Property Name: {ticketDetail.property.name}</Text>
                                <Text style={styles.modalText}>Address: {ticketDetail.property.streetAddress}</Text>
                                <Text style={styles.modalText}>Request Date: {ticketDetail.createdAt}</Text>
                                <Text style={styles.modalText}>Request Timeline: {ticketDetail.timeline.title}</Text>
                                <Text style={styles.modalText}>Details: {ticketDetail.serviceRequest.detail}</Text>
                            </>
                        ) : (
                            <Text>No details available.</Text>
                        )}
                        <Button title="Close" onPress={handleCloseTicketDetail} />
                    </View>
                </Modal>
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
        alignItems: 'center'
    },
    buttonSecondary: {
        backgroundColor: 'maroon',
    },
    modalView: {
        top: "20%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        borderColor: '#007bff',
        borderWidth: 2,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 10, 
        fontSize: 15
    },
});

export default ServiceRequests;
