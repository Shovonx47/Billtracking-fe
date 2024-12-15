"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Accounts() {
  const [bills, setBills] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "Accounts") {
      router.push("/");
    } else {
      setUserData(user);
      fetchBills();
    }
  }, []);

  const fetchBills = async () => {
    const response = await fetch("http://localhost/backend/get_bills.php");
    const data = await response.json();
    setBills(data);
  };

  const updateStatus = async (billNumber) => {
    const response = await fetch("http://localhost/backend/accounts.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ bill_number: billNumber }),
    });
    const data = await response.json();
    setStatusMessage(data.message);
    fetchBills(); // Refresh the bill list after updating
  };

  return (
    <div>
      {/* Upper bar */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-3">
        <h1 className="text-lg font-bold">Bill Tracking System</h1>
        <nav className="flex space-x-4 mr-28">
          <a
            href="/vendor"
            className="hover:text-blue-400 transition-colors"
          >
            Vendor
          </a>
          <a
            href="/receptionist"
            className="hover:text-blue-400 transition-colors"
          >
            Receptionist
          </a>
          <a
            href="/accounts"
            className="hover:text-blue-400 transition-colors"
          >
            Accounts
          </a>
        </nav>

        {/* User info on the right */}
        <div className="text-sm flex flex-col items-end mr-20">
          {userData && (
            <div>
              <p>
                <span className="font-bold"></span>{userData.username}
              </p>
              <p>
                <span className="font-bold"></span>{userData.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Accounts Section</h2>
        {statusMessage && <p className="text-green-500">{statusMessage}</p>}
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Bill Number</th>
              <th className="border border-gray-300 p-2">Vendor Name</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.bill_number}>
                <td className="border border-gray-300 p-2">
                  {bill.bill_number}
                </td>
                <td className="border border-gray-300 p-2">
                  {bill.vendor_name}
                </td>
                <td className="border border-gray-300 p-2">{bill.status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => updateStatus(bill.bill_number)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Mark as Received
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
