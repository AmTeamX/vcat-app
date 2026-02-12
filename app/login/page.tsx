'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border-2 border-blue-300">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">VCAT</h1>
                    <p className="text-xl text-gray-600">Visual Cognitive Assessment Test</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="doctor@vcat.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-1 text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-base">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white px-6 py-4 text-2xl font-bold rounded-xl border-2 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Logging in...' : '🔐 Login'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-base text-gray-600">
                        ยังไม่มีบัญชี?{' '}
                        <button
                            onClick={() => router.push('/register')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            ลงทะเบียนที่นี่
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
