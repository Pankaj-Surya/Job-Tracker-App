import { formatDistanceToNow } from 'date-fns';
import { Bot, BriefcaseBusiness, ExternalLink, Loader2, Sparkles, UserRoundSearch } from 'lucide-react';
import type { JobLead } from '../types';

interface FreshJobsPanelProps {
  leads: JobLead[];
  isLoading: boolean;
  error: string | null;
  savedSourceIds: Set<string>;
  onFetch: () => void;
  onSaveLead: (lead: JobLead) => void;
}

export function FreshJobsPanel({
  leads,
  isLoading,
  error,
  savedSourceIds,
  onFetch,
  onSaveLead,
}: FreshJobsPanelProps) {
  return (
    <section className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Fresh QA Jobs</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Live Adzuna leads from top product companies, scored for QA automation fit.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              Jobs by Adzuna
            </span>
            <button
              type="button"
              onClick={onFetch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{isLoading ? 'Fetching' : 'Fetch Fresh Jobs'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        {leads.length > 0 && (
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
            {leads.map((lead) => {
              const isSaved = savedSourceIds.has(lead.sourceId);

              return (
                <article
                  key={lead.id}
                  className="w-[310px] shrink-0 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        <BriefcaseBusiness size={13} />
                        <span>{lead.roleCategory}</span>
                      </div>
                      <h3 className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100" title={lead.companyName}>
                        {lead.companyName}
                      </h3>
                    </div>
                    <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs font-bold text-gray-900 dark:text-gray-100">
                      {lead.fitScore}
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm font-medium text-gray-700 dark:text-gray-200" title={lead.jobTitle}>
                    {lead.jobTitle}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white dark:bg-gray-900 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                      {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
                    </span>
                    {lead.location && (
                      <span className="rounded-full bg-white dark:bg-gray-900 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                        {lead.location}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    {lead.fitReasons.map((reason) => (
                      <div key={reason} className="text-xs text-gray-600 dark:text-gray-300">
                        {reason}
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{lead.resumeHint}</p>

                  <div className="mt-3 flex items-center gap-2 overflow-hidden">
                    <UserRoundSearch size={14} className="shrink-0 text-gray-400" />
                    <div className="flex gap-1 overflow-x-auto custom-scrollbar">
                      {lead.referralSearches.slice(0, 3).map((search) => (
                        <a
                          key={search.label}
                          href={search.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-full bg-white dark:bg-gray-900 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300 hover:underline"
                        >
                          {search.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <a
                      href={lead.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-300 hover:underline"
                    >
                      <ExternalLink size={13} />
                      <span>Open job</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onSaveLead(lead)}
                      disabled={isSaved}
                      className="rounded-md bg-gray-900 dark:bg-white px-3 py-1.5 text-xs font-medium text-white dark:text-gray-900 disabled:cursor-default disabled:opacity-60"
                    >
                      {isSaved ? 'Saved' : 'Wishlist'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
