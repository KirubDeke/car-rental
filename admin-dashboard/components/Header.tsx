import { FaBell, FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* <h1 className="text-xl font-bold text-gray-800">CarRental Admin</h1> */}
      </div>
      <div className="flex items-center space-x-4 h-12">
        {/* <FaSearch className="h-5 w-5 text-gray-500" />
        <FaBell className="h-5 w-5 text-gray-500" /> */}
      </div>
    </header>
  );
}