'use client';

import { useState } from 'react';

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    notes: string;
    medicalConditions: string;
}

interface PatientFormProps {
    patient?: Patient | null;
    onSave: (data: Omit<Patient, 'id'>) => void;
    onCancel: () => void;
}

export default function PatientForm({ patient, onSave, onCancel }: PatientFormProps) {
    const [name, setName] = useState(patient?.name || '');
    const [age, setAge] = useState(patient?.age?.toString() || '');
    const [gender, setGender] = useState(patient?.gender || 'ชาย');
    const [notes, setNotes] = useState(patient?.notes || '');
    const [medicalConditions, setMedicalConditions] = useState(patient?.medicalConditions || '');

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
            medicalConditions,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 100 }}>
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onCancel} />

            <div className="bg-white rounded-4xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-gray-900/5">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm ${patient ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            {patient ? '✏️' : '👤'}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {patient ? 'แก้ไขข้อมูล' : 'ลงทะเบียนใหม่'}
                        </h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Content - Enhanced scroll visibility */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                            {/* Name - Full width on mobile, 8 cols on tablet */}
                            <div className="sm:col-span-12 md:col-span-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    placeholder="ระบุชื่อและนามสกุล"
                                    required
                                />
                            </div>

                            {/* Age - 3 cols */}
                            <div className="sm:col-span-6 md:col-span-3">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    อายุ (ปี) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-center font-variant-numeric"
                                        placeholder="0"
                                        min="0"
                                        max="120"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Gender - 3 cols */}
                            <div className="sm:col-span-6 md:col-span-3">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    เพศ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Conditions */}
                            <div className="sm:col-span-12 md:col-span-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 items-center gap-2">
                                    <span className="p-1 bg-red-50 rounded text-red-500">🏥</span>
                                    โรคประจำตัว / ประวัติ
                                </label>
                                <textarea
                                    value={medicalConditions}
                                    onChange={(e) => setMedicalConditions(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                                    placeholder="ระบุโรคประจำตัว (ถ้ามี)"
                                    rows={4}
                                />
                            </div>

                            {/* Notes */}
                            <div className="sm:col-span-12 md:col-span-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 items-center gap-2">
                                    <span className="p-1 bg-blue-50 rounded text-blue-500">📝</span>
                                    หมายเหตุเพิ่มเติม
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                                    placeholder="ข้อมูลอื่นๆ ที่ต้องการบันทึก"
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Scroll hint for mobile/small screens */}
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-2 sm:hidden opacity-70">
                            <div className="h-px w-12 bg-gray-200"></div>
                            <span>เลื่อนเพื่อดูข้อมูลเพิ่มเติม</span>
                            <div className="h-px w-12 bg-gray-200"></div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all active:scale-[0.98]"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        form="patient-form"
                        className="flex-2 px-4 py-3 text-base font-bold text-white bg-pink-500 rounded-xl hover:bg-pink-600 focus:ring-4 focus:ring-gray-200 transition-all shadow-lg shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>{patient ? '💾 บันทึกการแก้ไข' : '✅ บันทึกข้อมูล'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
