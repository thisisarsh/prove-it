import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SIGNUP_API = 'https://api.htuslab1.com/user/signup';

export function useSignUp() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (firstName: string, lastName:string ,email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    setError(null);

    //check password and confirm password are the same and not empty
    if(password != confirmPassword){
      alert("Password do not match");
      setIsLoading(false);
    }else if(password == ""){
      alert("Password cannot be empty");
      setIsLoading(false);
    };
    
    // API call
    const response = await fetch(SIGNUP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xck': import.meta.env.VITE_HT_API_KEY
      },
      body: JSON.stringify({firstName, lastName, email, password })
    });
    const json = await response.json();

    // Handle BAD/GOOD response
    if(!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else if(response.ok) {
      setIsLoading(false);
      localStorage.setItem('user', JSON.stringify(json)); // save user data to local storage
      navigate('/Login');
    }
  }

  return({ signup, isLoading, error });
}