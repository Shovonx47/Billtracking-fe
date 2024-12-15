"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost/backend/auth.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ username, password }),
            });

            const data = await response.json();

            if (data.message === "Login successful") {
                // Save both username and role in sessionStorage
                const userDetails = {
                    username: data.user.username, // Assuming the backend response includes 'username'
                    role: data.user.role,
                };
                sessionStorage.setItem("user", JSON.stringify(userDetails));

                // Redirect based on user role
                if (data.user.role === "Accounts") {
                    router.push("/accounts");
                } else if (data.user.role === "Receptionist") {
                    router.push("/receptionist");
                } else {
                    router.push("/vendor"); // Default route for any other roles
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl">Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 mb-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
            </form>
        </div>
    );
}
