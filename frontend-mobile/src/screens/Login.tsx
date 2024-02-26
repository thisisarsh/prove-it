import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useLogin } from "../hooks/useLogin";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, error, isLoading } = useLogin();
    const handleLogin = async () => {
        if (username && password) {
            await login(username, password);
            console.log("Error" + error);
            // if (remember && !error) {
            //     localStorage.setItem("user-email", email);
            // } else {
            //     localStorage.removeItem("user-email");
            // }
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>Welcome Back!</Text>
            <TextInput
                autoCapitalize={"none"}
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity>
                    <Text style={styles.footerText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.footerText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Montserrat-Regular',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontFamily: 'Montserrat-Regular',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        color: '#007bff',
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
    },
});

export default Login;