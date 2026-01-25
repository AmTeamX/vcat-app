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
                <div className="text-4xl text-gray-600">Loading patients...</div>
            </div>
        );
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-4xl font-bold text-black '>My Patients</h1>
                {/* Add Button */}
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-pink-500 text-white px-4 py-2 text-xl font-bold rounded-4xl border-4 border-pink-600 hover:bg-pink-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <span><img src="/icons/add-circle-svgrepo-com.svg" className='h-6' />  </span>
                    <h1 className=''>Add Patient</h1>
                </button>
            </div>

            {/* Patient Grid */}
            {patients.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-3xl text-gray-600">
                        {search ? 'No patients found' : 'No patients yet. Add your first patient!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {patients.map((patient) => (
                        <div
                            key={patient.id}
                            className="bg-white rounded-3xl shadow-xl p-6 border-4 border-gray-200 hover:border-blue-400 transition-all"
                        >
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {patient.name}
                                </h3>
                                <div className="text-xl text-gray-600 space-y-1">
                                    <p>👤 {patient.gender}</p>
                                    <p>🎂 {patient.age} years old</p>
                                    {patient.notes && (
                                        <p className="text-lg mt-2 text-gray-500">📝 {patient.notes}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleStartTest(patient.id)}
                                    className="flex-1 bg-green-500 text-white px-4 py-4 text-xl font-bold rounded-xl border-4 border-green-600 hover:bg-green-600 transition-all hover:scale-105 active:scale-95"
                                >
                                    ▶️ Test
                                </button>
                                <button
                                    onClick={() => router.push(`/dashboard/patients/${patient.id}/results`)}
                                    className="flex-1 bg-blue-500 text-white px-4 py-4 text-xl font-bold rounded-xl border-4 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                                >
                                    📊 Results
                                </button>

                                {/* Actions Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(dropdownOpen === patient.id ? null : patient.id)}
                                        className="bg-gray-500 text-white px-4 py-4 text-2xl font-bold rounded-xl border-4 border-gray-600 hover:bg-gray-600 transition-all hover:scale-105 active:scale-95"
                                    >
                                        ⋮
                                    </button>

                                    {dropdownOpen === patient.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-4 border-gray-300 overflow-hidden z-50">
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(null);
                                                    setEditingPatient(patient);
                                                }}
                                                className="w-full px-4 py-3 text-lg font-bold text-left hover:bg-yellow-50 transition-colors flex items-center gap-2 text-yellow-700 border-b-2 border-gray-200"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(null);
                                                    handleDeletePatient(patient.id);
                                                }}
                                                className="w-full px-4 py-3 text-lg font-bold text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
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
