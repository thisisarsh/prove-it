import React from 'react';
import { View, Image, StyleSheet, ScrollView, Linking, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Text from '../components/Text';
import Footer from '../components/Footer';

import proveitLogo from '../../assets/prove-it-logo-200.png';
import htAppsetFull from '../../assets/ht-appset-full.png';
import CustomButton from "../components/CustomButton";
import { COLOURS, SIZES, FONTWEIGHT } from '../components/Theme';

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

            <ScrollView>

                <View style={styles.logoContainer}>
                    <Image source={proveitLogo} style={styles.logo} />
                    <Text style={[styles.text, {fontSize: SIZES.h1, marginTop: 0, letterSpacing: 4}]}>Prove IT</Text>
                    <Text style={[styles.text, {fontSize: SIZES.p, textAlign: 'center'}]}>
                        Prove IT by HomeTrumpeter works for you to make property management easier!
                    </Text>
                </View>

                <View style={styles.hr} />

                <View style={styles.mainContainer}>
                    <Text style={styles.text}>Ready to get started?</Text>
                    <CustomButton title="Log in" onPress={handleLogIn} />
                    <CustomButton title="Sign up" onPress={handleSignUp} />
                </View>

            </ScrollView>
            <Footer>
                <Text style={{color:'white'}} onPress={() => Linking.openURL('https://hometrumpeter.com/')}>HomeTrumpeter LLC</Text>
            </Footer>
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: '20%'
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
    },
    hr: {
        height: 1,
        backgroundColor: 'black',
        width: '100%',
        marginVertical: 20,
    },
    mainContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: '10%',
        marginBottom: '10%',
    },
    graphic: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },

    footerText: {
        color: 'white'
    }
});

export default Home;