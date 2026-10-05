import {
  Banknote, Building2, Bus, Camera, Church, Coffee, Fuel, GraduationCap, Hotel, Landmark as LandmarkIcon,
  Library, Mail, MapPin, Pill, ShoppingBag, Siren, Stethoscope, Store, Trees, Trophy, TrainFront, Utensils,
  type LucideIcon
} from 'lucide-react';

// Picks an icon for a landmark from its kind label (the humanized OpenStreetMap value)
const ICONS_BY_KIND: Record<string, LucideIcon> = {
  school: GraduationCap, college: GraduationCap, university: GraduationCap, kindergarten: GraduationCap,
  hospital: Stethoscope, clinic: Stethoscope, pharmacy: Pill,
  'place of worship': Church,
  townhall: LandmarkIcon, police: Siren, library: Library,
  'bus station': Bus, 'railway station': TrainFront, station: TrainFront,
  bank: Banknote, 'post office': Mail,
  restaurant: Utensils, cafe: Coffee,
  fuel: Fuel,
  marketplace: Store, mall: ShoppingBag, supermarket: ShoppingBag, 'department store': ShoppingBag,
  attraction: Camera, museum: LandmarkIcon, hotel: Hotel,
  stadium: Trophy, 'sports centre': Trophy, park: Trees,
  monument: LandmarkIcon, memorial: LandmarkIcon,
};

export const getLandmarkIcon = (kind: string): LucideIcon =>
  ICONS_BY_KIND[kind.trim().toLowerCase()] ?? (kind ? Building2 : MapPin);
