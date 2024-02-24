import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../hooks/useAuthContext';

// Assuming Property, PropertyDetail, ServiceRequest, TenantinPropertyDetail types are defined in "../../../types"
import { Property } from '../../../types';

const serverAddress = 'http://localhost:8080';

type PropertyItemProps = {
    item: Property;
};

const PropertiesTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<Property[] | null>(null);
    const { state } = useAuthContext();
    const { user } = state;
    const navigation = useNavigation();

    useEffect(() => {
        setIsLoading(true);
        fetch(serverAddress + '/properties-owner', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setProperties(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [user?.token]);

    const handleDelete = (item: Property) => {
        // Implement delete functionality
    };

    const handleDetails = (item: Property) => {
        // Implement details functionality
    };

    const handleTenant = (item: Property) => {
        // Implement tenant functionality
    };

    const PropertyItem:React.FC<PropertyItemProps> = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.streetAddress}</Text>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.button}>
                    <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDetails(item)} style={styles.button}>
                    <Text>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTenant(item)} style={styles.button}>
                    <Text>Tenant</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Properties</Text>
            {isLoading ? (
                <Text>Loading Properties...</Text>
            ) : (
                <FlatList
                    data={properties}
                    renderItem={({ item }) => <PropertyItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

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
});

export default PropertiesTable;
