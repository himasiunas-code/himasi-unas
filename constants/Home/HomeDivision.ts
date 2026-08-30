import { Division } from "@/lib/type/Home/HomeDivision";
import {
  FlaskConical,
  Palette,
  Users,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

// Data divisi yang ditampilkan pada bagian pengenalan beranda
export const divisions: Division[] = [
  {
    id: 1,
    title: "Research and Development",
    image: FlaskConical,
  },
  {
    id: 2,
    title: "Creative Media",
    image: Palette,
  },
  {
    id: 3,
    title: "Public Relation",
    image: Users,
  },
  {
    id: 4,
    title: "Entrepreneurship",
    image: TrendingUp,
  },
  {
    id: 5,
    title: "Human Talent Development",
    image: GraduationCap,
  },
];
