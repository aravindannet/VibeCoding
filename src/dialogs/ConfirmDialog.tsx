import React from "react";
import Dialog from "./Dialog";
import Button from "../components/Button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="22rem">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-base text-center text-zinc-700 dark:text-zinc-200 mb-2">{message}</div>
      <div className="flex gap-4 mt-2">
        <Button
          onClick={onCancel}
          className="border-zinc-300 bg-white/60 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          className="border-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 font-semibold shadow-lg backdrop-blur-xl"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Dialog>
);

export default ConfirmDialog;
