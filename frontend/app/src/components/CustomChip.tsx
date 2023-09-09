import { Tag } from "@/interfaces/tag.interface";
import { Chip } from "@nextui-org/react";
import { XIcon } from "lucide-react";

interface CustomChipProps {
    tag: Tag;
    showRemove?: boolean;
}

export const CustomChip = (props: CustomChipProps) => {
    const { tag, showRemove } = props;
    return (
        <Chip
            variant="faded"
            className={`text-black bg-${tag.bgColor} ${showRemove ? 'pr-0' : ''}`}
        >
            <span className="flex flex-row items-center space-x-2">
                {tag.name.toLowerCase()}
                {showRemove && (
                    <>
                        &nbsp;
                        <span className="rounded-lg p-1 bg-gray-400">{<XIcon size={10} />}</span>
                    </>
                )}
            </span>
        </Chip>
    );
}