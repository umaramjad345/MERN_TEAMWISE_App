import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice.js";
import { toast } from "sonner";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  // const URLs = task?.assets ? [...task?.assets] : [];
  const uploadedFileURLs = [];

  // const uploadFile = async (file) => {
  //   const name = new Date().getTime + file.name;
  //   const storage = getStorage(app);
  //   const storageRef = ref(storage, name);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   return new Promise((resolve, reject) => {
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         console.log("Uploading");
  //       },
  //       (error) => {
  //         reject(error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref)
  //           .then((downloadURL) => {
  //             uploadedFileURLs.push(downloadURL);
  //             resolve();
  //           })
  //           .catch((error) => {
  //             reject(error);
  //           });
  //       }
  //     );
  //   });
  // };

  const uploadImage = async (event) => {
    const files = event.target.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise((resolve) => {
        reader.onload = () => {
          uploadedFileURLs.push(file);
          resolve();
        };
      });
    }
  };

  const submitHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("team", JSON.stringify(team));
      formData.append("stage", stage);
      formData.append("priority", priority);
      for (let i = 0; i < uploadedFileURLs.length; i++) {
        formData.append("uploadedFileURLs", uploadedFileURLs[i]);
      }
      if (task?._id) {
        formData.append("id", task?._id);
      }
      const newData = {
        ...data,
        uploadedFileURLs,
        team,
        stage,
        priority,
      };

      // const idd = formData.get("id");
      // console.log(idd);

      const result = task?._id
        ? await updateTask(formData)
        : await createTask(formData);

      toast.success(result?.data?.message);
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.message);
    }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(event) => uploadImage(event)}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              {isLoading ? (
                <span className="text-sm py-2 text-red-500">Creating Task</span>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-slate-700 text-white px-5 text-sm font-semibold border-2 border-slate-700 rounded-lg hover:bg-white hover:border-slate-700 hover:text-slate-700 transition-all duration-300 sm:w-auto"
                />
              )}

              <Button
                type="button"
                className="bg-white text-slate-700 px-5 text-sm font-semibold border-2 border-slate-700 rounded-lg sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
