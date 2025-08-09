import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../index.css'; // Ensure global styles are loaded
import Dialog from "./Dialog";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import PrimaryButton from "../components/PrimaryButton";
import PriorityDropdown from "../components/PriorityDropdown";
import { Plus } from "lucide-react";
import { Priority } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

const AddTaskDialog = ({ addOpen, setAddOpen, addTask, jiraBaseUrl }: any) => {
  // Reset form when dialog opens
  useEffect(() => {
    if (addOpen) {
      setName("");
      setOwner("");
      setDescription("");
      setDateRange({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection',
      });
      setJiraKey("");
      setPriority("Medium");
      setShowDatePicker(false);
    }
  }, [addOpen]);
  const portalRoot = typeof window !== 'undefined' ? document.body : null;
  const dateBtnRef = React.useRef<HTMLButtonElement>(null);
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: 'selection',
  });
  const [jiraKey, setJiraKey] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");

  // Close date picker on outside click
  useEffect(() => {
    if (!showDatePicker) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node) && dateBtnRef.current && !dateBtnRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDatePicker]);

  const submit = (e: any) => {
    e.preventDefault();
    const id = uuidv4();
    addTask({
      id,
      name,
      owner,
      description,
      startDate: dateRange.startDate.toISOString().slice(0, 10),
      endDate: dateRange.endDate.toISOString().slice(0, 10),
      jiraKey: jiraKey || null,
      jiraBaseUrl: jiraBaseUrl || null,
      status: "todo",
      priority
    });
    setAddOpen(false);
  };

  return (
    <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add Task">
      <form
        onSubmit={submit}
        className="space-y-2 sm:space-y-3 rounded-2xl border backdrop-blur-2xl p-2 sm:p-4 shadow-2xl dark:bg-[#18181b] dark:border-zinc-700/40 dark:backdrop-blur-md bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_60%,rgba(245,245,255,0.04)_100%)]"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          border: '1px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
  <div style={{ position: 'relative' }}>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Date Range</label>
          <div className="flex flex-col gap-2">
            <button
              ref={dateBtnRef}
              type="button"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setShowDatePicker(v => !v)}
              style={{ textAlign: 'left' }}
            >
              <span className="block truncate">
                {dateRange.startDate.toLocaleDateString()} — {dateRange.endDate.toLocaleDateString()}
              </span>
            </button>
            {showDatePicker && portalRoot && ReactDOM.createPortal(
              <div
                ref={pickerRef}
                className="z-[9999] rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg fixed"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'calc(100% - 2rem)',
                  maxWidth: '360px',
                  height: 'auto',
                  maxHeight: 'calc(100vh - 4rem)',
                  overflowY: 'auto',
                  background: '#18181b',
                  color: '#e0e7ff',
                  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)',
                }}
              >
                <DateRange
                  ranges={[dateRange]}
                  onChange={item => setDateRange(item.selection)}
                  moveRangeOnFirstSelection={false}
                  showSelectionPreview={true}
                  months={1}
                  direction="horizontal"
                  rangeColors={["#6366f1"]}
                  className="dark"
                />
              </div>,
              portalRoot
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Jira issue key (optional)</label>
            <Input placeholder="e.g., ABC-123" value={jiraKey} onChange={(e: any) => setJiraKey(e.target.value.toUpperCase())} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
            <PriorityDropdown value={priority} onChange={v => setPriority(v as Priority)} />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button type="button" onClick={() => setAddOpen(false)} className="w-full sm:w-auto">Cancel</Button>
          <PrimaryButton type="submit" className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Save Task</PrimaryButton>
        </div>
      </form>
    </Dialog>
  );
};

export default AddTaskDialog;
