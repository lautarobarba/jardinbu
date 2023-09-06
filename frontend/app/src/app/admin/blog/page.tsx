'use client';
import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";
import { Tab, Tabs } from "@nextui-org/react";
import { TagPrivateSection } from "./sections/tags/TagPrivateSection";

const AdminBlogPage = () => {
  const [title, setTitle] = useState<string>("Blog");

  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="blog" className="flex w-full flex-col">
        <PageTitle title={title} />

        <Tabs aria-label="Options" radius="sm" color="primary" classNames={{ tabList: "bg-white dark:bg-gray-800", tab: "bg-none" }}>
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