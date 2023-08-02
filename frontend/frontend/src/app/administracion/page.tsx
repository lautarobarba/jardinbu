import Link from "next/link";

const AdminDashboard = () => {
  return (
    <>
      <br />
      <h1 className="text-center">{"[[ AdminDashboard ]]"}</h1>
      <div className="flex flex-col flex-nowrap justify-center">
        <hr className="m-auto w-80" />
      </div>
      <Link href="/" className="ml-5 text-blue-500">
        {">>"} Volver ◀️
      </Link>
    </>
  );
};

export default AdminDashboard;
