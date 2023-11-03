/**
 * Dashboard
 * "/dashboard"
 * 
 * WIP: need to add the rest of the page
 */

import { useLogout } from "../hooks/useLogout"
import { DashboardCluster } from "../components/DashboardCluster"

export function Dashboard() {
  const {logout} = useLogout();

  return (
    <DashboardCluster />
  );
}  
