'use client';
import { useGetKingdoms } from "@/services/hooks";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    PaginationState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Kingdom } from "@/interfaces/kingdom.interface";

const BlogPage = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'name', desc: false },
    ]);

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const { data, isLoading, error } = useGetKingdoms({
        pagination: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            orderBy: sorting.length === 1 ? sorting[0].id : undefined,
            orderDirection:
                sorting.length === 1 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined,
        },
    });

    useEffect(() => {
        console.log({ data })
    }, [data]);

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 className="text-center">{"[[ BLOG ]]"}</h1>
        </>
    );
};

export default BlogPage;
