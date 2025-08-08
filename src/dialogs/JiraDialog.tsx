import React, { useState } from "react";
import Dialog from "./Dialog";
import Input from "../components/Input";
import Button from "../components/Button";
import PrimaryButton from "../components/PrimaryButton";
import { PlugZap } from "lucide-react";

const JiraDialog = ({ jiraOpen, setJiraOpen, jiraBaseUrl, setJiraBaseUrl, setJiraConnected }: any) => {
  const [base, setBase] = useState(jiraBaseUrl);
  const [token, setToken] = useState("");

  const save = (e: any) => {
    e.preventDefault();
    setJiraBaseUrl(base);
    setJiraConnected(true);
    setJiraOpen(false);
  };

  return (
    <Dialog open={jiraOpen} onClose={() => setJiraOpen(false)} title="Connect to Jira (demo)">
      <form onSubmit={save} className="space-y-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Store your Jira base URL so issue keys link out. API calls are mocked in this demo and not sent anywhere.</div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Jira base URL</label>
          <Input placeholder="https://your-domain.atlassian.net" value={base} onChange={(e: any) => setBase(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">API token (optional)</label>
          <Input placeholder="Stored locally only (demo)" value={token} onChange={(e: any) => setToken(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" onClick={() => setJiraOpen(false)}>Cancel</Button>
          <PrimaryButton type="submit"><PlugZap className="h-4 w-4" /> Save</PrimaryButton>
        </div>
      </form>
    </Dialog>
  );
};

export default JiraDialog;
