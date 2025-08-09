import React from 'react';
import { Search } from 'lucide-react';
import FloatingDatePicker from './FloatingDatePicker';
import UserFilterDropdown from './UserFilterDropdown';
import Input from './Input';

interface FilterBarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onDateClear: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  userFilter: string[];
  onUserFilterChange: (users: string[]) => void;
  users: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedDate,
  onDateSelect,
  onDateClear,
  query,
  onQueryChange,
  userFilter,
  onUserFilterChange,
  users,
}) => {
  return (
    <div className="flex items-center gap-2">
      <FloatingDatePicker
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onClear={onDateClear}
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
        <Input 
          placeholder="Search by task, owner, or JIRA key" 
          className="pl-8" 
          value={query} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)} 
        />
      </div>
      <UserFilterDropdown 
        users={users} 
        selected={userFilter} 
        setSelected={onUserFilterChange} 
      />
    </div>
  );
};

export default FilterBar;
