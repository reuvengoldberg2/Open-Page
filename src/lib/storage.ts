import { supabase } from "@/lib/supabase";
import type { PropertyDetails, PropertyFormData } from "@/types/property";

async function uploadImage(base64: string, propertyId: string, index: number): Promise<string> {
  const res = await fetch(base64);
  const blob = await res.blob();
  const ext = blob.type.split("/")[1] || "jpg";
  const path = `${propertyId}/${index}.${ext}`;

  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, blob, { contentType: blob.type, upsert: true });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}

function rowToProperty(row: Record<string, unknown>): PropertyDetails {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    price: (row.price as string) ?? "",
    address: (row.address as string) ?? "",
    city: (row.city as string) ?? "",
    bedrooms: (row.bedrooms as string) ?? "",
    bathrooms: (row.bathrooms as string) ?? "",
    area: (row.area as string) ?? "",
    propertyType: (row.property_type as string) ?? "House",
    features: (row.features as string[]) ?? [],
    images: (row.image_urls as string[]) ?? [],
    agentName: (row.agent_name as string) ?? "",
    agentPhone: (row.agent_phone as string) ?? "",
    agentEmail: (row.agent_email as string) ?? "",
    createdAt: row.created_at as string,
  };
}

export async function saveProperty(
  data: PropertyFormData & { images: string[]; title: string; description: string }
): Promise<string> {
  const id = crypto.randomUUID();

  const imageUrls = await Promise.all(
    data.images.map((img, i) => uploadImage(img, id, i))
  );

  const { error } = await supabase.from("properties").insert({
    id,
    title: data.title,
    description: data.description,
    price: data.price,
    address: data.address,
    city: data.city,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    area: data.area,
    property_type: data.propertyType,
    features: data.features,
    image_urls: imageUrls,
    agent_name: data.agentName,
    agent_phone: data.agentPhone,
    agent_email: data.agentEmail,
  });

  if (error) throw new Error(`Failed to save property: ${error.message}`);
  return id;
}

export async function getProperty(id: string): Promise<{ property: PropertyDetails | null; error?: string }> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    const msg = `${error.code}: ${error.message}`;
    console.error("[getProperty] Supabase error:", msg, error.details);
    return { property: null, error: msg };
  }
  if (!data) return { property: null, error: "No data returned" };
  return { property: rowToProperty(data) };
}

export async function getAllProperties(): Promise<PropertyDetails[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(rowToProperty);
}

export async function deleteProperty(id: string): Promise<void> {
  await supabase.from("properties").delete().eq("id", id);
}
