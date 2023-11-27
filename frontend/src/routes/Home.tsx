import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import proveitLogo from "../assets/prove-it-logo-200.png"; 
import htLogo from "../assets/ht-logo.svg";
import htFullAppsetGraphic from "../assets/ht-appset-full.png";
import '../styles/homepage.css';

/**
 * Home page
 * "/"
 */
export function Home() {
    const navigate = useNavigate();

    const handleLogIn = () => {
        navigate("/login");
    };

    const handleSignUp = () => {
        navigate("/SignUp");
    };

    return (
        <>
            <div className="homepage-logo-container">
                <a href="https://hometrumpeter.com/">
                    <img 
                        src={htLogo}
                        className="homepage-ht-logo"
                    />
                </a>
                <img
                    src={proveitLogo}
                    className="homepage-proveit-logo"
                />
            </div>

            <hr/>

            <div className="homepage-main-container">
                <div className="homepage-main-left">
                    <p>Prove IT by HomeTrumpeter works for you to make property management easier!</p>
                    <img
                        src={htFullAppsetGraphic}
                        className="homepage-graphic"
                    />
                </div>
                <div className="homepage-main-right">
                    <p>Ready to get started?</p>
                    <Button type="button" className="homepage-action-button" onClick={handleLogIn}>Log in</Button>
                    <Button type="button" className="homepage-action-button" onClick={handleSignUp}>Sign up</Button>
                </div>
            </div>
            
            <div className="homepage-footer">
                <div className="footer-links">
                    <div className="footer-link-group">
                    <a onClick={handleLogIn}>Log in</a>
                    <a onClick={handleSignUp}>Sign up</a>
                    </div>

                    <a href="https://google.com">About Us</a>
                    <a href="https://hometrumpeter.com/">HomeTrumpeter</a>
                </div>
            </div>
        </>
    );
}
