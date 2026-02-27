"use client";

import { useStore } from "@/store/useStore";

export function LoginView() {
    const { setActiveView, setIsAuthenticated } = useStore();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true);
    };

    return (
        <div className="flex h-screen w-full font-display bg-[#fdfafb] text-slate-900 antialiased overflow-hidden">
            {/* Left — Quote Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#fceef1] items-center justify-center p-20 relative overflow-hidden">
                {/* Logo */}
                <div className="absolute top-10 left-10 flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                    <span className="text-xl font-bold tracking-tight">RN-bound</span>
                </div>

                {/* Quote */}
                <div className="z-10 max-w-lg">
                    <span className="material-symbols-outlined text-primary/40 text-6xl mb-6">format_quote</span>
                    <h1 className="font-serif italic text-5xl leading-tight text-slate-800">
                        &ldquo;Productivity is being able to do things that you were never able to do before.&rdquo;
                    </h1>
                    <p className="mt-8 text-[#9a4c5f] text-lg font-medium">
                        — Franz Kafka
                    </p>
                </div>

                {/* Decorative blurs */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/4 -left-10 w-64 h-64 bg-white/40 rounded-full blur-2xl" />
            </div>

            {/* Right — Sign In Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 bg-[#fdfafb]">
                <div className="w-full max-w-md flex flex-col h-full">
                    <div className="flex-grow flex flex-col justify-center space-y-8">
                        {/* Mobile logo */}
                        <div className="text-center lg:text-left">
                            <div className="lg:hidden flex justify-center mb-6 text-primary items-center gap-2">
                                <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                                <span className="text-2xl font-bold tracking-tight">RN-bound</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-[#9a4c5f] font-medium">
                                Please enter your details to sign in to your workspace.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="mt-10 space-y-6" onSubmit={handleSignIn}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="login-email">
                                    Email
                                </label>
                                <input
                                    autoComplete="email"
                                    className="block w-full rounded-xl border-0 py-4 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-primary/10 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white"
                                    id="login-email"
                                    name="email"
                                    placeholder="name@example.com"
                                    type="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-semibold text-slate-700" htmlFor="login-password">
                                        Password
                                    </label>
                                    <a className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <input
                                        autoComplete="current-password"
                                        className="block w-full rounded-xl border-0 py-4 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-primary/10 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white"
                                        id="login-password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <button className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#9a4c5f] hover:text-primary" type="button">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>
                            <button
                                className="flex w-full justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold leading-6 text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98]"
                                type="submit"
                            >
                                Sign in to RN-bound
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-10">
                            <div className="relative">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-primary/10" />
                                </div>
                                <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">
                                    <span className="bg-[#fdfafb] px-4 text-[#9a4c5f]">Or continue with</span>
                                </div>
                            </div>

                            {/* OAuth buttons */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={handleSignIn}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-slate-700 ring-1 ring-inset ring-primary/10 hover:bg-slate-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm font-semibold">Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSignIn}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-3 text-slate-700 ring-1 ring-inset ring-primary/10 hover:bg-slate-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.04-.156-3.03 1.091-4.001 1.091zM16 2c-.013 2.16-1.78 3.883-3.83 3.844.013-2.146 1.846-3.935 3.83-3.844z" />
                                    </svg>
                                    <span className="text-sm font-semibold">Apple</span>
                                </button>
                            </div>
                        </div>

                        {/* Switch to signup */}
                        <p className="mt-10 text-center text-sm text-[#9a4c5f]">
                            Don&apos;t have an account?
                            <button
                                onClick={() => setActiveView('signup')}
                                className="font-bold text-primary hover:text-primary/80 ml-1 transition-colors"
                            >
                                Start your journey
                            </button>
                        </p>
                    </div>

                    {/* Footer links */}
                    <div className="mt-auto pt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-xs font-medium text-slate-400">
                        <a className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
                        <a className="hover:text-primary transition-colors cursor-pointer">Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
