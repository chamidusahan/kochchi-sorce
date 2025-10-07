

  import React, { useState } from "react";
  import { Flame } from "lucide-react";
  
const LoginSignup = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState(null);



  

    const onChange = (e) => {
      const { name, value } = e.target;
      setForm((s) => ({ ...s, [name]: value }));
      setMessage(null);
    };

    const validate = () => {
      if (!form.email || !form.password || (mode === "signup" && !form.name)) {
        setMessage({ type: "error", text: "Please fill required fields." });
        return false;
      }
      if (mode === "signup" && form.password !== form.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match." });
        return false;
      }
      setMessage({ type: "success", text: mode === "login" ? "Ready to login" : "Ready to create account" });
      return true;
    };

    const onSubmit = (e) => {
      e.preventDefault();
      validate();
      // design-only: no network
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
          {/* Left side - brand / marketing */}
          <aside className="hidden md:flex flex-1 flex-col justify-center gap-6 p-10 bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="flex items-center gap-3">
              <Flame size={36} className="text-red-500" />
              <h2 className="text-2xl font-bold tracking-wider text-red-500">SPICE UP</h2>
            </div>
            <p className="text-gray-300 max-w-xs">Fast. Flavorful. Local. Sign in to order or create an account to save your favorites and reorder quickly.</p>
            <div className="w-20 h-1 bg-red-500 rounded" />
          </aside>

          {/* Right side - form */}
          <main className="flex-1 bg-black p-8 md:p-10 text-white">
            <h1 className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-white text-black rounded-lg px-3 py-2 shadow-sm"
                aria-label="Sign in with Google"
                onClick={() => setMessage({ type: 'info', text: 'Google sign-in clicked (placeholder)' })}
              >
                {/* Google svg */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.35 11.1H12v2.8h5.4c-.25 1.4-1.1 2.6-2.35 3.4v2.8h3.8C20.7 19.6 22 15.8 22 12c0-.6-.05-1.2-.15-1.8z" fill="#4285F4"/><path d="M12 22c2.7 0 4.95-.9 6.6-2.45l-3.8-2.8c-1.05.7-2.4 1.1-3.8 1.1-2.9 0-5.35-1.95-6.22-4.6H1.94v2.9C3.6 19.9 7.45 22 12 22z" fill="#34A853"/><path d="M5.78 13.25A7.01 7.01 0 015.5 12c0-.4.04-.8.13-1.2V8.9H1.94A10 10 0 001 12c0 1.6.35 3.1.94 4.45l3.84-3.2z" fill="#FBBC05"/><path d="M12 4.5c1.5 0 2.9.55 4 1.65L19.8 3.6C17.95 1.9 15.7 1 12 1 7.45 1 3.6 3.1 1.94 6.5l3.84 2.9C6.65 6.45 9.1 4.5 12 4.5z" fill="#EA4335"/></svg>
                <span className="text-sm font-medium">Google</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-3 py-2 shadow-sm"
                aria-label="Sign in with Facebook"
                onClick={() => setMessage({ type: 'info', text: 'Facebook sign-in clicked (placeholder)' })}
              >
                {/* Facebook svg */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 4.98 3.66 9.1 8.44 9.95v-7.05H8.07v-2.9h2.37V9.41c0-2.34 1.4-3.63 3.54-3.63 1.02 0 2.09.18 2.09.18v2.3h-1.17c-1.15 0-1.5.72-1.5 1.46v1.74h2.55l-.41 2.9h-2.14V22C18.34 21.17 22 17.05 22 12.07z" fill="#fff"/></svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
              {mode === "signup" && (
                <label className="flex flex-col text-sm text-gray-300">
                  Full name
                  <input name="name" value={form.name} onChange={onChange} className="mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Your full name" />
                </label>
              )}

              <label className="flex flex-col text-sm text-gray-300">
                Email
                <input name="email" type="email" value={form.email} onChange={onChange} className="mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="you@spiceup.com" />
              </label>

              <label className="flex flex-col text-sm text-gray-300">
                Password
                <input name="password" type="password" value={form.password} onChange={onChange} className="mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="••••••••" />
              </label>

              {mode === "signup" && (
                <label className="flex flex-col text-sm text-gray-300">
                  Confirm Password
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} className="mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Repeat password" />
                </label>
              )}

              {message && (
                <div className={message.type === "error" ? "text-red-200 bg-red-900 px-4 py-2 rounded" : "text-green-200 bg-green-900 px-4 py-2 rounded"}>{message.text}</div>
              )}

              <button type="submit" className="mt-2 w-full bg-red-500 hover:bg-red-600 text-black font-semibold rounded-lg py-3">{mode === "login" ? "Sign in" : "Create account"}</button>

              <div className="mt-3 text-center text-gray-400">
                {mode === 'login' ? (
                  <span>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-red-400 underline">Create one</button></span>
                ) : (
                  <span>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-red-400 underline">Sign in</button></span>
                )}
              </div>

              <p className="mt-4 text-center text-xs text-gray-500">By continuing you agree to our <span className="text-red-500">Terms</span> and <span className="text-red-500">Privacy</span>.</p>
            </form>
          </main>
        </div>
      </div>
    );
  };

  export default LoginSignup;
   
