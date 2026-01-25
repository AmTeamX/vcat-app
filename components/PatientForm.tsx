'use client';

import { useState } from 'react';

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
}

interface PatientFormProps {
    patient?: Patient | null;
    onSave: (data: Omit<Patient, 'id'>) => void;
    onCancel: () => void;
}

export default function PatientForm({ patient, onSave, onCancel }: PatientFormProps) {
    const [name, setName] = useState(patient?.name || '');
    const [age, setAge] = useState(patient?.age?.toString() || '');
    const [gender, setGender] = useState(patient?.gender || 'Male');
    const [notes, setNotes] = useState(patient?.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !age) {
            alert('Please fill in all required fields');
            return;
        }

        onSave({
            name,
            age: Number(age),
            gender,
            notes,
        });
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                    {patient ? 'Edit Patient' : 'Add New Patient'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-2xl font-semibold mb-2 text-gray-700">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none"
                            placeholder="Enter patient name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-2xl font-semibold mb-2 text-gray-700">
                            Age *
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none"
                            placeholder="Enter age"
                            min="0"
                            max="120"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-2xl font-semibold mb-2 text-gray-700">
                            Gender *
                        </label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none bg-white"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-2xl font-semibold mb-2 text-gray-700">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none"
                            placeholder="Additional notes (optional)"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white px-8 py-6 text-2xl font-bold rounded-2xl border-4 border-green-600 hover:bg-green-600 transition-all hover:scale-105 active:scale-95"
                        >
                            💾 Save
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 text-gray-800 px-8 py-6 text-2xl font-bold rounded-2xl border-4 border-gray-400 hover:bg-gray-400 transition-all hover:scale-105 active:scale-95"
                        >
                            ✖️ Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
