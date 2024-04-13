import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import AddSubTask from "./AddSubTask";
import ConfirmatioDialog from "../Dialogs";
import {
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const TaskDialog = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [trashTask, { isLoading }] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();
  const { user } = useSelector((state) => state.auth);

  const duplicateHanlder = async () => {
    try {
      const result = await duplicateTask(task?._id);
      toast.success(result?.data?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const deleteClicks = () => {
    setOpenDialog(true);
  };
  const deleteHandler = async () => {
    try {
      const result = await trashTask({ id: task?._id, isTrashed: "trash" });
      toast.success(result?.data?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task._id}`),
      isAdmin: (user) => {
        if (user.isAdmin === false) {
          return true;
        }
      },
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
      isAdmin: user.isAdmin,
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpen(true),
      isAdmin: user.isAdmin,
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => duplicateHanlder(),
      isAdmin: user.isAdmin,
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 ">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                {items.map(
                  (el) =>
                    el.isAdmin && (
                      <Menu.Item key={el.label}>
                        {({ active }) => (
                          <button
                            onClick={el?.onClick}
                            className={`${
                              active
                                ? "bg-slate-700 text-white"
                                : "text-gray-800"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {el.icon}
                            {el.label}
                          </button>
                        )}
                      </Menu.Item>
                    )
                )}
              </div>

              {user.isAdmin && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => deleteClicks()}
                        className={`${
                          active ? "bg-slate-700 text-white" : "text-red-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <RiDeleteBin6Line
                          className={`mr-2 h-5 w-5 ${
                            active ? "text-white" : "text-gray-800"
                          }`}
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
