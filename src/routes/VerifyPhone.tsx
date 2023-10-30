import { PhoneInputCluster } from "../components/PhoneInputCluster"

/**
 * Login page
 * "/login"
 */
export function VerifyPhone() {
  return (
    <div className="login-container">
      <img src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg" className="main-logo" />
      <PhoneInputCluster />
    </div>
  )
}