import { useSetRole } from "../hooks/useSetRole";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

export function SetRole() {
    const { setRole, isLoading, error } = useSetRole();

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const handleOptionClick = async (roleSelection: string) => {
        await setRole(roleSelection);
        if (error) {
            handleShowMessageModal(error);
        }
    };

    const ModalContent = (
        <Modal
            show={showMessageModal}
            onHide={() => setShowMessageModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{modalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShowMessageModal(false)}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div className="select-role-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <div className="role-cluster-container">
            <div className="info-message">
                <h2>Welcome to HomeTrumpeter!</h2>
                <p>What is your role in property management?</p>
            </div>

            {isLoading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="button-options-container">
                    <div className="button-option-group">
                        <Button
                            className="standard-button"
                            onClick={() => handleOptionClick("owner")}
                        >
                            Homeowner
                        </Button>
                        <div className="option-description">
                            I own my own home
                        </div>
                    </div>

                    <div className="button-option-group">
                        <Button
                            className="standard-button"
                            onClick={() => handleOptionClick("manager")}
                        >
                            Manager
                        </Button>
                        <div className="option-description">
                            I manage properties on behalf of others
                        </div>
                    </div>
                </div>
            )}
            </div>
            {ModalContent}
        </div>
    );
}
