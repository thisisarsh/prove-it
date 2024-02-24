import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DashboardOwner() {

    // TODO: Create tabbed menu for owner
    // Menu Items: Dashboard, Properties, Tenants

    // TODO: Create a drawer menu for owner
    // Menu Items: Profile, Settings, Logout

    return (
        <View style={styles.container}>
            <Text>DashboardOwner</Text>
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

export default DashboardOwner;