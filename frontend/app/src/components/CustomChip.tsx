import { Tag } from "@/interfaces/tag.interface";
import { Chip } from "@nextui-org/react";

interface CustomChipProps {
    tag: Tag
}

export const CustomChip = (props: CustomChipProps) => {
    const { tag } = props;
    return (
        <Chip
            variant="faded"
            className={`text-black bg-${tag.bgColor}`}
        >{tag.name.toLowerCase()}</Chip>
    );
}