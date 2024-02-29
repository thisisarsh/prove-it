import {View, StyleSheet } from "react-native";
import Text from '../../components/Text';

function TenantsList() {
    return (
        <View style={styles.container}>
            <Text>Tenant List</Text>
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
export default TenantsList;