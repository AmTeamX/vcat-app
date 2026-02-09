'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        registrationCode: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                    registrationCode: formData.registrationCode,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'ลงทะเบียนไม่สำเร็จ');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-2 border-blue-300">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">สมัครสมาชิก VCAT</h1>
                    <p className="text-lg text-gray-600">Visual Cognitive Assessment Test</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg font-semibold mb-1 text-gray-700">
                                ชื่อ
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="สมชาย"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-1 text-gray-700">
                                นามสกุล
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="รักชาติ"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="doctor@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-700">
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="อย่างน้อย 6 ตัวอักษร"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-700">
                            ยืนยันรหัสผ่าน
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-700">
                            🔑 รหัสลงทะเบียน
                        </label>
                        <input
                            type="text"
                            name="registrationCode"
                            value={formData.registrationCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="กรอกรหัสลงทะเบียน"
                            required
                            disabled={loading}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            ติดต่อผู้ดูแลระบบเพื่อขอรหัสลงทะเบียน
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-base">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white px-6 py-4 text-2xl font-bold rounded-xl border-2 border-green-600 hover:bg-green-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ กำลังลงทะเบียน...' : '✅ ลงทะเบียน'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-base text-gray-600">
                        มีบัญชีอยู่แล้ว?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
