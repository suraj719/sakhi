"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock } from "lucide-react";
import { addUser } from "../../../actions/userActions";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await addUser(formData);

      if (result.success) {
        toast.success("Account created successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400">Sign up to get started</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-gray-400"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-gray-400"
              required
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="tel"
              name="phoneNo"
              placeholder="Phone number"
              value={formData.phoneNo}
              onChange={handleChange}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-gray-400"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-gray-400"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-instagram-blue hover:bg-blue-600 text-white"
          disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-gray-400">Already have an account?</span>{" "}
        <a href="/login" className="text-instagram-blue hover:underline">
          Log in
        </a>
      </div>
    </div>
  );
}
