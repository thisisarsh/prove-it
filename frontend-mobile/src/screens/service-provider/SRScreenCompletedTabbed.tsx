import React, { useState } from "react";
import {ActivityIndicator, Button, FlatList, Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import Text from '../../components/Text';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { useAuthContext } from "../../hooks/useAuthContext";
import {Job } from "../../../types";
import {config} from "../../../config";

const SERVER_URL = config.SERVER_URL;

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;

    const [isLoading, setIsLoading] = useState(false);

    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

    const [showJobDetail, setShowJobDetail] = useState<boolean>(false);
    const [jobDetail, setJobDetail] = useState<Job | undefined>(undefined);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/completed-jobs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            if (data.data.jobs) setCompletedJobs(data.data.jobs);
            else setCompletedJobs([]);
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

    const handleJobDetailClick = (id: string) => {
        const job = completedJobs.find((obj) => obj.id === id);
        setJobDetail(job);
        setShowJobDetail(true);
    };

    const handleCloseJobDetail = () => {
        setJobDetail(undefined);
        setShowJobDetail(false);
    };

    const renderJobItem = ({ item }: { item: Job }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.initiator.firstName + " " + item.initiator.lastName}</Text>
            <Text style={styles.cell}>{item.serviceType.serviceType}</Text>
            <Text style={styles.cell}>{item.property.streetAddress}</Text>
            <View style={styles.cell}>
                <TouchableOpacity style={styles.button} onPress={() => handleJobDetailClick(item.id)} disabled={isLoading}>
                    <Text>Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Completed Jobs</Text>
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : completedJobs.length > 0 ? (
                    <FlatList
                        data={completedJobs}
                        renderItem={renderJobItem}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <Text>You're not working on any service Request! Accept one to get started.</Text>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showJobDetail}
                    onRequestClose={handleCloseJobDetail}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Job Details</Text>
                        {jobDetail != null ? (
                            <>
                                <Text style={styles.modalText}>Activity Status: {jobDetail.activityStatus}</Text>
                                <Text style={styles.modalText}>Service Request: {jobDetail.serviceType.serviceType}</Text>
                                <Text style={styles.modalText}>Description: {jobDetail.proposal.detail}</Text>
                                <Text style={styles.modalText}>Address: {jobDetail.property.streetAddress}</Text>
                                <Text style={styles.modalText}>Request Date: ${jobDetail.proposal.quotePrice} ({jobDetail.proposal.quoteType})</Text>
                                <Text style={styles.modalText}>Request Timeline: {jobDetail.timeline.title}</Text>
                            </>
                        ) : (
                            <Text>No details available.</Text>
                        )}
                        <Button title="Close" onPress={handleCloseJobDetail} />
                    </View>
                </Modal>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cell: {
        margin: 5,
        flex: 1,
    },
    button: {
        marginVertical: 5,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
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
