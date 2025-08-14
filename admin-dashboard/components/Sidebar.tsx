"use client";

import {
  FaHome,
  FaCarAlt,
  FaCalendarCheck,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { CarFront } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const menuItems = [
    { name: "/", icon: <FaHome />, label: "Dashboard" },
    {
      name: "fleet",
      icon: <FaCarAlt />,
      label: "Fleet Management",
      subItems: [
        { name: "all-fleets", label: "All Fleets" },
        { name: "add", label: "Add New", isAction: true },
      ],
    },
    { name: "bookings", icon: <FaCalendarCheck />, label: "Bookings" },
    { name: "customers", icon: <FaUsers />, label: "Customers" },
    { name: "analytics", icon: <FaChartLine />, label: "Analytics" },
    { name: "settings", icon: <FaCog />, label: "Settings" },
  ];

  const toggleSubItems = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <div className="h-screen w-64 bg-white text-gray-800 shadow-lg flex flex-col border-r border-gray-200">
      {/* Logo Section */}
      <div className="p-5 flex items-center space-x-3 border-b border-gray-200">
        <Link href="/home" className="flex items-center md:flex-1">
          <div className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap">
            <CarFront
              size={42}
              className="text-foreground dark:text-foreground"
            />
            <h2
              className="text-gray-800 dark:text-white font-bold"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Kirub
              <span className="text-red-600 dark:text-red-500"> Rental</span>
            </h2>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            <Link href={item.subItems ? "#" : `/${item.name}`}>
              <div
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    activeItem === item.name
                      ? "bg-red-50 text-red-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }
                `}
                onClick={() =>
                  item.subItems
                    ? toggleSubItems(item.name)
                    : setActiveItem(item.name)
                }
              >
                <div className="flex items-center">
                  <span
                    className={`text-lg mr-3 ${
                      activeItem === item.name
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.subItems && (
                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${
                      expandedItems[item.name] ? "transform rotate-180" : ""
                    } text-gray-400`}
                  />
                )}
              </div>
            </Link>

            {item.subItems && expandedItems[item.name] && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    href={`/${item.name}/${subItem.name}`}
                    key={subItem.name}
                  >
                    <div
                      className={`p-2 pl-4 rounded-lg text-sm transition-colors cursor-pointer font-medium ${
                        subItem.isAction
                          ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                          : activeItem === subItem.name
                          ? "text-red-500 bg-red-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.label}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div
          className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
          onClick={() => console.log("Logout")}
        >
          <FaSignOutAlt className="text-lg mr-3 text-red-500 group-hover:text-red-600" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
