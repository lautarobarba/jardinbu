import { Species } from "@/interfaces/species.interface"
import { formatTitleCase, getUrlForImageByUUID } from "@/utils/tools";
import Link from "next/link";

interface SmallCardPros {
    species: Species
}
export const SmallCard = (props: SmallCardPros) => {
    const { species } = props;
    return (
        <div
            className="items-center rounded-lg shadow sm:flex dark:border-gray-700 m-2"
            style={{ backgroundColor: "#44722C" }}
        >
            <div className="md:w-[30%]">
                <img
                    loading='lazy'
                    className="rounded-lg sm:rounded-none sm:rounded-l-lg mx-auto md:max-h-[150px]"
                    src={species.exampleImg?.uuid
                        ? getUrlForImageByUUID(species.exampleImg?.uuid ?? '')
                        : '/assets/images/tree_not_found.png'
                    }
                    alt={species.scientificName}
                />
            </div>
            <div className="p-5">
                <Link href={`/garden/species/${species.id}`}>
                    <h3 className="text-xl font-bold tracking-tight text-light">
                        {formatTitleCase(species.scientificName ?? '')}
                    </h3>
                </Link>
                <span className="text-light">
                    {formatTitleCase(species.commonName ?? '')}
                    {species.commonName && species.englishName && ("-")}
                    {formatTitleCase(species.englishName ?? '')}
                </span>
                <p className="text-left mt-3 mb-4 font-light text-light">{formatTitleCase(species.description ?? '')}</p>
                {/* <ul className="flex space-x-4 sm:mt-0">
                    <li>
                        <Link href={facebookHref} target="_blank" className="text-dark dark:text-light hover:text-primary dark:hover:text-white">
                            <FacebookIcon />
                        </Link>
                    </li>
                    <li>
                        <Link href={instagramHref} target="_blank" className="text-dark dark:text-light hover:text-primary dark:hover:text-white">
                            <InstagramIcon />
                        </Link>
                    </li>
                    <li>
                        <Link href={twitterHref} target="_blank" className="text-dark dark:text-light hover:text-primary dark:hover:text-white">
                            <TwitterIcon />
                        </Link>
                    </li>
                </ul> */}
            </div>
        </div>
    );
}