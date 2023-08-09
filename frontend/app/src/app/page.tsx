import { PublicNavbar } from "@/components/navbar/PublicNavbar";
import { PrivateNavbar } from "@/components/navbar/PrivateNavbar";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { HomeSection } from "./sections/HomeSection";

const Home = () => {
  return (
    <main>
      <PublicNavbar />
      <ConfigMenu />


      <HomeSection />
    </main>
  );
};

export default Home;
