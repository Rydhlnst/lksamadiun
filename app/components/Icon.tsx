import type { IconType } from "react-icons";
import { FaBottleWater, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import {
  LuArrowRight,
  LuAward,
  LuCheck,
  LuCoffee,
  LuCopy,
  LuDroplet,
  LuEgg,
  LuFish,
  LuGlobe,
  LuHeart,
  LuLandmark,
  LuMail,
  LuMapPin,
  LuMenu,
  LuPalette,
  LuPhone,
  LuSprout,
  LuUsers,
  LuX,
} from "react-icons/lu";

const icons = {
  sprout: LuSprout,
  fish: LuFish,
  egg: LuEgg,
  palette: LuPalette,
  droplet: LuDroplet,
  coffee: LuCoffee,
  gallon: FaBottleWater,
  users: LuUsers,
  heart: LuHeart,
  arrow: LuArrowRight,
  bank: LuLandmark,
  pin: LuMapPin,
  phone: LuPhone,
  mail: LuMail,
  globe: LuGlobe,
  award: LuAward,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  menu: LuMenu,
  close: LuX,
  copy: LuCopy,
  check: LuCheck,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];

export function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  const Component = icons[name];
  return <Component className={className} aria-hidden="true" />;
}
