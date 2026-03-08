import React from 'react';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';
import SimpleDatePicker from './SimpleDatePicker';
import UserFilterDropdown from './UserFilterDropdown';
import Button from './Button';

interface ToolbarProps {
	query: string;
	setQuery: (q: string) => void;
	users: any[];
	userFilter: any[];
	setUserFilter: (u: any[]) => void;
	setAddOpen: (open: boolean) => void;
	selectedDate: string;
	setSelectedDate: (d: string) => void;
	dark: boolean;
	setDark: (d: boolean) => void;
	setPanelOpen?: (b: boolean) => void;
	setPanelTab?: (tab: 'users' | 'date' | 'search' | null) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
	query,
	setQuery,
	users,
	userFilter,
	setUserFilter,
	setAddOpen,
	selectedDate,
	setSelectedDate,
	dark,
	setDark,
	setPanelOpen,
	setPanelTab,
}) => {
	return (
		<div className="w-full flex items-center gap-3">
			<div className="flex-1 min-w-0">
				<label className="relative block">
					<Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
					<input
						aria-label="Search tasks"
						type="text"
						placeholder="Search tasks, owner or JIRA"
						className="w-full pl-10 pr-3 py-2 rounded-xl bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</label>
			</div>

			<div className="hidden sm:flex items-center gap-2">
				<UserFilterDropdown users={users} selected={userFilter} setSelected={setUserFilter} />
				<SimpleDatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} onClear={() => setSelectedDate('')} />
				<Button
					onClick={() => setAddOpen(true)}
					className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow hover:scale-105 transition-transform duration-150"
				>
					<Plus className="h-4 w-4" />
					<span className="hidden md:inline">Add Task</span>
				</Button>
			</div>

			<div className="flex sm:hidden items-center gap-2">
				<button
					onClick={() => { setPanelTab && setPanelTab(null); setPanelOpen && setPanelOpen(true); }}
					className="p-2 rounded-lg bg-transparent border border-zinc-200/20 dark:border-zinc-800/30"
					title="Filters"
				>
					<SlidersHorizontal className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
				</button>
				<button onClick={() => setAddOpen(true)} className="p-2 rounded-lg bg-indigo-600 text-white" title="Add task">
					<Plus className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
