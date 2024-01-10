/**
 * Dashboard for owner
 * "/dashboardowner"
 *
 * WIP: need to add the rest of the page
 */

import { DashboardOwnerCluster } from "../clusters/DashboardOwnerCluster.tsx";
import { DashboardTenantCluster } from "../clusters/DashboardTenantCluster.tsx";
import { DashboardServiceCluster } from "../clusters/DashboardServiceCluster.tsx";
import { useAuthContext } from "../hooks/useAuthContext.tsx";

export function Dashboard() {
    const user = useAuthContext().state.user;

    if (!user) {
        throw new Error("Could not retrieve user from authContext! Please log in again.");
    }

    switch (user.role.role) {
        case "owner":
        case "manager":
            return <DashboardOwnerCluster />;
        case "tenant":
            return <DashboardTenantCluster/>;
        case "service_provider":
            return <DashboardServiceCluster/>;
        default:
            throw new Error("No dashboard route for user's role of " + user.role.role);
    }
    
}
