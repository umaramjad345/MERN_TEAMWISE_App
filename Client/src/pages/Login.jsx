import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice.js";
import { setCredentials } from "../redux/slices/authSlice.js";
import Loading from "../components/Loader.jsx";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const result = await login(data);
      dispatch(setCredentials(result?.data?.user));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-blue-100">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-2 md:gap-y-5 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 rounded-full text-4xl md:text-8xl text-gray-600 italic">
              TEAMWISE
            </span>
            <p className="text-lg md:text-2xl 2xl:text-4xl text-center font-semibold text-slate-700">
              <span>A Cloud-Based Team Collaboration App</span>
            </p>
          </div>
        </div>

        {/* right side */}
        <div className="w-full md:w-1/3 p-6 md:p-1 flex flex-col justify-center items-center shadow-xl">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-slate-700 text-3xl font-bold text-center">
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-700 ">
                Keep the track of your projects
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                Forget Password?
              </span>

              {isLoading ? (
                <>
                  <Loading />
                </>
              ) : (
                <Button
                  type="submit"
                  label="Submit"
                  className="w-full h-10 bg-slate-700 border-2 border-slate-700 text-white rounded-full hover:text-slate-700 hover:border-2 hover:border-slate-700 hover:bg-transparent transition-all duration-300"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
