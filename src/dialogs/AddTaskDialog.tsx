import React, { useState } from "react";
import Dialog from "./Dialog";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import PrimaryButton from "../components/PrimaryButton";
import { Plus } from "lucide-react";
import { Priority } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

const AddTaskDialog = ({ addOpen, setAddOpen, addTask, jiraBaseUrl }: any) => {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jiraKey, setJiraKey] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const submit = (e: any) => {
    e.preventDefault();
    const id = uuidv4();
    addTask({ id, name, owner, description, startDate, endDate, jiraKey: jiraKey || null, jiraBaseUrl: jiraBaseUrl || null, status: "todo", priority });
    setAddOpen(false);
  };

  return (
    <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add Task">
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Task name</label>
            <Input required placeholder="e.g., Implement login API" value={name} onChange={(e: any) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Owner</label>
            <Input placeholder="e.g., Keerthana" value={owner} onChange={(e: any) => setOwner(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</label>
          <Textarea rows={3} placeholder="Optional details" value={description} onChange={(e: any) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Start date</label>
            <Input type="date" value={startDate} onChange={(e: any) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">End date</label>
            <Input type="date" value={endDate} onChange={(e: any) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Jira issue key (optional)</label>
            <Input placeholder="e.g., ABC-123" value={jiraKey} onChange={(e: any) => setJiraKey(e.target.value.toUpperCase())} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
          <PrimaryButton type="submit"><Plus className="h-4 w-4" /> Save Task</PrimaryButton>
        </div>
      </form>
    </Dialog>
  );
};

export default AddTaskDialog;
