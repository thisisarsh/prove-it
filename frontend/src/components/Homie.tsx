import React, { useState } from 'react';
import '../styles/components/homie.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../hooks/useAuthContext";

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

const Homie = ( {propertyId}: HomieProps ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');

    const { state } = useAuthContext();
    const { user } = state;

    const toggleChatbot = () => setIsOpen(!isOpen);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const message = userInput;
        setUserInput('');

        const userId = user?.token;

        const userMessage: IMessage = { id: messages.length + 1, text: message, sender: userId || 'unknown' };
        setMessages((messages: IMessage[]) => [...messages, userMessage]);

        try {
            const response = await fetch(window.config.SERVER_URL + "/chat-response", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: userId,
                    message: message,
                    metadata: {
                        propertyId: propertyId,
                    }
                }),
            });

            const responseData: IRasaResponse[] = await response.json();

            responseData.forEach((botMessage: IRasaResponse, index: number) => {
                setMessages((messages: IMessage[]) => [...messages, { id: messages.length + 1 + index, text: botMessage.text, sender: 'bot' }]);
            });
        } catch (error) {
            console.error('Error sending message to Rasa:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="chatbot-container">
            <button className="chatbot-toggle" onClick={toggleChatbot}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faComments} />
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-message ${msg.sender !== 'bot' ? 'user-message' : 'bot-message'}`}>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="message-form">
                        <input type="text" value={userInput} onChange={handleChange} className="message-input" />
                        <button type="submit" className="send-button">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Homie;
