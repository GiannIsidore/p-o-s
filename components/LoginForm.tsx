"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface Cashier {
  id: number;
  username: string;
  fl_name: string;
  c_password: string;
}

export default function LoginForm() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getCashiers = async () => {
      try {
        const response = await axios.get<Cashier[]>(
          "http://localhost/3rdProj/p-o-s/cashiers.php"
        );
        console.log(response.data);
        setCashiers(response.data);
      } catch (error) {
        console.error("There was an error fetching the cashiers!", error);
        toast({
          title: "Error getting cashiers",
          variant: "destructive",
        });
      }
    };

    getCashiers();
  }, [toast]);

  const handleLogin = async () => {
    setLoading(true);
    console.log("Username:", selectedUsername);
    console.log("Password:", password);
    try {
      const response = await axios.post(
        "http://localhost/3rdProj/p-o-s/login.php",
        {
          username: selectedUsername,
          password,
        }
      );
      console.log(response.data);
      console.log("Response received:", response.data); // Debug log

      if (response.data.status === "success") {
        toast({ title: response.data.message, variant: "success" });
        localStorage.setItem("username", selectedUsername);
        localStorage.setItem("fullname", response.data.fullname);

        router.push(
          `/pos?username=${selectedUsername}&fullname=${response.data.fullname}`
        );
      }
      if (response.data.status != "success") {
        toast({
          title: "Login failed",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Login failed",
        variant: "destructive",
      });
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px ] text-white ">
      <div className="flex items-center justify-center py-12 ">
        <div className="mx-auto grid w-[350px] gap-6  p-9">
          <div className="grid gap-2 text-left pb-4">
            <h1 className="text-3xl font-bold text-blue-800">Login</h1>
            <p className="text-balance text-blue-400">
              Enter your credentials below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <select
                id="username"
                className="w-full p-2 text-black bg-white rounded-md"
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              >
                <option value="" disabled>
                  Select your username
                </option>
                {cashiers.map((cashier: Cashier) => (
                  <option
                    className="text-black"
                    key={cashier.id}
                    value={cashier.username}
                  >
                    {cashier.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                className="w-full p-2 text-black bg-white rounded-md"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
      <div className="hidden bg-muted  lg:block">
        <Image
          src="/LOGO.jpg"
          alt="Image"
          width="700"
          height="700"
          className="pt-28 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
