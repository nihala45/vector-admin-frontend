import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUser } from "../../apis/auth/Mutations";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.js";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginUser();

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="w-full h-screen flex">

      {/* LEFT FIXED SECTION */}
      <div className="hidden lg:block fixed top-0 left-0 w-1/2 h-screen">
        <img
          src="/vector-login.png"
          alt="Login illustration"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="flex flex-1 items-center justify-center p-6 lg:ml-[50%]">
        <div className="w-full">

          <div className="text-center mb-6">
            <p className="text-2xl font-semibold">Admin Login</p>
            <p className="text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <TextInput
                name="email"
                placeholder="Enter email"
                label="Email"
              />

              <TextInput
                name="password"
                placeholder="Enter Password"
                label="Password"
                type="password"
              />

              <label className="flex items-center text-sm cursor-pointer">
                <input type="checkbox" className="mr-2 accent-violet-600" />
                Remember me
              </label>

              <Button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-700 text-white rounded-md py-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>

            </form>
          </Form>

        </div>
      </div>
    </div>
  );
}
