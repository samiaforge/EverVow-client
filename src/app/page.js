import { Divide } from "lucide-react";
import Image from "next/image";
import Banner from "@/components/home/Banner";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseEverVow from "@/components/home/WhyChooseEverVow";
import HowEverVowWorks from "@/components/home/HowEverVowWorks";

export default function Home() {
  return (
    <div>
      <Banner/>
      <FeaturedServices/>
      <WhyChooseEverVow/>
      <HowEverVowWorks/>
    </div>
  );
}
