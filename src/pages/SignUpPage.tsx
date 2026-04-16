import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="space-y-1.5 mt-2">
      {checks.map((c) => (
        <div key={c.label} className={cn("flex items-center gap-2 text-xs transition-colors", c.ok ? "text-green-600" : "text-muted-foreground")}>
          <Check className={cn("w-3 h-3", c.ok ? "text-green-500" : "text-muted-foreground/40")} />
          {c.label}
        </div>
      ))}
    </div>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, isConfigured } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await signUpWithEmail(email, password, name);
    if (error) {
      setError(friendlyError(error));
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
      setGoogleLoading(false);
    }
  };

  /* ── Confirmation screen ── */
  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6 animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
        <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
          We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
          Click it to activate your account and start creating listings.
        </p>
        <Button onClick={() => navigate("/auth")} variant="outline" className="gap-2">
          Back to sign in
        </Button>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left — branding panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-gradient-to-br from-primary to-blue-700 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">PropertyPage AI</span>
        </div>

        <div>
          <blockquote className="text-xl font-medium leading-relaxed mb-6 text-white/90">
            "I created a listing page for my client in under a minute. The AI description was better than what I would've written myself."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              SM
            </div>
            <div>
              <p className="font-semibold text-sm">Sarah Mitchell</p>
              <p className="text-blue-200 text-xs">Real Estate Agent · Coldwell Banker</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "60s", label: "To create a listing" },
            { value: "AI", label: "Written descriptions" },
            { value: "∞", label: "Shareable pages" },
            { value: "Free", label: "To get started" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-blue-200 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="px-8 h-16 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground">PropertyPage AI</span>
          </Link>
          <div className="hidden lg:block" />
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </header>

        {/* Form body */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md animate-fade-in">
            {!isConfigured && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-6 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Setup required:</strong> Add your Supabase project URL to <code className="font-mono bg-amber-100 px-1 rounded">.env</code> as <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code>, then restart the dev server.
                </span>
              </div>
            )}
            <h1 className="text-3xl font-extrabold text-foreground mb-1">Create your account</h1>
            <p className="text-muted-foreground mb-8">
              Free forever. No credit card needed.
            </p>

            {/* Google */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogle}
              className={cn(
                "w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-border text-sm font-medium text-foreground transition-colors mb-6",
                googleLoading ? "opacity-60 cursor-not-allowed bg-secondary" : "hover:bg-secondary"
              )}
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs text-muted-foreground">
                <span className="bg-white px-3">or sign up with email</span>
              </div>
            </div>

            {/* Fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold mb-2 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11"
                    required
                    autoComplete="name"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold mb-2 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base gap-2" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create account
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
              By signing up you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function friendlyError(msg: string): string {
  if (msg.includes("User already registered")) return "An account with this email already exists.";
  if (msg.includes("Password should be")) return "Password must be at least 6 characters.";
  if (msg.includes("Invalid email")) return "Please enter a valid email address.";
  if (msg.includes("Unsupported provider") || msg.includes("provider is not enabled")) return "Google sign-in is not enabled. Please use email and password instead.";
  return msg;
}
