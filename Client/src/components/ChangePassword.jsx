import React from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    if (data.password !== data.conPass) {
      toast.error("Password doesn't Match");
    }
    try {
      const result = await changePassword(data);
      toast.success(result?.data?.message);

      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            Change Password
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="New Password"
              type="password"
              name="password"
              label="New Password"
              className="w-full rounded"
              register={register("password", {
                required: "New Password is Required",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Confirm Password"
              type="password"
              name="password"
              label="Confirm Password"
              className="w-full rounded"
              register={register("conPass", {
                required: "Confirm Your Password",
              })}
              error={errors.name ? errors.name.message : ""}
            />
          </div>

          {isLoading ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:gap-4 sm:flex-row-reverse">
              <Button
                type="submit"
                label="Submit"
                className="bg-slate-700 text-white px-5 text-sm font-semibold border-2 border-slate-700 rounded-lg hover:bg-white hover:border-slate-700 hover:text-slate-700 transition-all duration-300 sm:w-auto"
              />

              <Button
                type="button"
                className="bg-white text-slate-700 px-5 text-sm font-semibold border-2 border-slate-700 rounded-lg sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default ChangePassword;
