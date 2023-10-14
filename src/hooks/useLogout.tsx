export function useLogout() {
  const logout = () => {
    localStorage.removeItem('user');
  }

  return({ logout });
}