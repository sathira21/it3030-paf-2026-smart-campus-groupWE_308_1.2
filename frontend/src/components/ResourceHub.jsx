import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Filter, Camera, 
    Trash2, Edit3, MapPin, Users, 
    PlusCircle, Info, X, Check,
    Building2, Presentation, Laptop
} from 'lucide-react';

const ResourceHub = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        description: ''
    });

    const token = localStorage.getItem('jwt_token');

    useEffect(() => {
        fetchResources();
    }, []);

    const showToastMsg = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const fetchResources = async () => {
        try {
            const res = await fetch('/api/resources', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setResources(data.data || []);
            }
            setLoading(false);
        } catch (e) {
            console.error('Fetch resources error', e);
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files].slice(0, 5));
    };

    const removeImage = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.description.length < 20) {
            showToastMsg('Description must be at least 20 characters.', 'error');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('type', formData.type);
        data.append('capacity', formData.capacity);
        data.append('location', formData.location);
        data.append('description', formData.description);
        
        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        const url = editingResource ? `/api/resources/${editingResource.id}` : '/api/resources';
        const method = editingResource ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                showToastMsg(`Resource ${editingResource ? 'updated' : 'created'} successfully!`, 'success');
                setShowModal(false);
                setEditingResource(null);
                setFormData({ name: '', type: 'LECTURE_HALL', capacity: '', location: '', description: '' });
                setSelectedFiles([]);
                fetchResources();
            } else {
                showToastMsg('Failed to save resource.', 'error');
            }
        } catch (e) {
            showToastMsg('Connection error.', 'error');
        }
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setFormData({
            name: resource.name,
            type: resource.type,
            capacity: resource.capacity,
            location: resource.location,
            description: resource.description
        });
        setSelectedFiles([]);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const res = await fetch(`/api/resources/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                showToastMsg('Resource deleted successfully.', 'success');
                fetchResources();
            } else {
                showToastMsg('Failed to delete resource.', 'error');
            }
        } catch (e) {
            showToastMsg('Connection error.', 'error');
        }
    };

    const filteredResources = resources.filter(r => 
        (typeFilter === 'ALL' || r.type === typeFilter) &&
        (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         r.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getTypeIcon = (type) => {
        switch(type) {
            case 'LECTURE_HALL': return <Presentation size={18} />;
            case 'LAB': return <Laptop size={18} />;
            case 'MEETING_ROOM': return <Building2 size={18} />;
            default: return <Info size={18} />;
        }
    };

    const getTypeLabel = (type) => {
        return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats Overlay */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 text-left">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-white rounded-full text-[11.5px] font-[800] text-blue-600 mb-[22px] w-fit shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-200">
                        <PlusCircle size={14} className="text-emerald-500" strokeWidth={3} />
                        Asset Inventory
                    </div>
                    <h1 className="text-[44px] font-[800] text-[#111827] leading-[1.1] tracking-[-0.04em]">
                        Resource <span className="text-gradient">Manager</span>
                    </h1>
                    <p className="text-[16px] text-[#64748b] font-[500] mt-3 max-w-[550px]">
                        Catalog and manage smart campus facilities, from high-tech labs to collaboration spaces.
                    </p>
                </div>
                
                <div className="premium-card p-6 flex items-center gap-5 min-w-[240px]">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-white">
                        <Building2 size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[11px] font-[800] text-slate-400 uppercase tracking-widest leading-none mb-2">Total Capacity</p>
                        <h3 className="text-3xl font-[900] text-slate-900 leading-none">
                            {resources.reduce((acc, r) => acc + (parseInt(r.capacity) || 0), 0)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4 flex-wrap w-full xl:w-auto">
                    <div className="relative flex-grow min-w-[300px]">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 rounded-full px-11 py-3 text-[14px] font-bold outline-none focus:border-blue-400 shadow-sm transition-all" 
                            placeholder="Find any resource or location..."
                        />
                    </div>
                    
                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-full shadow-inner border border-slate-200/50">
                        {['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setTypeFilter(f)} 
                                className={`px-5 py-2 rounded-full text-[11px] font-black tracking-tight transition-all duration-300 ${typeFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {f === 'ALL' ? 'Everything' : getTypeLabel(f)}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => { setEditingResource(null); setFormData({ name: '', type: 'LECTURE_HALL', capacity: '', location: '', description: '' }); setSelectedFiles([]); setShowModal(true); }}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5 whitespace-nowrap"
                >
                    <Plus size={18} strokeWidth={3} /> Register New Facility
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-40">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="premium-card py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                        <Search size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-900 font-[800] text-xl">No resources found</p>
                    <p className="text-slate-400 text-sm mt-1">Refine your search parameters or add a new facility.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {filteredResources.map((r, idx) => (
                        <div key={r.id} className="premium-card group overflow-hidden hover:scale-[1.02] transition-all duration-500">
                            <div className="h-48 relative overflow-hidden bg-slate-100">
                                <img 
                                    src={r.images && r.images[0] ? r.images[0] : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    alt={r.name}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-blue-600 shadow-sm flex items-center gap-1.5 uppercase tracking-widest border border-white">
                                        {getTypeIcon(r.type)}
                                        {getTypeLabel(r.type)}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
                                        <button onClick={() => openEditModal(r)} className="flex-1 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[11px] font-black text-slate-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-lg">
                                            <Edit3 size={14} /> Update
                                        </button>
                                        <button onClick={() => handleDelete(r.id)} className="p-2 bg-rose-500 rounded-xl text-white shadow-lg hover:bg-rose-600 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-7">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-[19px] font-[800] text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                                        {r.name}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px]">
                                        <MapPin size={13} className="text-slate-300" />
                                        {r.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[12px]">
                                        <Users size={13} className="text-slate-300" />
                                        Cap: {r.capacity}
                                    </div>
                                </div>
                                <p className="text-[13px] text-slate-500 mt-4 leading-relaxed line-clamp-2">
                                    {r.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-[700px] w-full text-center shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8 text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <PlusCircle size={28} />
                                </div>
                                <div>
                                    <h3 className="text-[24px] font-[900] text-slate-900 leading-none mb-2">
                                        {editingResource ? 'Modify Asset' : 'Register New Asset'}
                                    </h3>
                                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                                        Smart Campus infrastructure management
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="text-left space-y-8">
                            {/* Image Dropzone */}
                            <div className="p-8 border-2 border-dashed border-blue-100 rounded-[32px] bg-blue-50/10 text-center relative group hover:border-blue-300 transition-all">
                                {selectedFiles.length === 0 ? (
                                    <>
                                        <div className="w-16 h-16 bg-white rounded-[20px] shadow-lg border border-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Camera size={28} className="text-blue-600" />
                                        </div>
                                        <h4 className="text-lg font-[900] text-slate-900 mb-1">Visual Asset Upload</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">High resolution facility imagery (Max 5)</p>
                                        <button 
                                            type="button" 
                                            onClick={() => document.getElementById('res-img').click()}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-100 mb-2 hover:bg-blue-700 transition-colors"
                                        >
                                            Browse Gallery
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {selectedFiles.map((file, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md group/img">
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <X size={20} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ))}
                                        {selectedFiles.length < 5 && (
                                            <button 
                                                type="button"
                                                onClick={() => document.getElementById('res-img').click()}
                                                className="w-24 h-24 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <input type="file" id="res-img" className="hidden" multiple accept="image/*" onChange={handleImageSelect} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Asset Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="e.g., Quantum Computing Lab"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-[14px] font-bold outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Asset Type</label>
                                    <select 
                                        name="type"
                                        value={formData.type}
                                        onChange={handleFormChange}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-[14px] font-bold outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                    >
                                        <option value="LECTURE_HALL">🏛️ Lecture Hall</option>
                                        <option value="LAB">💻 Computer Lab</option>
                                        <option value="MEETING_ROOM">🤝 Meeting Room</option>
                                        <option value="EQUIPMENT">🔧 Equipment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Max Capacity</label>
                                    <input 
                                        type="number" 
                                        name="capacity"
                                        required
                                        value={formData.capacity}
                                        onChange={handleFormChange}
                                        placeholder="50"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-[14px] font-bold outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Geographic Location</label>
                                    <input 
                                        type="text" 
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleFormChange}
                                        placeholder="Block E, Level 3"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-[14px] font-bold outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm" 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-2 ml-1">
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400">Detailed Specification</label>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${formData.description.length < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {formData.description.length} / 20 MIN
                                        </span>
                                    </div>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows="3"
                                        placeholder="Detail the specialized features, equipment, and rules..."
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-6 py-4 text-[14px] font-bold outline-none focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-[900] text-lg shadow-2xl shadow-blue-100 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
                                {editingResource ? <Check size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                                {editingResource ? 'Update Facility Catalog' : 'Register Deployment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {toast.show && (
                <div className={`fixed bottom-10 right-10 z-[9999] pl-6 pr-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-4 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-2 transition-all animate-in slide-in-from-bottom-5 ${
                    toast.type === 'success' ? 'text-emerald-600 border-emerald-50' : 'text-rose-600 border-rose-50'
                }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {toast.type === 'success' ? <Check size={22} strokeWidth={3} className="text-emerald-600" /> : <X size={22} strokeWidth={3} className="text-rose-600" />}
                    </div>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default ResourceHub;
