import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterFormData,
} from "@/validations/auth.validation";

import { authService } from "@/services/auth.service";

const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register(data);

      alert("Registration Successful");

      navigate("/login");
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
          "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Create Account
      </h1>

      <p className="mb-8 text-center text-gray-500">
        Join the Affiliate Management System
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block font-medium">
            Name
          </label>

          <input
            type="text"
            {...register("name")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Referral Code
            <span className="text-gray-400">
              {" "}
              (Optional)
            </span>
          </label>

          <input
            type="text"
            {...register("referralCode")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="cursor-pointer font-semibold text-blue-600 hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;