import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Zap,
  ImagePlus,
  Sparkles,
  Share2,
  ArrowRight,
  CheckCircle2,
  Star,
  Home,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  LogOut,
} from "lucide-react";

const EXAMPLE_LISTINGS = [
  {
    id: "ex1",
    title: "Luxury Penthouse in Downtown",
    price: "$2,850,000",
    address: "500 Brickell Ave, Miami, FL",
    beds: 4,
    baths: 3,
    area: "3,200",
    type: "Penthouse",
    gradient: "from-blue-600 to-indigo-700",
    tag: "Featured",
  },
  {
    id: "ex2",
    title: "Modern Family Home with Pool",
    price: "$1,190,000",
    address: "742 Sunset Dr, Austin, TX",
    beds: 5,
    baths: 4,
    area: "4,100",
    type: "House",
    gradient: "from-emerald-500 to-teal-600",
    tag: "New",
  },
  {
    id: "ex3",
    title: "Chic Studio in the Arts District",
    price: "$425,000",
    address: "88 Gallery Blvd, Los Angeles, CA",
    beds: 1,
    baths: 1,
    area: "650",
    type: "Studio",
    gradient: "from-purple-500 to-pink-600",
    tag: "Hot Deal",
  },
];

const STEPS = [
  {
    icon: ImagePlus,
    title: "Upload your photos",
    desc: "Drop in your property images. Our system analyzes them instantly.",
  },
  {
    icon: Sparkles,
    title: "AI writes everything",
    desc: "Get a compelling title, description, and highlights — tailored to your property.",
  },
  {
    icon: Share2,
    title: "Share instantly",
    desc: "Your listing page is live. Share the link with buyers anywhere.",
  },
];

const FEATURES = [
  "AI-generated marketing copy",
  "Mobile-ready listing pages",
  "Instant shareable links",
  "Professional image gallery",
  "Lead capture ready",
  "No design skills needed",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">PropertyPage AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#examples" className="hover:text-foreground transition-colors">Examples</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(user.user_metadata?.full_name as string ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{(user.user_metadata?.full_name as string) ?? user.email}</span>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={signOut}>
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </Button>
                <Button size="sm" onClick={() => navigate("/create")}>
                  My listings
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  Sign in
                </Button>
                <Button size="sm" onClick={() => navigate("/signup")}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="blue" className="mb-6 gap-1.5">
            <Sparkles className="w-3 h-3" />
            Powered by AI
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6">
            Create a property page{" "}
            <span className="text-primary">in 60 seconds</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload photos, fill in the details — our AI writes the perfect
            description and builds a stunning listing page ready to share with buyers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button size="xl" className="gap-2 shadow-lg shadow-blue-200" onClick={() => navigate(user ? "/create" : "/signup")}>
              Create your listing
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="xl" variant="outline" onClick={() => document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" })}>
              See examples
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FEATURES.map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three steps to a perfect listing
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No design skills, no copywriting experience needed. Just your property details.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative p-8 rounded-2xl border border-border bg-white hover:shadow-md transition-shadow group"
              >
                <div className="absolute top-8 right-8 text-6xl font-black text-muted/30 select-none group-hover:text-blue-50 transition-colors">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example listings */}
      <section id="examples" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Examples</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pages that sell
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every listing is auto-generated, beautifully designed, and ready to convert.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLE_LISTINGS.map((listing) => (
              <div
                key={listing.id}
                className="rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(user ? "/create" : "/signup")}
              >
                {/* Image placeholder */}
                <div className={`h-48 bg-gradient-to-br ${listing.gradient} relative flex items-end p-5`}>
                  <Badge variant="secondary" className="text-xs font-semibold bg-white/90 text-foreground">
                    {listing.tag}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-foreground">
                    {listing.type}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-3">{listing.price}</p>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{listing.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground text-xs pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5" />
                      {listing.beds} beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" />
                      {listing.baths} baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      {listing.area} sqft
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <blockquote className="text-2xl font-medium text-foreground mb-6 leading-relaxed">
            "I created a listing page for my client's home in under a minute. The AI description was better than what I would've written myself."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              SM
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">Sarah Mitchell</p>
              <p className="text-xs text-muted-foreground">Real Estate Agent, Coldwell Banker</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to create your listing?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of agents saving hours every week.
          </p>
          <Button
            size="xl"
            className="bg-white text-primary hover:bg-white/90 shadow-xl gap-2"
            onClick={() => navigate(user ? "/create" : "/signup")}
          >
            <Zap className="w-4 h-4" />
            Create free listing
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground">PropertyPage AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 PropertyPage AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
