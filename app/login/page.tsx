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
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full border-4 border-blue-300">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-blue-600 mb-4">VCAT</h1>
                    <p className="text-3xl text-gray-600">Visual Cognitive Assessment Test</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-2xl font-semibold mb-2 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-5 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none"
                            placeholder="doctor@vcat.local"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-2xl font-semibold mb-2 text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-5 text-2xl border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 border-4 border-red-400 text-red-700 px-6 py-4 rounded-2xl text-xl">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white px-8 py-6 text-3xl font-bold rounded-2xl border-4 border-blue-600 hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Logging in...' : '🔐 Login'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xl text-gray-500">
                    <p>Default credentials:</p>
                    <p className="font-mono">doctor@vcat.local / admin123</p>
                </div>
            </div>
        </div>
    );
}
