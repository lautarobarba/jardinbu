import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";

const AdminSpeciesPage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="species">
        <br />
        <br />
        <br />
        <h1 className="text-center text-dark dark:text-light">{"[[ ESPECIES ]]"}</h1>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default AdminSpeciesPage;