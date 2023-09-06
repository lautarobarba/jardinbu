'use client';
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Tab, Tabs } from "@nextui-org/react";
import { TagPrivateSection } from "./sections/tags/TagPrivateSection";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const AdminBlogPage = () => {
  const [title, setTitle] = useState<string>("Blog");
  const [tabSelected, setTabSelected] = useState<string>("Posts");

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'Posts';

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
      <section id="blog" className="flex w-full flex-col">
        <PageTitle title={title} />

        <Tabs aria-label="Options" selectedKey={tabSelected} onSelectionChange={handleTabChange} radius="sm" color="primary" classNames={{ tabList: "bg-white dark:bg-gray-800", tab: "bg-none" }}>
          <Tab key="Posts" title="Posts">
            {/* <PostPrivateSection /> */}
          </Tab>
          <Tab key="Tags" title="Tags">
            <TagPrivateSection updateTitle={setTitle} />
          </Tab>
        </Tabs>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default AdminBlogPage;