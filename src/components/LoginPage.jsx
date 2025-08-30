
import { X } from "lucide-react";

const LoginPage = ({ onClose }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black bg-opacity-70 px-4">
      <div className="relative w-full max-w-md px-6 pt-16 pb-6 rounded-xl bg-white shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors z-10 p-2"
        >
          <X size={20} />
        </button>

        {/* Supabase Auth UI */}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["google"]}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
};

export default LoginPage;
