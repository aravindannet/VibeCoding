import React from 'react';
import { Moon, Sun, PlugZap, Plus } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import PrimaryButton from './PrimaryButton';
import FilterBar from './FilterBar';

interface HeaderProps {
  dark: boolean;
  onDarkToggle: () => void;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onDateClear: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  userFilter: string[];
  onUserFilterChange: (users: string[]) => void;
  users: string[];
  jiraConnected: boolean;
  onJiraConnect: () => void;
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({
  dark,
  onDarkToggle,
  selectedDate,
  onDateSelect,
  onDateClear,
  query,
  onQueryChange,
  userFilter,
  onUserFilterChange,
  users,
  jiraConnected,
  onJiraConnect,
  onAddTask,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <FilterBar
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onDateClear={onDateClear}
          query={query}
          onQueryChange={onQueryChange}
          userFilter={userFilter}
          onUserFilterChange={onUserFilterChange}
          users={users}
        />
        <Button onClick={onDarkToggle}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? "Light" : "Dark"} mode
        </Button>
        <Button 
          onClick={onJiraConnect} 
          className={`${jiraConnected ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-700" : ""}`}
        >
          <PlugZap className="h-4 w-4" /> {jiraConnected ? "Jira Connected" : "Connect Jira"}
        </Button>
        <PrimaryButton onClick={onAddTask}>
          <Plus className="h-4 w-4" /> Add Task
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Header;
