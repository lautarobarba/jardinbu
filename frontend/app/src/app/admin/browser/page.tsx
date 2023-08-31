import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";

const BrowserPage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN, Role.EDITOR]}>
      <section id="browser">
        <br />
        <br />
        <br />
        <h1 className="text-center text-dark dark:text-light">{"[[ BUSCADOR ]]"}</h1>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default BrowserPage;