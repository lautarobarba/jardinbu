import { Role } from "@/interfaces/user.interface";
import { RolRequiredPageWrapper } from "@/wrappers/RolRequiredPageWrapper";

const QRCodePage = () => {
  return (
    <RolRequiredPageWrapper roles={[Role.ADMIN]}>
      <section id="qr-code">
        <br />
        <br />
        <br />
        <h1 className="text-center text-dark dark:text-light">{"[[ CÓDIGOS QR ]]"}</h1>
      </section>
    </RolRequiredPageWrapper>
  );
}
export default QRCodePage;