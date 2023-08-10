import { PublicNavbar } from "@/components/navbar/PublicNavbar";
import { PrivateNavbar } from "@/components/navbar/PrivateNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "./sections/HomeSection";
import { InstSection } from "./sections/InstSection";
import { TeamSection } from "./sections/TeamSection";

const Home = () => {
  return (
    <main>
      <PublicNavbar />
      <ConfigMenu />


      <HomeSection />
      <InstSection />
      <TeamSection />
    </main>
  );
};

export default Home;
