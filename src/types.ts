export type Screen = 'dashboard' | 'blockchain' | 'logistics' | 'gas-stations' | 'employees' | 'admin' | 'analytics' | 'alerts' | 'login' | 'settings';

export interface NavItem {
  id: Screen;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'blockchain', label: 'Blockchain', icon: 'Database' },
  { id: 'logistics', label: 'Logistics', icon: 'Truck' },
  { id: 'gas-stations', label: 'Gas Stations', icon: 'Fuel' },
  { id: 'employees', label: 'Employees', icon: 'Users' },
  { id: 'admin', label: 'Admin', icon: 'ShieldCheck' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'alerts', label: 'Alerts', icon: 'BellRing' },
  { id: 'settings', label: 'Settings', icon: 'Shield' },
];
