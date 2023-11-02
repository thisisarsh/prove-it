/**
 * Dashboard
 * "/dashboard"
 *
 * WIP: need to add the rest of the page
 */

import { useLogout } from "../hooks/useLogout";

export function Dashboard() {
  const { logout } = useLogout();

  return (
    <>
      <div>Dashboard</div>
      <button onClick={logout}>Log out</button>
    </>
  );
}
