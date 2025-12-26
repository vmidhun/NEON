
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserRole } from '../types';
import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    Settings, 
    Activity,
    LogOut,
    Building,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Plus,
    Edit2,
    Trash
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import TenantSettings from './TenantSettings';

// Types for Super Admin
interface Tenant {
    _id: string;
    name: string;
    domain: string;
    status: 'Active' | 'Suspended';
    subscriptionPlan: string;
    subscription?: {
        status: string;
        plan: {
            _id?: string;
            name: string;
            code: string;
        } | null;
    };
}

interface Plan {
    _id: string;
    name: string;
    code: string;
    billingType: string;
    priceAmount: number;
    priceCurrency: string;
    isActive: boolean;
}

interface Metrics {
    totalTenants: number;
    activeTenants: number;
    byPlan: Record<string, number>;
    byStatus: Record<string, number>;
}

const SuperAdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'plans'>('overview');
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Forms
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [newPlan, setNewPlan] = useState({ name: '', code: '', priceAmount: 0, billingType: 'PAID' });
    const [newTenant, setNewTenant] = useState({ name: '', domain: '', subscriptionPlan: 'Free' });


    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [subscriptionForm, setSubscriptionForm] = useState({ planId: '', status: 'TRIAL' });

    // Plan Editing
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    
    // Tenant Settings View
    const [viewSettingsTenantId, setViewSettingsTenantId] = useState<string | null>(null);

    interface PlanFeature {
        key: string;
        type: 'BOOLEAN' | 'NUMERIC';
        boolValue?: boolean;
        numericValue?: number;
    }
    
    const DEFAULT_FEATURES: PlanFeature[] = [
        { key: 'project_management', type: 'BOOLEAN', boolValue: true },
        { key: 'timesheet', type: 'BOOLEAN', boolValue: true },
        { key: 'leave_management', type: 'BOOLEAN', boolValue: true },
        { key: 'team_standup', type: 'BOOLEAN', boolValue: true },
        { key: 'reports', type: 'BOOLEAN', boolValue: true },
        { key: 'max_employees', type: 'NUMERIC', numericValue: 10 },
        { key: 'max_projects', type: 'NUMERIC', numericValue: 5 },
    ];

    const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>(DEFAULT_FEATURES);

    const getFeatureLabel = (key: string) => {
        const labels: Record<string, string> = {
            project_management: 'Project Management',
            timesheet: 'Timesheets',
            leave_management: 'Leave Management',
            team_standup: 'Daily Standup',
            reports: 'Reports & Analytics',
            max_employees: 'Max Employees',
            max_projects: 'Max Projects'
        };
        return labels[key] || key;
    };

    const updateFeatureInState = (index: number, field: keyof PlanFeature, value: any) => {
        const updated = [...planFeatures];
        updated[index] = { ...updated[index], [field]: value };
        setPlanFeatures(updated);
    };

    useEffect(() => {
        fetchData();
        setViewSettingsTenantId(null);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const res = await api.get('/super/metrics/overview');
                setMetrics(res);
            } else if (activeTab === 'tenants') {
                const res = await api.get('/super/tenants');
                setTenants(res);
            } else if (activeTab === 'plans') {
                const res = await api.get('/super/plans');
                setPlans(res);
            }
        } catch (err) {
            console.error("Failed to fetch super admin data", err);
        } finally {
            setLoading(false);
        }
    };

   const handleCreatePlan = async () => {
        try {
            let planId = selectedPlanId;
            if (isEditingPlan && selectedPlanId) {
                await api.put(`/super/plans/${selectedPlanId}`, { ...newPlan, priceCurrency: 'INR' });
            } else {
                const res = await api.post('/super/plans', { ...newPlan, priceCurrency: 'INR' });
                planId = res._id; // Capture new plan ID
            }
            
            // Post features
            if (planId) {
                await api.post(`/super/plans/${planId}/features`, planFeatures);
            }

            setShowPlanModal(false);
            setIsEditingPlan(false);
            setNewPlan({ name: '', code: '', priceAmount: 0, billingType: 'PAID' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditPlan = async (plan: Plan) => {
        setNewPlan({ 
            name: plan.name, 
            code: plan.code, 
            priceAmount: plan.priceAmount, 
            billingType: plan.billingType 
        });
        setSelectedPlanId(plan._id);
        setIsEditingPlan(true);

        // Fetch Features
        try {
            const features = await api.get(`/super/plans/${plan._id}/features`);
            // Merge with defaults to ensure all keys present
            const merged = DEFAULT_FEATURES.map(def => {
                const existing = features.find((f: any) => f.key === def.key);
                return existing ? { ...def, ...existing } : def;
            });
            setPlanFeatures(merged);
        } catch (e) {
            console.error("Failed to fetch features", e);
            setPlanFeatures(DEFAULT_FEATURES);
        }

        setShowPlanModal(true);
    };
    
    const handleCreateTenant = async () => {
        try {
            await api.post('/tenants', newTenant); 
            setShowTenantModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTenantStatus = async (tenantId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        try {
           await api.put(`/tenants/${tenantId}`, { status: newStatus }); 
           fetchData();
        } catch(err) {
            console.error(err);
        }
    };

    const handleManageSubscription = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setSubscriptionForm({
            planId: tenant.subscription?.plan?._id || '', 
            status: tenant.subscription?.status || 'TRIAL'
        });
        // Hack: Need plan ID to pre-select. 
        const planId = (tenant.subscription?.plan as any)?._id || '';
        setSubscriptionForm({
             planId,
             status: tenant.subscription?.status || 'TRIAL'
        });

        setShowSubscriptionModal(true);
    };

    const handleUpdateSubscription = async () => {
        if (!selectedTenant) return;
        try {
            await api.post(`/super/tenants/${selectedTenant._id}/subscription`, subscriptionForm);
            setShowSubscriptionModal(false);
            fetchData();
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-400" />
                        Super Admin
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Control Plane</p>
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('tenants')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'tenants' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        <Building className="w-5 h-5" />
                        Tenants
                    </button>
                     <button 
                        onClick={() => setActiveTab('plans')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                        <CreditCard className="w-5 h-5" />
                        Plans
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                     <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'overview' && metrics && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">Total Tenants</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.totalTenants}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">Active Tenants</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{metrics.activeTenants}</p>
                            </div>
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">Inactive/Suspended</p>
                                <p className="text-3xl font-bold text-red-500 mt-2">{metrics.totalTenants - metrics.activeTenants}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-semibold text-lg mb-4">Tenants by Plan</h3>
                                {Object.entries(metrics.byPlan).map(([plan, count]) => (
                                    <div key={plan} className="flex justify-between py-2 border-b last:border-0">
                                        <span className="text-slate-600">{plan}</span>
                                        <span className="font-medium">{count}</span>
                                    </div>
                                ))}
                                {Object.keys(metrics.byPlan).length === 0 && <p className="text-slate-400">No data available</p>}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tenants' && !viewSettingsTenantId && (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800">Tenant Management</h2>
                            <button 
                                onClick={() => setShowTenantModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Tenant
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Domain</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Plan</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tenants.map(tenant => (
                                        <tr key={tenant._id} className="hover:bg-slate-50">
                                            <td
                                                className="px-6 py-4 font-medium text-slate-900 cursor-pointer hover:text-blue-600 hover:underline"
                                                onClick={() => setViewSettingsTenantId(tenant._id)}
                                            >
                                                {tenant.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{tenant.domain || '-'}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                   {tenant.subscription?.plan?.name || tenant.subscriptionPlan || 'Free'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                 <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    tenant.status === 'Active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {tenant.status === 'Active' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                                                    {tenant.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => toggleTenantStatus(tenant._id, tenant.status)}
                                                    className="text-slate-500 hover:text-blue-600 font-medium text-sm"
                                                >
                                                    {tenant.status === 'Active' ? 'Suspend' : 'Activate'}
                                                </button>
                                                <button 
                                                    onClick={() => handleManageSubscription(tenant)}
                                                    className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium text-sm ml-4"
                                                >
                                                    <Settings className="w-4 h-4" /> Plan
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {tenants.length === 0 && !loading && (
                                <div className="p-8 text-center text-slate-500">No tenants found.</div>
                            )}
                        </div>
                     </div>
                )}

                {activeTab === 'tenants' && viewSettingsTenantId && (
                    <TenantSettings
                        tenantId={viewSettingsTenantId}
                        onBack={() => setViewSettingsTenantId(null)}
                    />
                )}

                {activeTab === 'plans' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800">Subscription Plans</h2>
                            <button 
                                onClick={() => {
                                    setNewPlan({ name: '', code: '', priceAmount: 0, billingType: 'PAID' });
                                    setPlanFeatures(DEFAULT_FEATURES);
                                    setIsEditingPlan(false);
                                    setShowPlanModal(true);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Create Plan
                            </button>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <div key={plan._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
                                    {!plan.isActive && <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-xs px-2 py-1">Inactive</div>}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        <p className="text-sm text-slate-500 mb-4">Code: {plan.code}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-slate-900">{plan.priceCurrency} {plan.priceAmount}</span>
                                            <span className="text-slate-500">/ month</span>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {/* Feature list placeholder */}
                                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" /> All Core Modules
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                                        <button 
                                            onClick={() => handleEditPlan(plan)}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4"/> Edit Plan
                                        </button>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            {showPlanModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{isEditingPlan ? 'Update Plan & Features' : 'Create New Plan'}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-800 border-b pb-2">Plan Details</h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newPlan.name}
                                        onChange={e => setNewPlan({...newPlan, name: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Plan Code (Unique)</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border rounded-lg uppercase"
                                        placeholder="e.g. ENTERPRISE"
                                        value={newPlan.code}
                                        onChange={e => setNewPlan({...newPlan, code: e.target.value.toUpperCase()})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (Monthly)</label>
                                    <input 
                                        type="number" 
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newPlan.priceAmount}
                                        onChange={e => setNewPlan({...newPlan, priceAmount: parseFloat(e.target.value)})} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-800 border-b pb-2">Feature Entitlements</h4>
                                <div className="space-y-3">
                                    {planFeatures.map((feat, idx) => (
                                        <div key={feat.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-slate-900">{getFeatureLabel(feat.key)}</p>
                                                <p className="text-xs text-slate-500">{feat.key}</p>
                                            </div>
                                            
                                            {feat.type === 'BOOLEAN' ? (
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer"
                                                        checked={feat.boolValue}
                                                        onChange={e => updateFeatureInState(idx, 'boolValue', e.target.checked)}
                                                    />
                                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            ) : (
                                                <input 
                                                    type="number" 
                                                    className="w-20 px-2 py-1 text-sm border rounded"
                                                    value={feat.numericValue}
                                                    onChange={e => updateFeatureInState(idx, 'numericValue', parseInt(e.target.value) || 0)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                         <div className="mt-8 flex justify-end gap-3 pt-4 border-t">
                            <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button onClick={handleCreatePlan} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                {isEditingPlan ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {showTenantModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add New Tenant</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={newTenant.name}
                                    onChange={e => setNewTenant({...newTenant, name: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Domain / Identifier</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="acme.com"
                                    value={newTenant.domain}
                                    onChange={e => setNewTenant({...newTenant, domain: e.target.value})} 
                                />
                            </div>
                        </div>
                         <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowTenantModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button onClick={handleCreateTenant} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Tenant</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Attach Plan Modal */}
            {showSubscriptionModal && selectedTenant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Manage Subscription</h3>
                        <p className="text-sm text-slate-500 mb-4">For {selectedTenant.name}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Plan</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={subscriptionForm.planId}
                                    onChange={e => setSubscriptionForm({...subscriptionForm, planId: e.target.value})}
                                >
                                    <option value="">-- No Plan --</option>
                                    {plans.filter(p => p.isActive).map(p => (
                                        <option key={p._id} value={p._id}>{p.name} ({p.priceCurrency} {p.priceAmount})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={subscriptionForm.status}
                                    onChange={e => setSubscriptionForm({...subscriptionForm, status: e.target.value})}
                                >
                                    <option value="TRIAL">Trial</option>
                                    <option value="ACTIVE">Active (Paid)</option>
                                    <option value="PAST_DUE">Past Due</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>
                         <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowSubscriptionModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button onClick={handleUpdateSubscription} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Subscription</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
