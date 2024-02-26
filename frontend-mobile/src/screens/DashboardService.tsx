import {View, Text, StyleSheet} from "react-native";

function DashboardService() {
    return (
        <View style={styles.container}>
            <Text>DashboardService</Text>
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

export default DashboardService;