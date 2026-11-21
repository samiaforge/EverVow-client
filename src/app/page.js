import { Divide } from "lucide-react";
import Image from "next/image";
import Banner from "@/components/home/Banner";
import FeaturedServices from "@/components/home/FeaturedServices";

export default function Home() {
  return (
    <div>
      <Banner/>
      <FeaturedServices/>
    </div>
  );
}
