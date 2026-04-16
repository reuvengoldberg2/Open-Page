export interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  propertyType: string;
  features: string[];
  images: string[]; // base64 or object URLs
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  createdAt: string;
}

export type PropertyFormData = Omit<PropertyDetails, "id" | "title" | "description" | "createdAt">;
