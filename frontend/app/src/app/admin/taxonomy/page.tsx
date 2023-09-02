'use client';
import { PageTitle } from "@/components/PageTitle";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { ExamplePrivateSection } from "./sections/example/ExamplePrivateSection";
import { PageSubTitle } from "@/components/PageSubTitle";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Role } from "@/interfaces/user.interface";
import { KingdomPrivateSection } from "./sections/kingdom/KingdomPrivateSection";
import { PhylumPrivateSection } from "./sections/phylum/PhylumPrivateSection";
import { ClassesTaxPrivateSection } from "./sections/classes-tax/ClassesTaxPrivateSection";
import { OrdersTaxPrivateSection } from "./sections/order-tax/OrdersTaxPrivateSection";
import { FamiliesPrivateSection } from "./sections/families/FamiliesPrivateSection";
// import { GeneraPrivateList } from "./sections/genera/GeneraPrivateList";


const TaxonomyPage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="taxonomy" className="flex w-full flex-col">
        <PageTitle title="Taxonomía" />

        <Tabs aria-label="Options" radius="sm" color="primary" classNames={{ tabList: "bg-white dark:bg-gray-800", tab: "bg-none" }}>
          {/* <Tab key="Example" title="Example">
            <PageSubTitle title="Ejemplo" />
            <ExamplePrivateSection />
          </Tab> */}
          <Tab key="Reinos" title="Reinos">
            <KingdomPrivateSection />
          </Tab>
          <Tab key="Filos" title="Filos">
            <PhylumPrivateSection />
          </Tab>
          <Tab key="Clases" title="Clases">
            <ClassesTaxPrivateSection />
          </Tab>
          <Tab key="Ordenes" title="Órdenes">
            <OrdersTaxPrivateSection />
          </Tab>
          <Tab key="Familias" title="Familias">
            <FamiliesPrivateSection />
          </Tab>
          <Tab key="Géneros" title="Géneros">
            {/* <GeneraPrivateList /> */}
          </Tab>
        </Tabs>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default TaxonomyPage;
