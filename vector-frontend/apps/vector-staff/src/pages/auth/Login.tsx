import { Form } from "@repo/ui/components/form";
import { Button } from "@repo/ui/components/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUser } from "../../apis/auth/Mutations";
import { Link } from "react-router";
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
    <div className="w-full h-dvh flex">
      {/* Left Section - Image */}
      <div className="hidden lg:block w-1/2 h-full">
        <img
          src="/vector-login.png"
          alt="Login illustration"
          className="max-h-dvh w-full object-cover object-top"
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        <div className="w-full p-6 sm:p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Staff Login</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm">
                  <label className="flex items-center mb-2 sm:mb-0 cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-red-600" />
                    Remember me
                  </label>
                  {/* <Link to="/forgot" className="text-red-600 hover:underline">
                    Forgot Password?
                  </Link> */}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-violet-500 hover:bg-violet-700 text-white rounded-md py-2 cursor-pointer"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
