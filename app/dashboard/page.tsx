'use client';

import PatientList from '@/components/PatientList';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const router = useRouter();
    const [doctorName, setDoctorName] = useState('Doctor');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Fetch doctor info and verify authentication
        Promise.all([
            fetch('/api/auth/me'),
            fetch('/api/patients')
        ])
            .then(async ([meRes, patientsRes]) => {
                if (!meRes.ok || !patientsRes.ok) {
                    router.push('/login');
                    return;
                }

                const meData = await meRes.json();
                if (meData.doctor) {
                    setDoctorName(meData.doctor.name);
                }

                setLoading(false);
            })
            .catch(() => {
                router.push('/login');
            });
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mx-auto mb-4"></div>
                    <div className="text-2xl text-gray-600 animate-pulse">กำลังโหลด...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header Section */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-4">
                        {/* Title / Brand */}
                        <div className="shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-200">
                                <span className="text-white font-bold text-xl">V</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 hidden sm:block">
                                VCAT Dashboard
                            </h1>
                        </div>

                        {/* Search Bar - Enhanced for Touch */}
                        <div className="flex-1 max-w-lg">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 group-focus-within:text-pink-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="ค้นหาชื่อผู้ทดสอบ..."
                                    className="block w-full pl-12 pr-4 py-3 bg-gray-100/50 border-none text-gray-900 placeholder-gray-500 text-base rounded-2xl focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="relative shrink-0 ml-2">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 pl-2 pr-2 sm:pr-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                                    {doctorName.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-left mr-1">
                                    <p className="text-sm font-bold text-gray-700 leading-tight">{doctorName}</p>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Doctor</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2">
                                            <div className="px-4 py-3 border-b border-gray-50 mb-1 sm:hidden">
                                                <p className="text-sm font-bold text-gray-900">{doctorName}</p>
                                                <p className="text-xs text-gray-500">Doctor Profile</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    handleLogout();
                                                }}
                                                className="w-full px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3 group"
                                            >
                                                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                                    <img src="/icons/logout-svgrepo-com.svg" className='h-4 w-4' alt="logout" />
                                                </div>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 p-6 sm:p-8 min-h-[calc(100vh-140px)]">
                    <PatientList search={search} />
                </div>
            </main>
        </div>
    );
}
