import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

const LOGIN_API = 'https://apiqa.hometrumpeter.com/contact/send';

export function useVerifyPhone() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {dispatch}: any = useAuthContext();
  const navigate = useNavigate();

  const verifyPhone = async (phone: string) => {
    setIsLoading(true);
    setError(null);
    
    // API call
    const response = await fetch(LOGIN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xck': import.meta.env.VITE_HT_API_KEY,
        'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user') ?? '{token: localStorageUserNotFound}').token
      },
      body: JSON.stringify({phone, type:"phone"})
    });
    const json = await response.json();

    // Handle BAD/GOOD response
    if(!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.error(json.error);
    } else if(response.ok) {
      setIsLoading(false);
      localStorage.setItem('user', JSON.stringify(json)); // save user data to local storage
      dispatch({type: 'LOGIN', payload: json});    // use AuthContext
      navigate('/Dashboard'); //this will be to the OTP-input page instead.
    }
  }

  return({ verifyPhone, isLoading, error });
}