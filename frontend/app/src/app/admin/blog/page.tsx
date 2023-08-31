import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";

const AdminBlogPage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="browser">
        <br />
        <br />
        <br />
        <h1 className="text-center text-dark dark:text-light">{"[[ ADMIN BLOG ]]"}</h1>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default AdminBlogPage;