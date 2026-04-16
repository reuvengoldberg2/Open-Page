import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProperty } from "@/lib/storage";
import type { PropertyDetails } from "@/types/property";
import {
  Home,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Phone,
  Mail,
  Share2,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  Sparkles,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    getProperty(id).then((p) => {
      if (p) setProperty(p);
      else setNotFound(true);
    });
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: show URL
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-2">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <p className="text-muted-foreground">This property page doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/")} className="gap-2 mt-2">
          <Home className="w-4 h-4" />
          Go home
        </Button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasImages = property.images.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:block">PropertyPage AI</span>
          </button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Share link"}
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => navigate("/create")}>
              <Plus className="w-3.5 h-3.5" />
              New listing
            </Button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative bg-slate-900">
        {hasImages ? (
          <div className="relative h-[55vh] min-h-[320px] max-h-[600px]">
            <img
              src={property.images[currentImage]}
              alt={`Property photo ${currentImage + 1}`}
              className="w-full h-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((p) => (p - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((p) => (p + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === currentImage ? "bg-white w-5" : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Price overlay */}
            <div className="absolute bottom-6 left-6">
              <div className="text-white text-3xl font-extrabold drop-shadow-lg">{property.price}</div>
            </div>
          </div>
        ) : (
          <div className="h-[40vh] min-h-[250px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Building2 className="w-24 h-24 text-white/20" />
            <div className="absolute bottom-6 left-6">
              <div className="text-white text-3xl font-extrabold">{property.price}</div>
            </div>
          </div>
        )}

        {/* Thumbnail strip */}
        {property.images.length > 1 && (
          <div className="bg-slate-900 px-6 py-3 flex gap-2 overflow-x-auto">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={cn(
                  "flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all",
                  i === currentImage ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left — main details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title + Address */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="blue" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Generated
                </Badge>
                <Badge variant="secondary">{property.propertyType}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{property.address}, {property.city}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize2, label: "Area", value: `${property.area} sqft` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border p-5 text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Features & Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Listed date */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <Calendar className="w-3.5 h-3.5" />
              Listed {formatDate(property.createdAt)}
            </div>
          </div>

          {/* Right — contact card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="text-3xl font-extrabold text-foreground mb-1">{property.price}</div>
                <div className="text-muted-foreground text-sm mb-6">
                  {property.propertyType} · {property.area} sqft
                </div>

                {property.agentName || property.agentPhone || property.agentEmail ? (
                  <div className="space-y-4">
                    {property.agentName && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Listed by</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {property.agentName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{property.agentName}</p>
                            <p className="text-xs text-muted-foreground">Real Estate Agent</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {property.agentPhone && (
                      <a
                        href={`tel:${property.agentPhone}`}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
                      >
                        <Phone className="w-4 h-4 text-primary" />
                        {property.agentPhone}
                      </a>
                    )}

                    {property.agentEmail && (
                      <a
                        href={`mailto:${property.agentEmail}`}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
                      >
                        <Mail className="w-4 h-4 text-primary" />
                        {property.agentEmail}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Contact information not provided.</p>
                )}
              </div>

              {/* Share CTA */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Link copied to clipboard!" : "Copy shareable link"}
              </button>

              {/* Create your own CTA */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 text-center">
                <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground mb-1">Create your own listing</p>
                <p className="text-xs text-muted-foreground mb-4">Generate a professional page in 60 seconds.</p>
                <Button size="sm" className="w-full" onClick={() => navigate("/create")}>
                  Get started free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground">PropertyPage AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            This listing was generated with AI. Verify all details independently.
          </p>
        </div>
      </footer>
    </div>
  );
}
