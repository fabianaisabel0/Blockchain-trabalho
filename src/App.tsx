import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Truck, 
  Fuel, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  BellRing,
  Search,
  Shield,
  Bell,
  Terminal,
  History,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  FileText,
  Plus,
  Menu,
  X,
  LogIn,
  LogOut,
  Lock,
  ShieldAlert,
  Mail,
  Key
} from 'lucide-react';
import { cn } from './lib/utils';
import { NAV_ITEMS, Screen } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { createClient, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// --- Types & Constants ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleSupabaseError = (error: any, operationType: string, path: string | null) => {
  console.error(`Supabase Error [${operationType}] on ${path}:`, error);
  throw error;
}

// --- Components ---

const TopBar = ({ user, onNavigate }: { user: any | null, onNavigate: (s: Screen) => void }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b-2 border-zinc-200">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('admin')}
            className="p-2 bg-zinc-900 text-white hover:bg-red-700 transition-colors"
            title="Database Control"
          >
            <Database className="w-5 h-5" />
          </button>
          <span className="text-xl font-black tracking-tighter text-red-700 uppercase font-headline">Industrial Integrity</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {['Network', 'Nodes', 'Audit'].map((item) => (
            <a key={item} className="text-zinc-500 font-medium hover:text-red-600 font-label text-xs uppercase tracking-widest transition-colors duration-150" href="#">{item}</a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input 
            className="bg-surface-container-highest border-none h-9 pl-10 pr-4 text-xs font-label focus:ring-0 focus:border-b-2 focus:border-primary w-64" 
            placeholder="GLOBAL LEDGER SEARCH..." 
            type="text" 
          />
        </div>
        <button className="p-2 hover:bg-zinc-100 transition-colors relative">
          <Shield className="text-zinc-600 w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-zinc-100 transition-colors relative">
          <Bell className="text-zinc-600 w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        {user && (
          <div className="h-8 w-8 bg-zinc-200 overflow-hidden border border-zinc-300">
            <img 
              alt={user.user_metadata?.full_name || "User profile"} 
              src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </header>
  );
};

const Sidebar = ({ activeScreen, onNavigate, user }: { activeScreen: Screen, onNavigate: (s: Screen) => void, user: any | null }) => {
  const IconMap: Record<string, any> = {
    LayoutDashboard, Database, Truck, Fuel, Users, ShieldCheck, BarChart3, BellRing, Shield
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('sb-mock-user');
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col z-40 bg-zinc-100 border-r-2 border-zinc-200">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center">
          <Terminal className="text-red-500 w-6 h-6" />
        </div>
        <div>
          <p className="font-headline text-xs font-bold uppercase tracking-widest text-zinc-900">Terminal 01</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Blockchain Verified</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = IconMap[item.icon];
          const isActive = activeScreen === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center px-4 py-3 gap-3 w-full font-headline text-xs font-bold uppercase tracking-widest transition-all text-left",
                isActive ? "bg-red-700 text-white" : "text-zinc-600 hover:bg-zinc-200"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 bg-zinc-200/50">
        <button className="w-full bg-industrial-gradient text-white py-3 font-headline text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform">
          New Transaction
        </button>
      </div>
      <div className="border-t border-zinc-200 p-2">
        {user && (
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 flex items-center px-4 py-2 gap-3 w-full font-headline text-[10px] font-bold uppercase tracking-widest text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
};

// --- Screens ---

const Dashboard = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-4xl font-extrabold uppercase tracking-tighter text-zinc-900 mb-1">System Overview</h1>
          <p className="font-label text-xs uppercase tracking-widest text-zinc-500">Node Status: <span className="text-tertiary font-bold">Synchronized</span> • 0.042s Latency</p>
        </div>
        <div className="bg-surface-container-low px-4 py-2 flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-400" />
          <span className="font-label text-xs font-bold uppercase text-zinc-700">Oct 24, 2023 - Oct 31, 2023</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Production Volume', value: '842.1k', unit: 'BBL', trend: '+4.2%', icon: 'Factory' },
          { label: 'Distribution Nodes', value: '1,204', unit: '', trend: 'Active', icon: 'Hub' },
          { label: 'Delivery Status', value: '98.2', unit: '%', trend: 'On Time', icon: 'Box' },
          { label: 'Inconsistency Alerts', value: '07', unit: '', trend: 'Critical', icon: 'Alert', dark: true },
        ].map((kpi, i) => (
          <div key={i} className={cn(
            "p-6 flex flex-col justify-between transition-colors",
            kpi.dark ? "bg-primary text-white" : "bg-white hover:bg-zinc-50"
          )}>
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-5 h-5", kpi.dark ? "text-white" : "text-zinc-400")} />
              <span className={cn("text-[10px] font-bold px-2 py-0.5 uppercase", kpi.dark ? "bg-white/20" : "text-tertiary bg-tertiary/10")}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className={cn("font-label text-[10px] uppercase tracking-widest font-bold mb-1", kpi.dark ? "text-white/70" : "text-zinc-500")}>
                {kpi.label}
              </p>
              <p className="font-headline text-3xl font-black tracking-tight">
                {kpi.value} <span className="text-xs font-medium">{kpi.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 border border-zinc-200">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Network Throughput</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary"></span>
                  <span className="font-label text-[10px] uppercase font-bold text-zinc-500">Refinery A</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-tertiary"></span>
                  <span className="font-label text-[10px] uppercase font-bold text-zinc-500">Refinery B</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end gap-1 relative border-l-2 border-b-2 border-zinc-100">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 transition-all cursor-pointer group relative",
                    i === 3 ? "bg-primary h-[85%]" : "bg-zinc-100 hover:bg-primary h-[40%]"
                  )}
                  style={{ height: `${Math.random() * 80 + 10}%` }}
                >
                  {i === 3 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1">312k</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 font-label text-[10px] uppercase font-bold text-zinc-400">
              <span>06:00</span><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
            </div>
          </section>

          <section className="bg-white border border-zinc-200">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Active Consignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50">
                  <tr>
                    {['Transaction ID', 'Origin', 'Destination', 'Volume', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    { id: 'TX-9042-881', origin: 'REFINERY_01_TX', dest: 'DIST_HUB_DELTA', vol: '12,400L', status: 'In Transit', color: 'text-tertiary' },
                    { id: 'TX-9042-882', origin: 'REFINERY_04_LA', dest: 'DIST_HUB_BETA', vol: '8,900L', status: 'Diverted', color: 'text-primary' },
                    { id: 'TX-9042-885', origin: 'REFINERY_02_CH', dest: 'DIST_HUB_ALPHA', vol: '15,000L', status: 'Verified', color: 'text-zinc-400' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 font-label text-xs font-bold text-zinc-900">{row.id}</td>
                      <td className="px-6 py-4 font-label text-xs text-zinc-500">{row.origin}</td>
                      <td className="px-6 py-4 font-label text-xs text-zinc-500">{row.dest}</td>
                      <td className="px-6 py-4 font-label text-xs font-bold text-zinc-900">{row.vol}</td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase", row.color)}>
                          <span className={cn("w-1.5 h-1.5", row.color.replace('text', 'bg'))}></span> {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white border border-zinc-200 h-[400px] relative overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white z-10">
              <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Global Fleet Map</h2>
              <button className="p-2 bg-zinc-100 hover:bg-zinc-200 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative bg-zinc-200">
              <img 
                alt="World map" 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 contrast-125" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLZtru_WrdRLAiX3uM7W308dnyK2-xQTp5d6cWSOEvrwCng39vtikQr8IzCiZa5U6XXIKYz2vtiztUriQYfaTKUOy1hc0DLUUfXsF8yTuj1GtvkKmKJ4_JsJzDISWNelCY6kZ0ZMZ79QiofBkf90QSUyGC6x2Zp5Y0V1mlqTZLorve8kVD5cMKbpZNmSbm6jqtF-_dc2ExCEuiBifcVun18o27zYbF9tit-3-5B_6_SyAIpkvFbFn1ObYWETT3PZI51lH5QQZ79aFG"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary/30 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary"></div>
                <div className="absolute inset-0 w-full h-full bg-primary animate-ping opacity-20"></div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-label text-xs font-bold uppercase tracking-widest text-zinc-500">System Critical Notifications</h2>
            <div className="bg-white border-l-4 border-primary p-4 flex gap-4 items-start shadow-sm">
              <AlertTriangle className="text-primary w-5 h-5" />
              <div>
                <p className="font-label text-xs font-extrabold uppercase text-zinc-900">Hash Mismatch Detected</p>
                <p className="font-label text-[10px] text-zinc-500 mt-1">Node TX-9042 reported an integrity deviation of 0.4%. Manual audit required immediately.</p>
                <div className="mt-3 flex gap-4">
                  <button className="text-[10px] font-bold uppercase text-primary hover:underline">Verify Node</button>
                  <button className="text-[10px] font-bold uppercase text-zinc-400 hover:text-zinc-600">Dismiss</button>
                </div>
              </div>
            </div>
            <div className="bg-zinc-100 p-4 flex justify-between items-center group cursor-pointer">
              <p className="font-label text-[10px] uppercase font-bold text-zinc-400 tracking-widest group-hover:text-zinc-600 transition-colors">View All Archived Notifications</p>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Blockchain = () => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      const { data, error } = await supabase
        .from('ledger')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        handleSupabaseError(error, 'LIST', 'ledger');
      } else {
        setLedger(data || []);
      }
      setLoading(false);
    };

    fetchLedger();

    const subscription = supabase
      .channel('public:ledger')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, () => fetchLedger())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Live Asset Ledger</span>
          <h1 className="font-headline text-5xl font-extrabold uppercase tracking-tighter text-on-surface leading-none">Blockchain Tracking</h1>
          <p className="font-body text-on-surface-variant mt-4 max-w-md">Immutable verification of petroleum assets across the global supply chain using SHA-256 cryptographic sequencing.</p>
        </div>
        <button className="bg-industrial-gradient px-8 py-4 text-white font-headline text-sm font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
          Verify Hash Integrity
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 border border-zinc-200">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-zinc-500">Active Batch ID</span>
          <span className="font-headline text-2xl font-bold mt-2 block">#FUEL-99284-X</span>
        </div>
        <div className="bg-white p-6 border border-zinc-200">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-zinc-500">Current Node</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="font-headline text-2xl font-bold uppercase">Transit</span>
          </div>
        </div>
        <div className="bg-white p-6 border border-zinc-200">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security Index</span>
          <span className="font-headline text-2xl font-bold mt-2 block">99.9%</span>
        </div>
        <div className="bg-white p-6 border-l-4 border-primary">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">Status</span>
          <span className="font-headline text-2xl font-bold mt-2 uppercase text-primary block">Verified</span>
        </div>
      </div>

      <div className="relative py-12">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-zinc-300 -translate-x-1/2 hidden lg:block"></div>
        <div className="space-y-24 relative">
          {ledger.length > 0 ? ledger.map((node, i) => (
            <div key={node.id} className={cn("flex flex-col lg:flex-row items-center justify-center gap-12 group", i % 2 !== 0 && "lg:flex-row-reverse")}>
              <div className="w-full lg:w-1/2 flex justify-end">
                <div className="bg-white p-8 w-full max-w-md border border-zinc-200 relative">
                  <span className={cn("font-label text-[10px] font-bold uppercase tracking-widest mb-4 block text-primary")}>Step {ledger.length - i}: {node.action}</span>
                  <h3 className="font-headline text-2xl font-bold uppercase mb-4">{node.entity_type}</h3>
                  <div className="space-y-3 font-body text-sm">
                    <div className="flex justify-between border-b border-zinc-100 pb-2">
                      <span className="text-zinc-500 font-medium">Entity ID:</span>
                      <span className="font-mono text-xs font-bold">{node.entity_id}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 pb-2">
                      <span className="text-zinc-500 font-medium">Date:</span>
                      <span className="font-mono text-xs font-bold">{new Date(node.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-6 pt-4 border-t-2 border-zinc-100">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 block mb-1">SHA-256 Hash</span>
                      <span className={cn("font-mono text-[11px] break-all p-2 block border-l-2 border-primary bg-zinc-50")}>{node.hash || 'PENDING_VERIFICATION'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <div className={cn("w-12 h-12 bg-white border-4 flex items-center justify-center border-primary")}>
                  <CheckCircle2 className={cn("w-6 h-6 text-primary")} />
                </div>
              </div>
              <div className="w-full lg:w-1/2"></div>
            </div>
          )) : (
            <div className="text-center py-20 text-zinc-400 font-headline uppercase tracking-widest">
              No blockchain records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Personnel = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnel = async () => {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        handleSupabaseError(error, 'LIST', 'personnel');
      } else {
        setPersonnel(data || []);
      }
      setLoading(false);
    };

    fetchPersonnel();

    const subscription = supabase
      .channel('public:personnel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'personnel' }, () => fetchPersonnel())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black font-headline uppercase tracking-tighter text-on-surface">Personnel</h1>
          <p className="text-zinc-500 font-label text-sm mt-2 uppercase tracking-widest">Centralized Node Access Management</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 border-l-4 border-primary shadow-sm">
            <span className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Total Active Nodes</span>
            <span className="text-3xl font-black font-headline leading-none">{personnel.length}</span>
          </div>
          <div className="bg-white px-6 py-4 border-l-4 border-tertiary shadow-sm">
            <span className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Security Clearance</span>
            <span className="text-3xl font-black font-headline leading-none">99.8%</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 mb-8 items-stretch">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border-2 border-zinc-200">
          <div className="flex items-center px-4 py-3 border-r-2 border-zinc-200">
            <Search className="text-zinc-400 mr-3 w-4 h-4" />
            <input className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full placeholder:text-zinc-400 uppercase font-bold tracking-tight" placeholder="Search by Node ID or Name" type="text"/>
          </div>
          <div className="flex items-center px-4 py-3 border-r-2 border-zinc-200">
            <Users className="text-zinc-400 mr-3 w-4 h-4" />
            <select className="bg-transparent border-none p-0 text-xs font-bold uppercase tracking-widest focus:ring-0 w-full cursor-pointer">
              <option>All Roles</option>
              <option>Network Admin</option>
              <option>Logistics Lead</option>
            </select>
          </div>
          <div className="flex items-center px-4 py-3">
            <Shield className="text-zinc-400 mr-3 w-4 h-4" />
            <select className="bg-transparent border-none p-0 text-xs font-bold uppercase tracking-widest focus:ring-0 w-full cursor-pointer">
              <option>Global Locations</option>
              <option>Houston Hub</option>
              <option>Rotterdam Terminal</option>
            </select>
          </div>
        </div>
        <button className="bg-industrial-gradient text-white px-8 py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-opacity whitespace-nowrap">
          <Plus className="w-5 h-5" /> Add New Employee
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {personnel.length > 0 ? (
          <>
            <div className="xl:col-span-1 bg-white p-6 flex flex-col gap-6 border border-zinc-200">
              <div className="aspect-square bg-zinc-200 relative overflow-hidden group">
                <img 
                  alt={personnel[0].name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${personnel[0].name}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-primary text-white">
                  <h2 className="font-headline font-black uppercase text-xl leading-tight">{personnel[0].name}</h2>
                  <p className="text-[10px] font-bold uppercase opacity-80">{personnel[0].role} | ID: #{personnel[0].id.slice(0,6)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 border border-zinc-100">
                  <span className="block text-[10px] font-bold uppercase text-zinc-400 mb-2">Access Level</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-zinc-200 overflow-hidden">
                      <div className="h-full bg-primary w-[85%]"></div>
                    </div>
                    <span className="text-xs font-black">LVL 08</span>
                  </div>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 space-y-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Primary Hub</span>
                    <span className="text-sm font-bold uppercase">{personnel[0].department}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-zinc-400">Join Date</span>
                    <span className="text-sm font-bold uppercase">{new Date(personnel[0].joined_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="border-2 border-primary text-primary py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all">
                Edit Node Access
              </button>
            </div>

            <div className="xl:col-span-3 space-y-4">
              <div className="grid grid-cols-12 px-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                <div className="col-span-4">Name & Identifier</div>
                <div className="col-span-3">Role / Designation</div>
                <div className="col-span-3">Hub Location</div>
                <div className="col-span-2 text-right">Clearance</div>
              </div>
              {personnel.map((emp, i) => (
                <div key={emp.id} className="bg-white hover:bg-zinc-50 border-l-4 border-transparent hover:border-primary transition-all p-6 cursor-pointer border border-zinc-200">
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-200 overflow-hidden">
                        <img alt={emp.name} className="w-full h-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm uppercase">{emp.name}</h4>
                        <span className="text-[10px] text-zinc-500 font-label">#{emp.id.slice(0,8)}</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className="text-xs font-bold uppercase px-2 py-1 bg-zinc-100">
                        {emp.role}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-xs font-medium text-zinc-600 uppercase">{emp.department}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-xs font-black text-primary">LVL 0{Math.floor(Math.random() * 9) + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="xl:col-span-4 text-center py-20 bg-white border-2 border-dashed border-zinc-200 text-zinc-400 font-headline uppercase tracking-widest">
            No personnel records found in database.
          </div>
        )}
      </div>
    </div>
  );
};

const AdminArea = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({ displayName: '', email: '', role: 'user' });

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        handleSupabaseError(error, 'LIST', 'users');
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.displayName || !newUser.email) return;
    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          id: crypto.randomUUID(), // Note: In a real app, users are created via Auth
          display_name: newUser.displayName,
          email: newUser.email,
          role: newUser.role,
          photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.displayName}`
        }]);
      
      if (error) throw error;
      setNewUser({ displayName: '', email: '', role: 'user' });
      setIsCreating(false);
    } catch (error) {
      handleSupabaseError(error, 'CREATE', 'users');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      setEditingUser(null);
    } catch (error) {
      handleSupabaseError(error, 'UPDATE', `users/${userId}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is irreversible on the ledger.")) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'DELETE', `users/${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-700/20 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-5xl font-black font-headline uppercase tracking-tighter text-on-surface">Admin Control</h1>
        <p className="text-zinc-500 font-label text-sm mt-2 uppercase tracking-widest">Global User & Access Management</p>
      </header>

      <div className="bg-white border-2 border-zinc-200 overflow-hidden">
        <div className="p-6 border-b-2 border-zinc-100 bg-zinc-50 flex justify-between items-center">
          <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Authorized Personnel Ledger</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="bg-red-700 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-3 h-3" />
              {isCreating ? 'Cancel' : 'New User'}
            </button>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Live Synchronization
            </div>
          </div>
        </div>
        
        {isCreating && (
          <div className="p-6 bg-zinc-50 border-b-2 border-zinc-100 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                  className="w-full bg-white border-2 border-zinc-200 p-2 text-xs font-bold uppercase focus:border-red-700 outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-white border-2 border-zinc-200 p-2 text-xs font-bold uppercase focus:border-red-700 outline-none"
                  placeholder="email@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Access Level</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-white border-2 border-zinc-200 p-2 text-xs font-bold uppercase focus:border-red-700 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <button 
                type="submit"
                className="bg-zinc-900 text-white p-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors h-[38px]"
              >
                Authorize Node
              </button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-zinc-500 font-bold">User</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Role</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Joined</th>
                <th className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-200 overflow-hidden border border-zinc-300">
                        <img 
                          alt={u.displayName || "User"} 
                          src={u.photoURL || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="font-headline text-xs font-bold uppercase text-zinc-900">{u.displayName || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-label text-xs text-zinc-500">{u.email}</td>
                  <td className="px-6 py-4">
                    {editingUser?.id === u.id ? (
                      <select 
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="bg-zinc-100 border-2 border-red-700 text-[10px] font-bold uppercase p-1 focus:ring-0"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="guest">Guest</option>
                      </select>
                    ) : (
                      <span className={cn(
                        "inline-block px-2 py-1 text-[9px] font-black uppercase tracking-widest",
                        u.role === 'admin' ? "bg-red-700 text-white" : "bg-zinc-200 text-zinc-600"
                      )}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-label text-[10px] text-zinc-400 uppercase">
                    {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {editingUser?.id === u.id ? (
                      <>
                        <button 
                          onClick={() => handleUpdateRole(u.id, editingUser.role)}
                          className="text-[10px] font-bold uppercase text-green-600 hover:underline"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingUser(null)}
                          className="text-[10px] font-bold uppercase text-zinc-400 hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setEditingUser(u)}
                          className="text-[10px] font-bold uppercase text-red-700 hover:underline"
                        >
                          Edit Role
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-[10px] font-bold uppercase text-zinc-400 hover:text-red-700"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 border-l-4 border-red-700">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-red-700 w-6 h-6" />
            <h3 className="font-headline text-white font-bold uppercase tracking-widest">Security Protocol</h3>
          </div>
          <p className="text-zinc-400 text-xs font-label leading-relaxed">
            All administrative actions are recorded in the immutable system log. Role escalations require Level 8 clearance. Unauthorized access attempts will trigger a global node lockdown.
          </p>
        </div>
        <div className="bg-zinc-100 p-6 border-l-4 border-zinc-400">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-zinc-500 w-6 h-6" />
            <h3 className="font-headline text-zinc-900 font-bold uppercase tracking-widest">User Statistics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase text-zinc-400">Total Personnel</p>
              <p className="text-2xl font-black font-headline">{users.length}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-zinc-400">Admin Nodes</p>
              <p className="text-2xl font-black font-headline">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Master Admin Bypass
    if (email === 'fabianaisabel0@gmail.com' && password === 'admin') {
      const mockUser = {
        id: 'master-admin-id',
        email: 'fabianaisabel0@gmail.com',
        user_metadata: { full_name: 'Master Admin' }
      };
      localStorage.setItem('sb-mock-user', JSON.stringify(mockUser));
      window.location.reload();
      return;
    }

    // Master Admin Bypass
    if (email === 'fabianaisabel0@gmail.com' && password === 'admin') {
      const mockUser = {
        id: 'master-admin-id',
        email: 'fabianaisabel0@gmail.com',
        user_metadata: { full_name: 'Master Admin' }
      };
      localStorage.setItem('sb-mock-user', JSON.stringify(mockUser));
      window.location.reload();
      return;
    }

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName,
            }
          }
        });
        if (error) throw error;
        setError("Registro realizado! Verifique seu e-mail para confirmar a conta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "Falha na autenticação.";
      if (err.message.includes('Invalid login credentials')) {
        message = "E-mail ou senha incorretos.";
      } else if (err.message.includes('Email not confirmed')) {
        message = "E-mail não confirmado. Verifique sua caixa de entrada ou desative a confirmação no painel do Supabase.";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Abre o provedor em um popup para evitar problemas com o iframe
        const authWindow = window.open(data.url, 'google_auth', 'width=600,height=700');
        
        if (!authWindow) {
          setError("Popup bloqueado. Por favor, permita popups para este site.");
          return;
        }

        // O onAuthStateChange no AppContent cuidará de fechar o login quando detectar a sessão
      }
    } catch (err: any) {
      console.error("Google Login error:", err);
      setError(err.message || "Falha no login com Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Por favor, insira seu e-mail para redefinir a senha.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setError("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      console.error("Reset error:", err);
      setError("Erro ao enviar e-mail de redefinição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#dc2626_0%,transparent_50%)]"></div>
        <div className="grid grid-cols-12 h-full w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white/10 h-full"></div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border-2 border-zinc-800 p-8 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-red-700 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(185,28,28,0.3)]">
            <Terminal className="text-white w-10 h-10" />
          </div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-white text-center">
            Industrial Integrity <span className="text-red-700">Terminal</span>
          </h1>
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-2">Secure Access Protocol V2.4</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1">
              <label className="font-label text-[10px] uppercase font-bold text-zinc-500 ml-1">Nome Completo</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 pl-10 text-sm focus:outline-none focus:border-red-700 transition-colors"
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-label text-[10px] uppercase font-bold text-zinc-500 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@integrity.sys"
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 pl-10 text-sm focus:outline-none focus:border-red-700 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label text-[10px] uppercase font-bold text-zinc-500 ml-1">Senha</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 pl-10 text-sm focus:outline-none focus:border-red-700 transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 text-red-500 text-[10px] uppercase font-bold text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white py-4 font-headline text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {isRegistering ? 'Criar Acesso' : 'Autorizar Acesso'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="font-label text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors text-center"
          >
            {isRegistering ? 'Já possui acesso? Entrar' : 'Não possui acesso? Solicitar Registro'}
          </button>

          {!isRegistering && (
            <button 
              onClick={handleForgotPassword}
              className="font-label text-[10px] uppercase font-bold text-zinc-600 hover:text-red-500 transition-colors text-center"
            >
              Esqueceu a senha?
            </button>
          )}

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 font-label text-[9px] uppercase font-bold text-zinc-600">Secure Protocol</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-zinc-600" />
            <span className="font-label text-[9px] uppercase font-bold text-zinc-600">AES-256 Verified</span>
          </div>
          <span className="font-label text-[9px] uppercase font-bold text-zinc-600">Node: 0x42...F3A</span>
        </div>
      </motion.div>
    </div>
  );
};

const Settings = ({ user, userRole }: { user: User | null, userRole: string | null }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'admin'>('general');

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-5xl font-black font-headline uppercase tracking-tighter text-on-surface">Settings</h1>
        <p className="text-zinc-500 font-label text-sm mt-2 uppercase tracking-widest">System Configuration & Access Control</p>
      </header>

      <div className="flex gap-8 mb-8 border-b-2 border-zinc-100">
        <button 
          onClick={() => setActiveTab('general')}
          className={cn(
            "pb-4 font-headline text-xs font-bold uppercase tracking-widest transition-all relative",
            activeTab === 'general' ? "text-red-700" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          General
          {activeTab === 'general' && <motion.div layoutId="tab-underline" className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-red-700" />}
        </button>
        {userRole === 'admin' && (
          <button 
            onClick={() => setActiveTab('admin')}
            className={cn(
              "pb-4 font-headline text-xs font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'admin' ? "text-red-700" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            Administrator
            {activeTab === 'admin' && <motion.div layoutId="tab-underline" className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-red-700" />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'general' ? (
            <div className="max-w-2xl space-y-8">
              <section className="bg-white p-8 border-2 border-zinc-200">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">User Profile</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-zinc-200 overflow-hidden border-2 border-zinc-300">
                    <img 
                      alt={user?.user_metadata?.full_name || "User"} 
                      src={user?.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-headline text-lg font-bold uppercase text-zinc-900">{user?.user_metadata?.full_name}</p>
                    <p className="font-label text-xs text-zinc-500">{user?.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-zinc-100 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                      Current Role: {userRole}
                    </span>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 border-2 border-zinc-200">
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">System Preferences</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-headline text-xs font-bold uppercase text-zinc-900">Dark Mode Protocol</p>
                      <p className="text-[10px] text-zinc-500 font-label">Override system appearance with high-contrast terminal theme.</p>
                    </div>
                    <div className="w-12 h-6 bg-zinc-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-headline text-xs font-bold uppercase text-zinc-900">Real-time Ledger Updates</p>
                      <p className="text-[10px] text-zinc-500 font-label">Enable live synchronization of blockchain nodes.</p>
                    </div>
                    <div className="w-12 h-6 bg-red-700 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <AdminArea />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Error Boundary ---

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  state: { hasError: boolean, error: any };
  props: { children: React.ReactNode };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected system failure has occurred.";
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = `Security Protocol Violation: ${parsedError.error}`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border-4 border-red-700 p-8 shadow-[12px_12px_0px_0px_rgba(185,28,28,0.2)]">
            <div className="flex items-center gap-4 mb-6">
              <ShieldAlert className="text-red-700 w-12 h-12" />
              <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-red-700">System Error</h1>
            </div>
            <div className="bg-zinc-100 p-4 border-l-4 border-zinc-400 mb-8">
              <p className="text-xs font-mono text-zinc-600 leading-relaxed uppercase">
                {errorMessage}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-zinc-900 text-white p-4 font-headline font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              Reboot Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Main App ---

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // Check for mock user first
      const mockUserStr = localStorage.getItem('sb-mock-user');
      if (mockUserStr) {
        const mockUser = JSON.parse(mockUserStr);
        setUser(mockUser);
        setUserRole('admin');
        setAuthReady(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setAuthReady(true);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If we have a mock user, don't let Supabase auth override it unless it's a real sign out
      if (localStorage.getItem('sb-mock-user') && _event !== 'SIGNED_OUT') {
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.id);
      } else {
        setUserRole(null);
      }
      setAuthReady(true);
      if (!currentUser && !localStorage.getItem('sb-mock-user')) {
        setActiveScreen('login');
      } else if (currentUser && activeScreen === 'login') {
        setActiveScreen('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [activeScreen]);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUserRole(data.role);
      } else {
        // Fallback for the owner or initial setup
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'fabianaisabel0@gmail.com') {
          setUserRole('admin');
        } else {
          setUserRole('user');
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-700/20 border-t-red-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return <Dashboard />;
      case 'blockchain': return <Blockchain />;
      case 'employees': return <Personnel />;
      case 'settings': return <Settings user={user} userRole={userRole} />;
      case 'admin': return userRole === 'admin' ? <AdminArea /> : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
          <Shield className="w-16 h-16 mb-4 text-red-700 opacity-50" />
          <p className="font-headline font-bold uppercase tracking-widest text-red-700">Access Denied</p>
          <p className="text-xs mt-2">Administrative privileges required for this node.</p>
        </div>
      );
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
          <Terminal className="w-16 h-16 mb-4 opacity-20" />
          <p className="font-headline font-bold uppercase tracking-widest">Screen Under Development</p>
          <p className="text-xs mt-2">Access restricted to Terminal Control</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <TopBar user={user} onNavigate={setActiveScreen} />
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} user={user} />
      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="ml-64 py-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 px-8">
        <div className="flex items-center gap-6">
          <div>
            <p className="font-label text-[10px] uppercase font-bold text-zinc-400">Core Engine</p>
            <p className="font-headline text-xs font-bold text-zinc-900">FORGE-BLOCK V2.4</p>
          </div>
          <div>
            <p className="font-label text-[10px] uppercase font-bold text-zinc-400">Security Layer</p>
            <p className="font-headline text-xs font-bold text-zinc-900">AES-256 QUANTUM-RESISTANT</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-label text-[10px] text-zinc-400 uppercase">© 2023 INDUSTRIAL INTEGRITY SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
