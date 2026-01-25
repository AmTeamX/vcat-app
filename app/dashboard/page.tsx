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
        // Verify authentication
        fetch('/api/patients')
            .then((res) => {
                if (!res.ok) {
                    router.push('/login');
                } else {
                    setLoading(false);
                }
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
                <div className="text-4xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="w-screen mx-auto mb-2">
                <div className="bg-white p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-pink-600 mb-2">VCAT Dashboard</h1>
                        </div>
                        {/* Search Bar */}
                        <div className="w-full">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="🔍 Search patients by name..."
                                className="w-full px-6 py-4 text-xl border-4 border-gray-300 rounded-4xl focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* User Dropdown */}
                        <div className="relative h-full my-auto">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className=" text-gray-800 px-8 h-full text-md font-bold hover:scale-105 active:scale-95 flex items-center js gap-3 w-fit"
                            >
                                👤 {doctorName}
                                <span className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-4 border-gray-300 overflow-hidden z-50">
                                    <button
                                        onClick={() => router.push('/dashboard/results')}
                                        className="w-full px-6 py-4 text-xl font-bold text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-pink-600"
                                    >
                                        <span><img src="/icons/list-svgrepo-com.svg" className='h-6' />  </span>
                                        All Result
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            handleLogout();
                                        }}
                                        className="w-full px-6 py-4 text-xl font-bold text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                                    >
                                        <span><img src="/icons/logout-svgrepo-com.svg" className='h-6' />  </span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Patient List */}
            <div className="w-screen mx-auto px-8">
                <PatientList search={search} />
            </div>
        </div>
    );
}
