import PageTitle from "./PageTitle";

function Header({ title, description, currentUser }) {
  const displayName = currentUser?.fullName || currentUser?.email || "Người dùng";

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 md:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageTitle title={title} description={description} />

        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {displayName}
        </div>
      </div>
    </header>
  );
}

export default Header;
