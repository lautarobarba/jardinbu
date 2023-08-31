import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";

const AdminSpecimenPage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="specimen">
        <br />
        <br />
        <br />
        <h1 className="text-center text-dark dark:text-light">{"[[ EJEMPLARES ]]"}</h1>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default AdminSpecimenPage;