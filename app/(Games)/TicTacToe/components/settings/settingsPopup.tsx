"use client";

import { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const plans = [
  {
    name: "Classic 2 Player Mode",
    description: "Are you ready to destroy your Friendship?",
    id: "classic",
  },
  {
    name: "Open AI Mod",
    description: "Versus to 4o-mini",
    id: "openai",
  },
  // {
  //   name: "Minimax Mod",
  //   description: "Classic X O X experience, Minimax algorithm Versus You ",
  //   id: "minimax",
  // },
];

export default function Settings({
  open,
  setOpen,
  setGameType,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  setGameType: (value: string) => void;
}) {
  // const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(plans[0]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-black  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="w-full px-4">
                  <div className="mx-auto w-full max-w-md">
                    <RadioGroup
                      value={selected}
                      onChange={setSelected}
                      aria-label="Server size"
                      className="space-y-2"
                    >
                      {plans.map((plan) => (
                        <Radio
                          key={plan.name}
                          value={plan}
                          className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className="text-sm/6">
                              <p className="font-semibold text-white">
                                {plan.name}
                              </p>
                              <div className="flex gap-2 text-white/50">
                                <div>{plan.description}</div>
                              </div>
                            </div>
                            <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                          </div>
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setGameType(selected.id);
                    }}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:w-1/2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
