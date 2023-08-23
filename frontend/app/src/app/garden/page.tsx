import { CogIcon } from "lucide-react";
import Link from "next/link";

const GardenPage = () => {
    return (
        <section id="browser">
            <br />
            <br />
            <br />
            <h1 className="text-center text-dark dark:text-light">{"[[ BIBLIOTECA DEL BOSQUE ]]"}</h1>
            <br />
            <Link href="/admin" className="ml-5 text-blue-500 flex flex-row">
                <CogIcon />&nbsp;PANEL DE ADMINISTRACIÓN
            </Link>
        </section>
    );
}
export default GardenPage;
