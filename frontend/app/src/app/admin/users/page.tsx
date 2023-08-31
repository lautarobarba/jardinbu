import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";

const AdminUsersPage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN]}>
      <section id="users">
        <br />
        <br />
        <br />
        <h1 className="text-center text-dark dark:text-light">{"[[ ADMIN USERS ]]"}</h1>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default AdminUsersPage;