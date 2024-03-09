import React, { useState, useEffect } from 'react';
import '../styles/components/homie.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../hooks/useAuthContext";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface IMessage {
    id: number;
    text: string;
    sender: string;
}

interface IRasaResponse {
    recipient_id: string;
    text: string;
}

interface HomieProps {
    propertyId: string;
}

const Homie = ({ propertyId }: HomieProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isThinking, setIsThinking] = useState<boolean>(false);

    const { state } = useAuthContext();
    const { user } = state;

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setUserInput(transcript);
        }
    }, [transcript]);


    const startDictation = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopDictation = () => {
        SpeechRecognition.stopListening();
    };

    const toggleChatbot = () => setIsOpen(!isOpen);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const messageToSend = userInput.trim();
        if (!messageToSend) return;

        setUserInput('');
        setIsThinking(true);

        const userId = user?.token;
        const userMessage: IMessage = { id: messages.length + 1, text: messageToSend, sender: userId || 'unknown' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setTimeout(async () => {
            try {
                const response = await fetch(`${window.config.SERVER_URL}/chat-response`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender: userId,
                        message: messageToSend,
                        metadata: { propertyId: propertyId },
                    }),
                });

                const responseData: IRasaResponse[] = await response.json();
                responseData.forEach((botMessage) => {
                    setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, text: botMessage.text, sender: 'bot' }]);
                });
            } catch (error) {
                console.error('Error sending message to Rasa:', error);
            } finally {
                setIsThinking(false); // Hide thinking indicator
            }
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (listening) {
            stopDictation();
        }
        setUserInput(e.target.value);
    };

    return (
        <div className="chatbot-container">
            {!isOpen ?
                <button className="chatbot-toggle" onClick={toggleChatbot}>
                <FontAwesomeIcon icon={faComments} />
            </button>: null}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chat-header">
                        <h2>Homie</h2>
                        <button className="close-chat" onClick={toggleChatbot}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-message ${msg.sender !== 'bot' ? 'user-message' : 'bot-message'}`}>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="chat-message bot-message bot-thinking">
                                <div className="message-text">...</div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="message-form">
                        <input type="text" value={userInput} onChange={handleChange} className="message-input" placeholder="Type or speak"/>
                        {browserSupportsSpeechRecognition ? <><button type="button" onClick={startDictation} disabled={listening}>Start</button>
                        <button type="button" onClick={stopDictation} disabled={!listening}>Stop</button></>: null}
                        <button type="submit" className="send-button">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Homie;
