"use client";

import { useStore } from "@/store/useStore";

export function SignupView() {
    const { setActiveView, setIsAuthenticated } = useStore();

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display bg-[#fdfafb] text-slate-900 antialiased">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-10 py-4 bg-[#fdfafb]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3 text-primary">
                    <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                        <span className="material-symbols-outlined">auto_awesome_motion</span>
                    </div>
                    <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">RN-bound</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline text-slate-500 text-sm font-medium">Have an account?</span>
                    <button
                        onClick={() => setActiveView('login')}
                        className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 border-2 border-primary text-primary text-sm font-bold transition-all hover:bg-primary/5"
                    >
                        Log In
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col md:flex-row">
                {/* Left — Workspace Image Panel */}
                <div className="hidden md:flex w-1/2 bg-[#fcf8f9] items-center justify-center p-12 lg:p-24">
                    <div className="relative w-full max-w-lg aspect-square rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/workspace.png"
                            alt="Aesthetic workspace with lamp and plant"
                            className="w-full h-full object-cover grayscale-[20%] sepia-[10%] opacity-90"
                        />
                        <div className="absolute bottom-8 left-8 right-8 z-20 p-6 bg-white/40 backdrop-blur-md rounded-xl border border-white/20">
                            <p className="text-slate-800 font-medium italic">&ldquo;A clean space is a clean mind.&rdquo;</p>
                        </div>
                    </div>
                </div>

                {/* Right — Sign Up Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-[#fdfafb]">
                    <div className="w-full max-w-md space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Create your space
                            </h1>
                            <p className="text-slate-500 text-base">
                                Join RN-bound and organize your journey.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSignUp}>
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                    <input
                                        className="w-full pl-12 pr-4 h-14 bg-white border border-[#fceef1] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 text-slate-900"
                                        placeholder="Jane Doe"
                                        type="text"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                    <input
                                        className="w-full pl-12 pr-4 h-14 bg-white border border-[#fceef1] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 text-slate-900"
                                        placeholder="jane@rn-bound.com"
                                        type="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Create Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                                    <input
                                        className="w-full pl-12 pr-12 h-14 bg-white border border-[#fceef1] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 text-slate-900"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" type="button">
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-center gap-2 pt-2">
                                <input className="rounded border-[#fceef1] text-primary focus:ring-primary/20 cursor-pointer" id="terms" type="checkbox" />
                                <label className="text-xs text-slate-500 cursor-pointer" htmlFor="terms">
                                    I agree to the <a className="text-primary hover:underline cursor-pointer">Terms of Service</a> and <a className="text-primary hover:underline cursor-pointer">Privacy Policy</a>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                                type="submit"
                            >
                                <span>Sign Up</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </form>

                        {/* Switch to login */}
                        <div className="pt-6 text-center">
                            <p className="text-slate-500 text-sm">
                                Already have an account?
                                <button
                                    onClick={() => setActiveView('login')}
                                    className="text-primary font-bold hover:underline ml-1"
                                >
                                    Log in
                                </button>
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 py-4">
                            <div className="h-px flex-1 bg-[#fceef1]" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or join with</span>
                            <div className="h-px flex-1 bg-[#fceef1]" />
                        </div>

                        {/* OAuth buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={handleSignUp}
                                className="flex items-center justify-center gap-2 h-12 border border-[#fceef1] rounded-xl hover:bg-white transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleSignUp}
                                className="flex items-center justify-center gap-2 h-12 border border-[#fceef1] rounded-xl hover:bg-white transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                <span className="text-sm font-medium">Github</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 md:p-8 flex justify-center border-t border-[#fceef1] bg-[#fdfafb]">
                <p className="text-slate-400 text-xs text-center">© 2024 RN-bound. Designed for peaceful progress.</p>
            </footer>
        </div>
    );
}
