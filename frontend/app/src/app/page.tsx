import { PublicNavbar } from "@/components/navbar/PublicNavbar";
import { PrivateNavbar } from "@/components/navbar/PrivateNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "./sections/HomeSection";
import { InstSection } from "./sections/InstSection";

const Home = () => {
  return (
    <main>
      <PublicNavbar />
      <ConfigMenu />


      <HomeSection />
      <InstSection />
    </main>
  );
};

export default Home;
