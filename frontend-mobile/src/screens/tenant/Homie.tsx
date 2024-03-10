import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {useAuthContext} from "../../hooks/useAuthContext";
import {config} from "../../../config";
import {RouteProp} from '@react-navigation/native';
import { AppStackParamList } from "../../navigation/AppNavigator";

const SERVER_URL = config.SERVER_URL;

interface HomieProps {
    route: RouteProp<AppStackParamList, 'Homie'>;
}
interface IMessage {
    id: number;
    text: string;
    sender: string;
}

interface IRasaResponse {
    recipient_id: string;
    text: string;
}
const Homie:React.FC<HomieProps> = ({ route}) => {

    const { propertyId } = route.params;
    console.log("Property ID: ", propertyId)

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [userInput, setUserInput] = useState<string>("");
    const [isThinking, setIsThinking] = useState<boolean>(false);

    const {state} = useAuthContext();
    const {user} = state;

    const handleSubmit = async () => {
        const messageToSend = userInput.trim();
        if (!messageToSend) return;

        setUserInput("");
        setIsThinking(true);

        const userId = user?.token;
        const userMessage: IMessage = {
            id: messages.length + 1,
            text: messageToSend,
            sender: userId || "unknown",
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setTimeout(async () => {
            try {
                const response = await fetch(
                    `${SERVER_URL}/chat-response`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            sender: userId,
                            message: messageToSend,
                            metadata: { propertyId: propertyId },
                        }),
                    },
                );

                const responseData: IRasaResponse[] = await response.json();
                responseData.forEach((botMessage) => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: prevMessages.length + 1,
                            text: botMessage.text,
                            sender: "bot",
                        },
                    ]);
                });
            } catch (error) {
                console.error("Error sending message to Rasa:", error);
            } finally {
                setIsThinking(false);
            }
        }, 2000);
    };

    const handleChange = (text: string) => {
        setUserInput(text);
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
                <ScrollView style={styles.messagesContainer}>
                    {messages.map((msg) => (
                        <View key={msg.id} style={[styles.messageBubble, msg.sender !== 'bot' ? styles.sent : styles.received]}>
                            <Text style={styles.text} >{msg.text}</Text>
                        </View>
                    ))}
                    {isThinking && (
                        <View style={[styles.messageBubble, styles.received]}>
                            <Text>...</Text>
                        </View>
                    )}
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={userInput}
                        onChangeText={handleChange}
                        style={styles.input}
                        placeholder="Type or speak"
                    />
                    {/*{browserSupportsSpeechRecognition && (*/}
                    {/*    <>*/}
                    {/*        <TouchableOpacity onPress={startDictation} disabled={listening} style={styles.button}>*/}
                    {/*            <Text>Start</Text>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*        <TouchableOpacity onPress={stopDictation} disabled={!listening} style={styles.button}>*/}
                    {/*            <Text>Stop</Text>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </>*/}
                    {/*)}*/}
                    <TouchableOpacity onPress={handleSubmit} style={styles.sendButton}>
                        <Text style={styles.text}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
    },
    sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
    },
    received: {
        alignSelf: 'flex-start',
        backgroundColor: '#ebebeb',
    },
    inputContainer: {
        minHeight: 100,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        padding: 10,
    },
    button: {
        marginHorizontal: 4,
        padding: 8,
        backgroundColor: 'lightgrey',
        borderRadius: 4,
    },
    text: {
        fontSize: 22,
}
});

export default Homie;
