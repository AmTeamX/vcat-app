'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PatientForm from './PatientForm';

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
    medicalConditions: string;
}

interface PatientListProps {
    search?: string;
}

export default function PatientList({ search = '' }: PatientListProps) {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

    useEffect(() => {
        fetchPatients();
    }, [search]);

    const fetchPatients = async () => {
        try {
            const url = search
                ? `/api/patients?search=${encodeURIComponent(search)}`
                : '/api/patients';

            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                setPatients(data.patients);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPatient = async (data: Omit<Patient, 'id'>) => {
        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setShowForm(false);
                fetchPatients();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to add patient');
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('Failed to add patient');
        }
    };

    const handleEditPatient = async (data: Omit<Patient, 'id'>) => {
        if (!editingPatient) return;

        try {
            const res = await fetch(`/api/patients/${editingPatient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setEditingPatient(null);
                fetchPatients();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to update patient');
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Failed to update patient');
        }
    };

    const handleDeletePatient = async (id: string) => {
        if (!confirm('Are you sure you want to delete this patient? This will also delete all their test results.')) {
            return;
        }

        try {
            const res = await fetch(`/api/patients/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchPatients();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to delete patient');
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Failed to delete patient');
        }
    };

    const handleStartTest = (patientId: string) => {
        router.push(`/test?patientId=${patientId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-4xl text-gray-600">กำลังโหลด</div>
            </div>
        );
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">รายชื่อผู้ทดสอบ</h2>
                </div>
                {/* Add Button - Moved to right, title removed (handled by parent) */}
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-pink-500 text-white px-5 py-2.5 text-base font-bold rounded-2xl shadow-pink-200 shadow-lg hover:bg-pink-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>เพิ่มผู้ทดสอบ</span>
                </button>
            </div>

            {/* Patient Grid */}
            {patients.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4 opacity-50">👥</div>
                    <p className="text-xl text-gray-500 font-medium">
                        {search ? 'ไม่พบผู้ทดสอบ' : 'ยังไม่มีผู้ทดสอบในระบบ'}
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 text-pink-500 font-bold hover:underline"
                    >
                        + เพิ่มผู้ทดสอบใหม่
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {patients.map((patient) => (
                        <div
                            key={patient.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-all flex flex-col h-full"
                        >
                            <div className="mb-4 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold shrink-0">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setDropdownOpen(dropdownOpen === patient.id ? null : patient.id)}
                                            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>

                                        {dropdownOpen === patient.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(null)} />
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={() => {
                                                            setDropdownOpen(null);
                                                            setEditingPatient(patient);
                                                        }}
                                                        className="w-full px-4 py-3 text-sm font-bold text-left hover:bg-yellow-50 text-yellow-700 flex items-center gap-3 transition-colors"
                                                    >
                                                        <span>✏️</span> แก้ไขข้อมูล
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDropdownOpen(null);
                                                            handleDeletePatient(patient.id);
                                                        }}
                                                        className="w-full px-4 py-3 text-sm font-bold text-left hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
                                                    >
                                                        <span>🗑️</span> ลบ
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1 truncate">
                                    {patient.name}
                                </h3>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {patient.gender}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span>อายุ {patient.age} ปี</span>
                                    </div>
                                    {patient.notes && (
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed bg-gray-50 p-2 rounded-lg">
                                            {patient.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleStartTest(patient.id)}
                                    className="col-span-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2.5 rounded-xl transition-all active:scale-95 flex flex-col items-center justify-center gap-1 group"
                                >
                                    <span className="text-lg bg-white/20 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-white/30 transition-colors">▶️</span>
                                    <span className="text-xs font-bold">ทำแบบทดสอบ</span>
                                </button>
                                <button
                                    onClick={() => router.push(`/dashboard/patients/${patient.id}/results`)}
                                    className="col-span-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2.5 rounded-xl transition-all active:scale-95 flex flex-col items-center justify-center gap-1 group"
                                >
                                    <span className="text-lg bg-white/20 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-white/30 transition-colors">📊</span>
                                    <span className="text-xs font-bold">ผลการทดสอบ</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {showForm && (
                <PatientForm
                    onSave={handleAddPatient}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingPatient && (
                <PatientForm
                    patient={editingPatient}
                    onSave={handleEditPatient}
                    onCancel={() => setEditingPatient(null)}
                />
            )}
        </div>
    );
}
