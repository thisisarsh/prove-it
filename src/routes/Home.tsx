import { useNavigate } from "react-router-dom";

/**
 * Home page
 * /home
 * 
 * WIP: need to add the rest of the page
 */
export function Home() {
  const navigate = useNavigate();
  
  const handleLogIn = () => {
    navigate('/login');
  }

  return (
    <div>
      <p>Welcome home!</p>
      <button onClick={handleLogIn}>Log in</button>
    </div>
  )
}

