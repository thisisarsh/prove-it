import React, { useEffect, useState } from "react";
import {StyleSheet, View} from "react-native";
import Text from '../../components/Text';
import {NavigationProp, ParamListBase, useFocusEffect} from '@react-navigation/native';
import { useAuthContext } from "../../hooks/useAuthContext";
import {Job } from "../../../types";
import {config} from "../../../config";
import JobList from "../../components/JobList";

const SERVER_URL = config.SERVER_URL;

type ServiceRequestsProps = {
    navigation: NavigationProp<ParamListBase>;
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ navigation }) => {
    const { state } = useAuthContext();
    const { user } = state;

    const [activeJobs, setActiveJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/active-jobs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setActiveJobs(data.data.jobs);
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

    // TODO: Implement handleActivateJob and handleCompleteJob
    const handleActivateJob = (jobId: string) => {
        setIsLoading(true);
    }

    const handleCompleteJob = (jobId: string) => {
        setIsLoading(true);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Completed Jobs</Text>
            <JobList
                jobs={activeJobs}
                activateJob={handleActivateJob}
                completeJob={handleCompleteJob}
                isLoading={isLoading}
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
    }
});

export default ServiceRequests;
