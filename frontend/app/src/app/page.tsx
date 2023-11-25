import { LandingNavbar } from "@/components/navbar/LandingNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "@/app/sections/HomeSection";
import { FooterSection } from "@/app/sections/FooterSection";
import { HomeSection2 } from "./sections/HomeSection2";
import { LandingNavbar2 } from "@/components/navbar/LandingNavbar2";
import { InstSection2 } from "./sections/InstSection2";
import { TeamSection2 } from "./sections/TeamSection2";

const HomePage = () => {
  return (
    <main>
      {/* La LandingNavbar vieja se ve para versiones mobiles */}
      <LandingNavbar2 />

      {/* <ConfigMenu type="both" /> */}

      {/* La HomeSection vieja se ve para versiones mobiles */}
      <div className="block lg:hidden">
        <HomeSection />
      </div>
      <div className="hidden lg:block">
        <HomeSection2 />
      </div>

      <InstSection2 />
      <TeamSection2 />
      <FooterSection />
    </main>
  );
};

export default HomePage;
