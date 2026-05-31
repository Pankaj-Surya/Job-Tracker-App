export type JobStatus = 'Fetch Jobs' | 'Wishlist' | 'Applied' | 'Follow-up' | 'Interview' | 'Offer' | 'Rejected';

export interface ReferralSearch {
  label: string;
  url: string;
}

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  resumeUsed?: string;
  dateApplied: number;
  createdAt?: number;
  salaryRange?: string;
  notes?: string;
  status: JobStatus;
  source?: 'manual' | 'adzuna';
  isLead?: boolean;
  sourceId?: string;
  fitScore?: number;
  fitReasons?: string[];
  roleCategory?: string;
  resumeHint?: string;
  referralSearches?: ReferralSearch[];
}

export interface JobLead {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string;
  createdAt: number;
  source: 'adzuna';
  sourceId: string;
  location?: string;
  salaryRange?: string;
  description?: string;
  fitScore: number;
  fitReasons: string[];
  roleCategory: string;
  resumeHint: string;
  referralSearches: ReferralSearch[];
}
