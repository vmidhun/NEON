import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Save, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface TenantSettingsProps {
    tenantId: string;
    onBack: () => void;
}

const TenantSettings: React.FC<TenantSettingsProps> = ({ tenantId, onBack }) => {
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState<any>(null);
    const [tenant, setTenant] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch tenant details (we could pass this as prop, but safer to fetch if we want fresh data)
                // Since there is no direct getTenantById in previous check, let's rely on admin user fetch mainly, 
                // but we also want tenant name. 
                // We'll trust the parent to pass tenant name? Or just fetch tenant admin and assume context.
                // To be robust, let's fetch list and find. Or if we added getTenantById use that.
                // Assuming we just want to manage the Admin User.
                
                const adminRes = await api.get(`/super/tenants/${tenantId}/admin`);
                setAdminUser(adminRes);
                setName(adminRes.name);
                setEmail(adminRes.email);

                // Try to find the tenant from list (inefficient but works without new API)
                // Or better, let's just use what we have.
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tenant admin details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tenantId]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        try {
            const res = await api.put(`/super/tenants/${tenantId}/admin`, { name, email });
            setAdminUser(res);
            setSuccessMsg('Tenant Admin profile updated successfully');
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        if (!newPassword) {
            setError('Password is required');
            return;
        }
        try {
            await api.put(`/super/tenants/${tenantId}/admin/password`, { password: newPassword });
            setSuccessMsg('Password reset successfully');
            setNewPassword('');
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Tenant Settings</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Profile Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" />
                        Tenant Admin Profile
                    </h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-500" />
                        Security Check
                    </h2>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reset Admin Password</label>
                            <input 
                                type="text" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                This will invalidate the admin's current session.
                            </p>
                        </div>
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" /> Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TenantSettings;
