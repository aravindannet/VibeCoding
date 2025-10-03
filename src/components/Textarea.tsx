import React from "react";

const Textarea = (props: any) => {
  const rows = props.rows || 3;
  // estimate height per row (approx); adjust if your design uses different line-height
  const rowHeight = 22; // px per row
  const height = `${rows * rowHeight + 12}px`; // add padding

  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 ${
        props.className || ""
      }`}
      style={{
        height,
        resize: 'none', // prevent user from resizing
        overflowY: 'auto',
        ...(props.style || {}),
      }}
    />
  );
};

export default Textarea;
