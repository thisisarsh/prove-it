import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, FlatList, SectionList, ScrollView } from 'react-native';
import Text from '../../components/Text';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../hooks/useAuthContext';

import { Property, PropertyDetail, ServiceRequest, TenantinPropertyDetail } from '../../../types';

import {config} from "../../../config";

import { SIZES } from '../../components/Theme';
import ButtonPrimary from '../../components/ButtonPrimary';

const serverAddress = config.SERVER_URL;

type PropertyItemProps = {
    item: Property;
};

const PropertiesTable = () => {
    const { state } = useAuthContext();
    const { user } = state;
    const [isLoading, setIsLoading] = useState(false);

    const [properties, setProperties] = useState<Property[] | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);
    const [propertyDetail, setPropertyDetail] = useState<PropertyDetail | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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
    }, [user?.token, update]);

    useEffect(() => {
        if(tickets === null) {
            setIsLoading(true);
            fetch(serverAddress + '/ticket/manager/tickets', {
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
                    setTickets(data);
                })
                .catch((error) => {
                    console.error("Error fetching tickets data: " + error);
                });
        }
    }, [user?.token, update]);

    const handleDelete = (item: Property) => {
        // Implement delete functionality
    };

    const handleDetails = (property: Property) => {
        fetch(serverAddress + "/get-property-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ id: property.id }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    setPropertyDetail(responseJson);
                } else if (!responseJson.isSuccess) {
                    console.log(responseJson);
                }
            })
            .then(() => {
                setModalVisible(true);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    };

    const handleTenant = (item: Property) => {
        // Implement tenant functionality
    };

    const PropertyItem:React.FC<PropertyItemProps> = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.streetAddress}</Text>
            <View style={styles.actions}>
                <ButtonPrimary title='Details' onPress={() => handleDetails(item)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            <ScrollView>
                <Text style={styles.header}>Properties</Text>

                <View style={styles.propertyContainer}>
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <SectionList
                                sections={[
                                    {
                                        title: propertyDetail?.name,
                                        data: [
                                            "Address: " + propertyDetail?.streetAddress,
                                            "County: " + propertyDetail?.countyName,
                                            "City: " + propertyDetail?.cityName,
                                            "State: " + propertyDetail?.stateName,
                                            "Zip code: " + propertyDetail?.zipcode,
                                            "Rent: $" + propertyDetail?.rent,
                                            "Property type: " + propertyDetail?.propertyType,
                                        ]
                                    }
                                ]}
                                renderItem={({ item }) => <Text style={styles.sectionItem}>{item}</Text>}
                                renderSectionHeader={({section}) => (
                                    <Text style={styles.sectionHeader}>{section.title}</Text>
                                  )}
                            />

                            <ButtonPrimary
                                title='Close'
                                onPress={() => setModalVisible(!modalVisible)}>
                            </ButtonPrimary>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        padding: 10,
    },
    propertyContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'lightgray',
        borderStyle: 'solid',
        borderColor: 'black',
        borderCurve: 'circular',
        borderWidth: 1,
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    cell: {
        flex: 1,
        fontSize: SIZES.p,
    },
    actions: {
        flexDirection: 'row',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    sectionHeader: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        marginBottom: 20
    },
    sectionItem: {
        fontSize: SIZES.p,
        marginBottom: 10
    }
});

export default PropertiesTable;
