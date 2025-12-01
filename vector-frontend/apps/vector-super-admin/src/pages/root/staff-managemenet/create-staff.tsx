"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/form";
import * as z from "zod";

import { useCreateStaff } from "../../../apis/staff/Mutations";

import { Button } from "@repo/ui/components/button";
import { TextInput } from "@repo/ui/custom-inputs/TextInput.js";
import { SelectInput } from "@repo/ui/custom-inputs/SelectInput.js";
import { ImageUploadInput } from "@repo/ui/custom-inputs/ImageUpload.js";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// ---------------------------------------------------------
// ✅ ZOD SCHEMA
// ---------------------------------------------------------
const userSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobileNo: z.string().min(10, "Enter a valid mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "inactive"]),
  image: z.any().optional(),
});

// ---------------------------------------------------------
// ✅ COMPONENT
// ---------------------------------------------------------
export default function UserCreateForm() {
  const navigate = useNavigate();
  const methods = useForm({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
  });

  const create = useCreateStaff();
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------------------------------------
  // ✅ SUBMIT HANDLER
  // ---------------------------------------------------------
  const onSubmit = async (data) => {
  
    const formData = new FormData();

    const booleanStatus = data.status === "active";

    formData.append("username", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.mobileNo);
    formData.append("password", data.password);
    formData.append("is_active", booleanStatus);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

create.mutate(formData, {
  onSuccess: () => {
    toast.success("Staff Created Successfully");
    navigate("/staff");
  },
onError: (error) => {
  if (error && typeof error === "object") {
    const combined = Object.values(error).flat().join(".");
    toast.error(combined);
    return;
  }

  // fallback
  toast.error("Failed to create staff");
},

});
;

  };

  // ---------------------------------------------------------
  // ✅ JSX
  // ---------------------------------------------------------
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow"
        >
          <ImageUploadInput name="image" label="Profile Image" />

          <div className="grid grid-cols-2 gap-4">
            <TextInput name="fullName" label="Full Name" />
            <TextInput name="email" label="Email" type="email" />
            <TextInput name="mobileNo" label="Mobile Number" />

            <SelectInput
              name="status"
              label="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />

            {/* PASSWORD FIELD WITH SHOW/HIDE EYE */}
            <div className="relative w-full">
              <TextInput
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
              />

              <div
                className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white">
            Create Staff
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
