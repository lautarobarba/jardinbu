'use client';
import { PageTitle } from "@/components/PageTitle";
import { Tabs, Tab } from "@nextui-org/react";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Role } from "@/interfaces/user.interface";
import { KingdomPrivateSection } from "./sections/kingdom/KingdomPrivateSection";
import { PhylumPrivateSection } from "./sections/phylum/PhylumPrivateSection";
import { ClassesTaxPrivateSection } from "./sections/classes-tax/ClassesTaxPrivateSection";
import { OrdersTaxPrivateSection } from "./sections/order-tax/OrdersTaxPrivateSection";
import { FamiliesPrivateSection } from "./sections/families/FamiliesPrivateSection";
import { GeneraPrivateSection } from "./sections/genera/GeneraPrivateSection";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";


const TaxonomyPage = () => {
  const [title, setTitle] = useState<string>("Taxonomía");
  const [tabSelected, setTabSelected] = useState<string>("Reinos");

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'Reinos';

  const handleTabChange = (event: any) => {
    setTabSelected(event);
    router.push(`${pathName}?tab=${event}`);
    // router.push(pathName, { query: { tab: 'hola' } });
  }

  useEffect(() => {
    setTabSelected(tab);
  }, []);

  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="taxonomy" className="flex w-full flex-col">
        <PageTitle title={title} />

        <Tabs aria-label="Options" selectedKey={tabSelected} onSelectionChange={handleTabChange} radius="sm" color="primary" classNames={{ tabList: "bg-white dark:bg-gray-800", tab: "bg-none" }}>
          <Tab key="Reinos" title="Reinos">
            <KingdomPrivateSection updateTitle={setTitle} />
          </Tab>
          <Tab key="Filos" title="Filos">
            <PhylumPrivateSection updateTitle={setTitle} />
          </Tab>
          <Tab key="Clases" title="Clases">
            <ClassesTaxPrivateSection updateTitle={setTitle} />
          </Tab>
          <Tab key="Ordenes" title="Órdenes">
            <OrdersTaxPrivateSection />
          </Tab>
          <Tab key="Familias" title="Familias">
            <FamiliesPrivateSection />
          </Tab>
          <Tab key="Géneros" title="Géneros">
            <GeneraPrivateSection />
          </Tab>
        </Tabs>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default TaxonomyPage;
