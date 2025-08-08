import React from "react";

const Textarea = (props: any) => (
  <textarea
    {...props}
    className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 ${
      props.className || ""
    }`}
  />
);

export default Textarea;
