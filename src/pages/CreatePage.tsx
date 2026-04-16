import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generatePropertyContent } from "@/lib/ai";
import { saveProperty } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import type { PropertyFormData } from "@/types/property";
import {
  Home,
  ImagePlus,
  X,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Loader2,
  Plus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = ["House", "Apartment", "Condo", "Penthouse", "Villa", "Studio", "Townhouse", "Land"];

const FEATURE_SUGGESTIONS = [
  "Swimming Pool", "Garden", "Garage", "Balcony", "Fireplace",
  "Smart Home", "Solar Panels", "Home Office", "Gym", "Walk-in Closet",
  "Hardwood Floors", "Modern Kitchen", "City Views", "Mountain Views", "Ocean Views",
];

const STEPS = ["Property Details", "Location & Price", "Contact Info"];

export default function CreatePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState<PropertyFormData>({
    price: "",
    address: "",
    city: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    propertyType: "House",
    features: [],
    images: [],
    agentName: "",
    agentPhone: "",
    agentEmail: "",
  });

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const readers: Promise<string>[] = [];
    Array.from(files).slice(0, 10 - images.length).forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
      );
    });
    Promise.all(readers).then((results) => {
      setImages((prev) => [...prev, ...results].slice(0, 10));
    });
  }, [images.length]);

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleImageUpload(e.dataTransfer.files);
    },
    [handleImageUpload]
  );

  const update = (field: keyof PropertyFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep0 = form.propertyType && form.bedrooms && form.bathrooms && form.area;
  const canProceedStep1 = form.price && form.address && form.city;
  const canGenerate = canProceedStep0 && canProceedStep1;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setError(null);

    try {
      const { title, description } = await generatePropertyContent({
        ...form,
        images,
      });

      const id = saveProperty({
        ...form,
        images,
        title,
        description,
      });

      navigate(`/property/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground">PropertyPage AI</span>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.user_metadata?.full_name as string ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <button
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    i === step && "text-primary",
                    i < step && "text-foreground cursor-pointer hover:text-primary",
                    i > step && "text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                      i === step && "bg-primary text-white",
                      i < step && "bg-green-500 text-white",
                      i > step && "bg-muted text-muted-foreground"
                    )}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-1" />
                )}
              </div>
            ))}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 0 — Property Details */}
        {step === 0 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Property Details</h1>
              <p className="text-muted-foreground">Tell us about your property.</p>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Photos <span className="text-muted-foreground font-normal">(optional, up to 10)</span></Label>
              <div
                className={cn(
                  "border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-blue-50/30 transition-all",
                  images.length === 0 && "min-h-[160px] flex flex-col items-center justify-center gap-3"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {images.length === 0 ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                      <ImagePlus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Drop photos here or click to upload</p>
                      <p className="text-muted-foreground text-xs mt-1">PNG, JPG, WEBP up to 10MB each</p>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" onClick={(e) => e.stopPropagation()}>
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(i)}
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {images.length < 10 && (
                      <button
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </div>

            {/* Property Type */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Property Type</Label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => update("propertyType", type)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                      form.propertyType === type
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="beds" className="text-sm font-semibold mb-2 block">Bedrooms</Label>
                <Input
                  id="beds"
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="baths" className="text-sm font-semibold mb-2 block">Bathrooms</Label>
                <Input
                  id="baths"
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-sm font-semibold mb-2 block">Area (sqft)</Label>
                <Input
                  id="area"
                  type="number"
                  min="0"
                  placeholder="e.g. 1800"
                  value={form.area}
                  onChange={(e) => update("area", e.target.value)}
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Features & Highlights</Label>
              <div className="flex flex-wrap gap-2">
                {FEATURE_SUGGESTIONS.map((feature) => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      form.features.includes(feature)
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {form.features.includes(feature) ? "✓ " : "+ "}
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!canProceedStep0}
              onClick={() => setStep(1)}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 1 — Location & Price */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Location & Price</h1>
              <p className="text-muted-foreground">Where is the property and what's the asking price?</p>
            </div>

            <div>
              <Label htmlFor="price" className="text-sm font-semibold mb-2 block">Asking Price</Label>
              <Input
                id="price"
                placeholder="e.g. $850,000"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-semibold mb-2 block">Street Address</Label>
              <Input
                id="address"
                placeholder="e.g. 123 Maple Street"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-semibold mb-2 block">City & State</Label>
              <Input
                id="city"
                placeholder="e.g. Austin, TX"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(0)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                className="flex-1 gap-2"
                size="lg"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Contact Info + Generate */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Contact Info</h1>
              <p className="text-muted-foreground">Who should buyers contact? (optional)</p>
            </div>

            <div>
              <Label htmlFor="agentName" className="text-sm font-semibold mb-2 block">Your Name</Label>
              <Input
                id="agentName"
                placeholder="e.g. John Smith"
                value={form.agentName}
                onChange={(e) => update("agentName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="agentPhone" className="text-sm font-semibold mb-2 block">Phone Number</Label>
              <Input
                id="agentPhone"
                placeholder="e.g. (555) 123-4567"
                value={form.agentPhone}
                onChange={(e) => update("agentPhone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="agentEmail" className="text-sm font-semibold mb-2 block">Email Address</Label>
              <Input
                id="agentEmail"
                type="email"
                placeholder="e.g. john@realty.com"
                value={form.agentEmail}
                onChange={(e) => update("agentEmail", e.target.value)}
              />
            </div>

            {/* Summary card */}
            <div className="rounded-2xl bg-secondary/50 border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Property Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{form.propertyType}</span></div>
                <div><span className="text-muted-foreground">Price:</span> <span className="font-medium">{form.price}</span></div>
                <div><span className="text-muted-foreground">Bedrooms:</span> <span className="font-medium">{form.bedrooms}</span></div>
                <div><span className="text-muted-foreground">Bathrooms:</span> <span className="font-medium">{form.bathrooms}</span></div>
                <div><span className="text-muted-foreground">Area:</span> <span className="font-medium">{form.area} sqft</span></div>
                <div><span className="text-muted-foreground">Photos:</span> <span className="font-medium">{images.length}</span></div>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {form.features.map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                className="flex-1 gap-2 shadow-lg shadow-blue-200"
                size="lg"
                disabled={isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating your page…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate my property page
                  </>
                )}
              </Button>
            </div>

            {isGenerating && (
              <div className="text-center text-sm text-muted-foreground animate-pulse">
                AI is crafting your perfect listing description…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
