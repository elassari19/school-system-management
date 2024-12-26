"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { addStudentSchema, addStudentType } from "@/lib/zod-schema";
import { Button } from "../ui/button";
import FormInput from "../inputs/form-input";
import { getUsers } from "@/app/api/dashboard";
import { createStudent } from "@/app/api/academic";
import toast from "react-hot-toast";
import useIntlTranslations from "@/hooks/use-intl-translations";

interface AddStudentFormProps {}

const AddStudentForm: React.FC<AddStudentFormProps> = ({}) => {
  const { g } = useIntlTranslations();

  const [classes, setClassess] = React.useState<any[]>([]);
  const [parents, setParents] = React.useState<any[]>([]);

  const getParents = async () => {
    const result = await getUsers({
      where: { role: "PARENT" },
      select: { id: true, fullname: true },
    });
    setParents(result);
  };

  const getClasses = async () => {
    const result = await getUsers(
      {
        select: { id: true, name: true },
      },
      "class"
    );
    setClassess(result);
  };

  React.useEffect(() => {
    getParents();
    getClasses();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm<addStudentType>({
    resolver: zodResolver(addStudentSchema),
  });

  const onSubmit = async (data: addStudentType) => {
    const res = await createStudent(data);
    if (res.error) {
      toast.error(`${g("Student")} ${data.fullname} ${g("created failed")}`);
      console.log("error", res.error);
      return;
    }
    toast.success(`${g("Student")} ${data.fullname} ${g("created successfully")}`);
    reset();
    console.log("res", res);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <FormInput
        label={`${g("Full Name")}`}
        error={errors?.fullname?.message || ""}
        type="text"
        {...register("fullname")}
        id="fullname"
      />

      <FormInput
        label={`${g("Parents")} ${g("Name")}`}
        error={errors?.parent?.message || ""}
        options={parents?.map((p) => ({ id: p.id, value: p.fullname })) || []}
        {...register("parent")}
        id="parentName"
      />

      <FormInput
        label={g("Age")}
        error={errors?.age?.message || ""}
        type="text"
        {...register("age")}
        id="age"
      />

      <FormInput
        label={g("Email")}
        error={errors?.email?.message || ""}
        type="text"
        {...register("email")}
        id="email"
      />

      <FormInput
        label={g("Password")}
        error={errors?.password?.message || ""}
        type="password"
        {...register("password")}
        id="password"
      />

      <FormInput
        label={g("Phone")}
        error={errors?.phone?.message || ""}
        type="phone"
        {...register("phone")}
        id="phone"
      />

      <FormInput
        label={g("Role")}
        error={errors?.role?.message || ""}
        type="text"
        value={"STUDENT"}
        {...register("role")}
        id="role"
      />

      <FormInput
        label={g("Gender")}
        error={errors?.gender?.message || ""}
        options={[
          { id: "male", value: "Male" },
          { id: "female", value: "Female" },
        ]}
        {...register("gender")}
        id="gender"
      />

      <FormInput
        label={g("Image")}
        error={errors?.image?.message || ""}
        type="url"
        {...register("image")}
        id="image"
      />

      <FormInput
        label={g("Address")}
        error={errors?.address?.message || ""}
        type="address"
        {...register("address")}
        id="address"
      />

      <FormInput
        label={g("Class")}
        error={errors?._class?.message || ""}
        options={classes?.map((c) => ({ id: c.id, value: c.name })) || []}
        {...register("_class")}
        id="_class"
      />

      <Button
        type="submit"
        disabled={!isValid || isSubmitting || isLoading}
        isLoading={isLoading}
      >
        {g("Add")} {g("Student")}
      </Button>
    </form>
  );
};

export default AddStudentForm;
