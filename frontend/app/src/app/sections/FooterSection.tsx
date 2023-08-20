import { Button } from "@nextui-org/react";
import { FacebookIcon, InstagramIcon } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
    return (
        <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
            <div className="mx-auto max-w-screen-xl text-center">
                <ul className="flex justify-center space-x-4 items-center mb-2 text-gray-900 dark:text-white">
                    <li>
                        <Link href="https://www.facebook.com/jbushuaia/" target="_blank">
                            <FacebookIcon className="w-10 h-10 rounded-full p-2 bg-primary text-white" />
                        </Link>
                    </li>
                    <li>
                        <Link href="https://www.instagram.com/jbushuaia/" target="_blank">
                            <InstagramIcon className="w-10 h-10 rounded-full p-2 bg-primary text-white" />
                        </Link>
                    </li>
                </ul>
                <p className="my-2 text-gray-500 dark:text-gray-400">Jardín Botánico de Ushuaia</p>
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">©{new Date().getFullYear()} jardin-botanico-ushuaia.org.ar</span>
            </div>
        </footer>
    );
}