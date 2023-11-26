import { Species } from "@/interfaces/species.interface"
import { formatTitleCase, getUrlForImageByUUID } from "@/utils/tools";
import { Button } from "@nextui-org/react";
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
                    className="rounded-lg sm:rounded-none sm:rounded-l-lg mx-auto max-h-[350px] md:max-h-[150px]"
                    src={species.exampleImg?.uuid
                        ? getUrlForImageByUUID(species.exampleImg?.uuid ?? '')
                        : '/assets/images/tree_not_found.png'
                    }
                    alt={species.scientificName}
                />
            </div>
            <div className="p-5 w-full">
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
            </div>
            <div className="md:w-[30%] text-center md:text-right py-3 px-3">
                <Link href={`/garden/species/${species.id}`}>
                    <Button>VER</Button>
                </Link>
            </div>
        </div>
    );
}