// src/components/LoginPage.jsx
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'  // make sure this path is correct

const LoginPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black px-4">
      <div className="w-full max-w-md p-6 rounded-xl bg-white shadow-xl">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google']}
          onlyThirdPartyProviders={false} // ✅ allows email/password too
        />
      </div>
    </div>
  )
}

export default LoginPage
