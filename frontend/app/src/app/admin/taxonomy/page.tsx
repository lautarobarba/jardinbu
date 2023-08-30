'use client';
import { PageTitle } from "@/components/PageTitle";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { ExamplePrivateSection } from "./sections/example/ExamplePrivateSection";
import { PageSubTitle } from "@/components/PageSubTitle";
import { KingdomPrivateList } from "./sections/kingdom/KingdomPrivateList";
import { PhylumPrivateList } from "./sections/phylum/PhylumPrivateList";
import { ClassesTaxPrivateList } from "./sections/classes-tax/ClassesTaxPrivateList";
import { OrdersTaxPrivateList } from "./sections/order-tax/OrdersTaxPrivateList";
import { FamiliesPrivateList } from "./sections/families/FamiliesPrivateList";
import { GeneraPrivateList } from "./sections/genera/GeneraPrivateList";


const TaxonomyPage = () => {
  return (
    <section id="taxonomy" className="flex w-full flex-col">
      <PageTitle title="Taxonomía" />

      <Tabs aria-label="Options" radius="sm" color="primary" classNames={{ tabList: "bg-white dark:bg-gray-800", tab: "bg-none" }}>
        <Tab key="Example" title="Example">
          <PageSubTitle title="Ejemplo" />
          <ExamplePrivateSection />
        </Tab>
        <Tab key="Reinos" title="Reinos">
          <KingdomPrivateList />
        </Tab>
        <Tab key="Filos" title="Filos">
          <PhylumPrivateList />
        </Tab>
        <Tab key="Clases" title="Clases">
          <ClassesTaxPrivateList />
        </Tab>
        <Tab key="Ordenes" title="Órdenes">
          <OrdersTaxPrivateList />
        </Tab>
        <Tab key="Familias" title="Familias">
          <FamiliesPrivateList />
        </Tab>
        <Tab key="Géneros" title="Géneros">
          <GeneraPrivateList />
        </Tab>
      </Tabs>
    </section>
  );
}
export default TaxonomyPage;
