import type { PropertyDetails, PropertyFormData } from "@/types/property";

const STORAGE_KEY = "propertypage_listings";

function getAll(): Record<string, PropertyDetails> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveProperty(
  data: PropertyFormData & { images: string[]; title: string; description: string }
): string {
  const id = crypto.randomUUID();
  const property: PropertyDetails = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  const all = getAll();
  all[id] = property;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return id;
}

export function getProperty(id: string): PropertyDetails | null {
  const all = getAll();
  return all[id] ?? null;
}

export function getAllProperties(): PropertyDetails[] {
  return Object.values(getAll()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function deleteProperty(id: string): void {
  const all = getAll();
  delete all[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
