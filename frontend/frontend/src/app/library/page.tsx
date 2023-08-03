import Link from "next/link";

const Biblioteca = () => {
    return (
        <>
            <br />
            <h1 className="text-center">{"[[ BIBLIOTECA ]]"}</h1>
            <div className="flex flex-col flex-nowrap justify-center">
                <hr className="m-auto w-80" />
            </div>
            <Link href="/admin" className="ml-5 text-blue-500">
                {">>"} ADMIN PANEL ◀️
            </Link>
        </>
    );
};

export default Biblioteca;
