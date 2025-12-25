import React, { useState, useEffect } from 'react';
import { Employee, UserRole, Team, EmergencyContact } from '../types';
import { api } from '../services/api';
import { X, Upload, User, Briefcase, CreditCard, FileText, Phone, Camera } from 'lucide-react';

interface EmployeeFullProfileProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  teams: Team[];
  users: Employee[]; // For reporting manager selection
  canEdit: boolean;
}

type TabType = 'personal' | 'employment' | 'financial' | 'documents' | 'emergency';

const EmployeeFullProfile: React.FC<EmployeeFullProfileProps> = ({
  employee,
  isOpen,
  onClose,
  onUpdate,
  teams,
  users,
  canEdit,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [formData, setFormData] = useState<Employee>(employee);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  const handleInputChange = (
    section: keyof Employee | 'root',
    field: string,
    value: any
  ) => {
    if (section === 'root') {
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...(formData[section] as any || {}),
          [field]: value
        }
      });
    }
  };

  const handleEmergencyContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const contacts = [...(formData.emergencyContacts || [])];
    if (!contacts[index]) contacts[index] = {};
    contacts[index][field] = value;
    setFormData({ ...formData, emergencyContacts: contacts });
  };

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [...(formData.emergencyContacts || []), {}]
    });
  };
  
  const removeEmergencyContact = (index: number) => {
      const contacts = [...(formData.emergencyContacts || [])];
      contacts.splice(index, 1);
      setFormData({ ...formData, emergencyContacts: contacts });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, section: 'root' | 'documents') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await api.uploadFile(file);
        if (section === 'root') {
             // For Avatar
             handleInputChange('root', field, url);
        } else {
             // For Documents
             handleInputChange('documents', field, url);
        }
      } catch (error) {
        console.error("File upload failed", error);
        alert("File upload failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateUser(formData._id, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Helpers ---
  const InputGroup = ({ label, value, onChange, type = "text", disabled = !canEdit, required = false, className = "" }: any) => (
    <div className={`mb-3 ${className}`}>
      <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">{label} {required && '*'}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#00AEEF] disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );

  const SelectGroup = ({ label, value, onChange, options, disabled = !canEdit }: any) => (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#00AEEF] disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="">Select...</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        
        {/* Top Header Section */}
        <div className="flex items-center p-6 bg-slate-50 border-b border-gray-200">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white overflow-hidden border-2 border-gray-200 shadow-sm">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={32} />
                </div>
              )}
            </div>
            {canEdit && (
              <label className="absolute bottom-0 right-0 p-1.5 bg-[#00AEEF] text-white rounded-full cursor-pointer hover:bg-[#008CCF] transition-colors shadow-sm">
                <Camera size={12} />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatarUrl', 'root')} />
              </label>
            )}
          </div>

          <div className="ml-5 flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Briefcase size={14} /> {formData.designation || 'No Designation'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-500">{formData.role}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-500">{formData.email}</span>
            </div>
            </div>

          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white px-6">
          <nav className="flex space-x-6">
                {[
                    { id: 'personal', label: 'Personal Info', icon: User },
                    { id: 'employment', label: 'Employment Details', icon: Briefcase },
                    { id: 'financial', label: 'Financial & Legal', icon: CreditCard },
                    { id: 'documents', label: 'Documents', icon: FileText },
                    { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                          ? 'border-[#00AEEF] text-[#00AEEF]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                    <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <form id="profile-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto">

            {activeTab === 'personal' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <InputGroup label="Full Name" value={formData.name} onChange={(v: string) => handleInputChange('root', 'name', v)} required />
                  <InputGroup label="Personal Email" value={formData.personalInfo?.personalEmail} onChange={(v: string) => handleInputChange('personalInfo', 'personalEmail', v)} type="email" />
                  <InputGroup label="Mobile Number" value={formData.personalInfo?.mobileNumber} onChange={(v: string) => handleInputChange('personalInfo', 'mobileNumber', v)} />

                  <InputGroup label="Secondary Number" value={formData.personalInfo?.secondaryNumber} onChange={(v: string) => handleInputChange('personalInfo', 'secondaryNumber', v)} />
                  <InputGroup label="Date of Birth" value={formData.personalInfo?.dob ? new Date(formData.personalInfo.dob).toISOString().split('T')[0] : ''} onChange={(v: string) => handleInputChange('personalInfo', 'dob', v)} type="date" />
                  <SelectGroup label="Gender" value={formData.personalInfo?.gender} onChange={(v: string) => handleInputChange('personalInfo', 'gender', v)} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />

                  <SelectGroup label="Marital Status" value={formData.personalInfo?.maritalStatus} onChange={(v: string) => handleInputChange('personalInfo', 'maritalStatus', v)} options={[{ value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' }, { value: 'Divorced', label: 'Divorced' }]} />
                  <SelectGroup label="Blood Group" value={formData.personalInfo?.bloodGroup} onChange={(v: string) => handleInputChange('personalInfo', 'bloodGroup', v)} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => ({ value: g, label: g }))} />
                  <InputGroup label="Nationality" value={formData.personalInfo?.nationality} onChange={(v: string) => handleInputChange('personalInfo', 'nationality', v)} />

                  <div className="md:col-span-2">
                    <InputGroup label="Current Address" value={formData.personalInfo?.currentAddress} onChange={(v: string) => handleInputChange('personalInfo', 'currentAddress', v)} />
                  </div>
                  <div className="md:col-span-1">
                    <InputGroup label="LinkedIn Profile" value={formData.personalInfo?.linkedinProfile} onChange={(v: string) => handleInputChange('personalInfo', 'linkedinProfile', v)} />
                  </div>

                  <div className="md:col-span-3">
                    <InputGroup label="Permanent Address" value={formData.personalInfo?.permanentAddress} onChange={(v: string) => handleInputChange('personalInfo', 'permanentAddress', v)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employment' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            <InputGroup label="Employee ID" value={formData.employmentDetails?.empId} onChange={(v: string) => handleInputChange('employmentDetails', 'empId', v)} />
                            <InputGroup label="Official Email" value={formData.email} onChange={(v: string) => handleInputChange('root', 'email', v)} type="email" disabled />
                  <SelectGroup label="Status" value={formData.employmentDetails?.employmentStatus} onChange={(v: string) => handleInputChange('employmentDetails', 'employmentStatus', v)} options={['Active', 'Notice Period', 'Terminated', 'Sabbatical'].map(s => ({ value: s, label: s }))} />

                            <InputGroup label="Designation (Current)" value={formData.designation} onChange={(v: string) => handleInputChange('root', 'designation', v)} />
                            <InputGroup label="Official Designation (Payslip)" value={formData.employmentDetails?.officialDesignation} onChange={(v: string) => handleInputChange('employmentDetails', 'officialDesignation', v)} />
                  <SelectGroup label="Employment Type" value={formData.employmentDetails?.employmentType} onChange={(v: string) => handleInputChange('employmentDetails', 'employmentType', v)} options={['Full-time', 'Contract', 'Intern'].map(t => ({ value: t, label: t }))} />
                            
                  <SelectGroup label="Role" value={formData.role} onChange={(v: string) => handleInputChange('root', 'role', v)} options={Object.values(UserRole).map(r => ({ value: r, label: r }))} />
                  <SelectGroup label="Team" value={formData.teamId} onChange={(v: string) => handleInputChange('root', 'teamId', v)} options={teams.map(t => ({ value: t._id, label: t.name }))} />
                  <SelectGroup label="Reporting Manager" value={formData.reportingManagerId} onChange={(v: string) => handleInputChange('root', 'reportingManagerId', v)} options={users.filter(u => u._id !== formData._id).map(u => ({ value: u._id, label: u.name }))} />

                  <InputGroup label="Date of Joining" value={formData.employmentDetails?.doj ? new Date(formData.employmentDetails.doj).toISOString().split('T')[0] : ''} onChange={(v: string) => handleInputChange('employmentDetails', 'doj', v)} type="date" />
                  <InputGroup label="Confirmation Date" value={formData.employmentDetails?.confirmationDate ? new Date(formData.employmentDetails.confirmationDate).toISOString().split('T')[0] : ''} onChange={(v: string) => handleInputChange('employmentDetails', 'confirmationDate', v)} type="date" />
                  <InputGroup label="Hierarchy Level" value={formData.hierarchyLevel} onChange={(v: string) => handleInputChange('root', 'hierarchyLevel', parseInt(v))} type="number" />

                  <div className="md:col-span-3">
                    <InputGroup label="Work Location" value={formData.employmentDetails?.workLocation} onChange={(v: string) => handleInputChange('employmentDetails', 'workLocation', v)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4 uppercase tracking-wide">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                  <InputGroup label="Bank Name" value={formData.financialDetails?.bankName} onChange={(v: string) => handleInputChange('financialDetails', 'bankName', v)} />
                  <InputGroup label="Account Holder Name" value={formData.financialDetails?.accountHolderName} onChange={(v: string) => handleInputChange('financialDetails', 'accountHolderName', v)} />
                  <InputGroup label="Account Number" value={formData.financialDetails?.accountNumber} onChange={(v: string) => handleInputChange('financialDetails', 'accountNumber', v)} />
                  <InputGroup label="IFSC Code" value={formData.financialDetails?.ifscCode} onChange={(v: string) => handleInputChange('financialDetails', 'ifscCode', v)} />
                </div>

                <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4 mt-6 uppercase tracking-wide">Tax & Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputGroup label="PAN Card Number" value={formData.financialDetails?.panCardNumber} onChange={(v: string) => handleInputChange('financialDetails', 'panCardNumber', v)} />
                  <InputGroup label="Aadhaar Number" value={formData.financialDetails?.aadhaarNumber} onChange={(v: string) => handleInputChange('financialDetails', 'aadhaarNumber', v)} />
                  <InputGroup label="UAN Number (PF)" value={formData.financialDetails?.uanNumber} onChange={(v: string) => handleInputChange('financialDetails', 'uanNumber', v)} />
                  <InputGroup label="PF Account Number" value={formData.financialDetails?.pfAccountNumber} onChange={(v: string) => handleInputChange('financialDetails', 'pfAccountNumber', v)} />
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                {[
                  { key: 'resumeUrl', label: 'Resume/CV' },
                  { key: 'offerLetterUrl', label: 'Offer Letter' },
                  { key: 'appointmentLetterUrl', label: 'Appointment Letter' },
                  { key: 'idProofUrl', label: 'ID Proof (Aadhaar/Passport)' },
                  { key: 'photoUrl', label: 'Formal Photo' }
                ].map((doc) => (
                          <div key={doc.key} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">{doc.label}</h4>
                              {formData.documents?.[doc.key as keyof typeof formData.documents] ? (
                                <a
                                  href={formData.documents[doc.key as keyof typeof formData.documents]}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-[#00AEEF] hover:underline mt-1 block flex items-center gap-1"
                                >
                                  <FileText size={12} /> View Document
                                </a>
                              ) : (
                                <span className="text-xs text-gray-400 mt-1 block">No document uploaded</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <label className="cursor-pointer bg-white px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                <span className="flex items-center space-x-2">
                                  <Upload size={14} />
                                  <span>Upload</span>
                                </span>
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.key, 'documents')} disabled={!canEdit} />
                              </label>
                            </div>
                          </div>
                        ))}
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                {formData.emergencyContacts?.map((contact, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg relative bg-gray-50/50">
                            <button
                              type="button"
                              onClick={() => removeEmergencyContact(index)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              disabled={!canEdit}
                            >
                              <X size={16} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InputGroup label="Name" value={contact.name} onChange={(v: string) => handleEmergencyContactChange(index, 'name', v)} />
                              <InputGroup label="Relationship" value={contact.relationship} onChange={(v: string) => handleEmergencyContactChange(index, 'relationship', v)} />
                              <InputGroup label="Phone" value={contact.phone} onChange={(v: string) => handleEmergencyContactChange(index, 'phone', v)} />
                              <InputGroup label="Email" value={contact.email} onChange={(v: string) => handleEmergencyContactChange(index, 'email', v)} />
                            </div>
                          </div>
                        ))}
                {canEdit && (
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#00AEEF] hover:text-[#00AEEF] hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-medium"
                  >
                    <span>+ Add Contact</span>
                  </button>
                )}
              </div>
            )}

          </form>
        </div>

        {/* Footer Actions */}
        {canEdit && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 bg-[#00AEEF] text-white rounded hover:bg-[#008CCF] text-sm font-medium shadow-sm flex items-center space-x-2 disabled:opacity-50 transition-colors"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeFullProfile;
