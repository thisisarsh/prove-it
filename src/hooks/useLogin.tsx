import { useState } from 'react'

const LOGIN_API = 'https://api.htuslab1.com/user/login'

export function useLogin() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    const response = await fetch(LOGIN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xck': import.meta.env.VITE_HT_API_KEY
      },
      body: JSON.stringify({ email, password })
    });
    const json = await response.json();

    if(!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if(response.ok) {
      setIsLoading(false);
      localStorage.setItem('user', JSON.stringify(json)); // save user data to local storage
    }
  }

  return({ login, isLoading, error });
}