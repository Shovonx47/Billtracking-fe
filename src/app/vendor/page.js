"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Vendor() {
  const [billNumber, setBillNumber] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      router.push("/"); // Redirect only if the user is not logged in
    } else {
      setUserData(user); // Set user data if authenticated
    }
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost/backend/vendor.php?bill_number=${billNumber}`
      );
      const data = await response.json();

      // Show status in a SweetAlert popup
      Swal.fire({
        title: "Bill Status",
        text: `${data.status}`,
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch bill status. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div>
      {/* Upper bar */}
      <div className="bg-gray-800 text-white flex items-center justify-between px-6 py-3">
        <h1 className="text-lg font-bold">Bill Tracking System</h1>
        <nav className="flex space-x-4">
          <a href="/vendor" className="hover:text-blue-400 transition-colors">
            Vendor
          </a>
          <a href="/receptionist" className="hover:text-blue-400 transition-colors">
            Receptionist
          </a>
          <a href="/accounts" className="hover:text-blue-400 transition-colors">
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
        <h2 className="text-xl font-bold mb-4">Check Bill Status</h2>
        <input
          type="text"
          placeholder="Enter Bill Number"
          value={billNumber}
          onChange={(e) => setBillNumber(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={checkStatus}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Status
        </button>
      </div>
    </div>
  );
}