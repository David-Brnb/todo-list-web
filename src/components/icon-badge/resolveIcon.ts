import {
  Book,
  Bell,
  Briefcase,
  Brush,
  Calendar,
  Camera,
  Check,
  Circle,
  Cloud,
  Code,
  Coffee,
  DollarSign,
  Dumbbell,
  Flag,
  Folder,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  Leaf,
  Lightbulb,
  ListTodo,
  Moon,
  Music,
  PawPrint,
  Pencil,
  Plane,
  ShoppingCart,
  Star,
  Stethoscope,
  Sun,
  Target,
  Utensils,
  Car,
  type LucideIcon,
} from "lucide-react";
import type { IconDTO } from "@/types/icons/iconDTO";

// Maps the backend's icon names (SF Symbols on iOS, Material on Android) to the
// closest lucide-react icon. This is the single place that translation happens —
// the rest of the app just passes an IconDTO (or a raw name). Matching is done on
// a normalized key (lowercased, alphanumerics only) so "list.bullet",
// "list_bullet" and "listBullet" all collapse to the same lookup.
const ICON_MAP: Record<string, LucideIcon> = {
  book: Book,
  bookclosed: Book,
  menubook: Book,
  briefcase: Briefcase,
  work: Briefcase,
  cart: ShoppingCart,
  shoppingcart: ShoppingCart,
  basket: ShoppingCart,
  house: HomeIcon,
  home: HomeIcon,
  heart: Heart,
  favorite: Heart,
  star: Star,
  flag: Flag,
  bell: Bell,
  notifications: Bell,
  calendar: Calendar,
  event: Calendar,
  checklist: ListTodo,
  list: ListTodo,
  listbullet: ListTodo,
  checkmark: Check,
  check: Check,
  folder: Folder,
  graduationcap: GraduationCap,
  school: GraduationCap,
  pencil: Pencil,
  edit: Pencil,
  paintbrush: Brush,
  brush: Brush,
  gamecontroller: Gamepad2,
  sportsesports: Gamepad2,
  airplane: Plane,
  flight: Plane,
  car: Car,
  directionscar: Car,
  dumbbell: Dumbbell,
  fitnesscenter: Dumbbell,
  figurerun: Dumbbell,
  forkknife: Utensils,
  restaurant: Utensils,
  leaf: Leaf,
  eco: Leaf,
  musicnote: Music,
  music: Music,
  camera: Camera,
  photocamera: Camera,
  gift: Gift,
  cardgiftcard: Gift,
  dollarsign: DollarSign,
  attachmoney: DollarSign,
  lightbulb: Lightbulb,
  sun: Sun,
  sunmax: Sun,
  moon: Moon,
  cloud: Cloud,
  code: Code,
  coffee: Coffee,
  pawprint: PawPrint,
  pets: PawPrint,
  stethoscope: Stethoscope,
  target: Target,
  circle: Circle,
};

const FALLBACK: LucideIcon = ListTodo;

function normalize(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function resolveIcon(
  icon?: IconDTO | null,
  name?: string | null,
): LucideIcon {
  const candidates = [name, icon?.name, icon?.iosName, icon?.androidName];
  for (const candidate of candidates) {
    const key = normalize(candidate);
    if (key && ICON_MAP[key]) return ICON_MAP[key];
  }
  return FALLBACK;
}
