import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '../types';
import { cn } from '../utils';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Calendar, ExternalLink, FileText, Edit2, Trash2, Sparkles } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onWishlistLead?: (job: Job) => void;
}

const statusColors = {
  'Fetch Jobs': 'border-l-emerald-400',
  Wishlist: 'border-l-gray-400',
  Applied: 'border-l-blue-400',
  'Follow-up': 'border-l-purple-400',
  Interview: 'border-l-yellow-400',
  Offer: 'border-l-green-400',
  Rejected: 'border-l-red-400',
};

export function JobCard({ job, onEdit, onDelete, onWishlistLead }: JobCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: 'Job',
      job,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-dashed border-gray-400 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[140px]"
      />
    );
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the job at ${job.companyName}?`)) {
      onDelete(job.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(job);
  };

  const handleWishlistLead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistLead?.(job);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4",
        statusColors[job.status]
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1 overflow-hidden">
          {job.isLead && <Sparkles size={14} className="text-emerald-500 flex-shrink-0" />}
          <span className="truncate" title={job.companyName}>{job.companyName}</span>
          {job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} className="text-blue-500 hover:text-blue-700 ml-1 flex-shrink-0">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        
        <div className="flex flex-shrink-0">
          {!job.isLead && (
            <button onClick={handleEdit} className="p-1 text-gray-400 hover:text-blue-500 rounded">
              <Edit2 size={14} />
            </button>
          )}
          <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500 rounded">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 truncate" title={job.jobTitle}>
        {job.jobTitle}
      </div>

      {job.fitScore && (
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {job.fitScore}
          </span>
          {job.roleCategory && <span className="truncate text-gray-500 dark:text-gray-400">{job.roleCategory}</span>}
        </div>
      )}

      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar size={12} className="flex-shrink-0" />
          <span>{formatDistanceToNow(job.createdAt || job.dateApplied, { addSuffix: true })}</span>
        </div>
        
        {job.salaryRange && (
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign size={12} className="flex-shrink-0" />
            <span title={job.salaryRange}>{job.salaryRange}</span>
          </div>
        )}
        
        {job.resumeUsed && (
          <div className="flex items-center gap-1.5 truncate">
            <FileText size={12} className="flex-shrink-0" />
            <span title={job.resumeUsed} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[10px] truncate">{job.resumeUsed}</span>
          </div>
        )}
      </div>

      {job.isLead && (
        <button
          type="button"
          onClick={handleWishlistLead}
          className="mt-3 w-full rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
        >
          Wishlist
        </button>
      )}
    </div>
  );
}
