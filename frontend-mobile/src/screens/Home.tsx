import React from 'react';
import { View, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Text from '../components/Text';
import customButton from "../components/CustomButton";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


import proveitLogo from '../../assets/prove-it-logo-200.png';
import htLogo from '../../assets/ht-logo.svg';
import htFullAppsetGraphic from '../../assets/ht-appset-full.png';
import CustomButton from "../components/CustomButton";

type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

type NavigationType = StackNavigationProp<RootStackParamList, 'Login'>;

function Home() {
    const navigation = useNavigation<NavigationType>();

    const handleLogIn = () => {
        navigation.navigate("Login");
    };

    // TODO: Set up SIGN UP page
    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={() => {}}>
                    <Image source={htLogo} style={styles.logo} />
                </TouchableOpacity>
                <Image source={proveitLogo} style={styles.logo} />
            </View>

            <View style={styles.hr} />

            <View style={styles.mainContainer}>
                <View style={styles.mainLeft}>
                    <Text>
                        Prove IT by HomeTrumpeter works for you to make property management easier!
                    </Text>
                    <Image source={htFullAppsetGraphic} style={styles.graphic} />
                </View>
                <View style={styles.mainRight}>
                    <Text>Ready to get started?</Text>
                    <CustomButton title="Log in" onPress={handleLogIn} />
                    <CustomButton title="Sign up" onPress={handleSignUp} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    hr: {
        height: 1,
        backgroundColor: 'gray',
        width: '80%',
        marginVertical: 20,
    },
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mainLeft: {
        flex: 1,
        alignItems: 'center',
    },
    mainRight: {
        flex: 1,
        alignItems: 'center',
    },
    graphic: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

export default Home;