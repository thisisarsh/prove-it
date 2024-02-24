import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
    title: string; // Explicitly defining title as a string
    onPress: (event: GestureResponderEvent) => void; // Define the type for your onPress function
}
const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontFamily: 'Montserrat-Regular',
        color: 'white',
        textAlign: 'center',
    },
});

export default CustomButton;
