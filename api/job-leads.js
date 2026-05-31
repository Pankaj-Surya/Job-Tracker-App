const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const ROLE_QUERIES = [
  'SDET',
  'QA Engineer',
  'Test Automation Engineer',
];

const TOP_PRODUCT_COMPANIES = [
  'Adobe',
  'Airbnb',
  'Akamai',
  'Alphabet',
  'Amazon',
  'AMD',
  'Apple',
  'Atlassian',
  'Autodesk',
  'Broadcom',
  'Booking',
  'Block',
  'ByteDance',
  'Cisco',
  'Cloudflare',
  'Coinbase',
  'CrowdStrike',
  'Datadog',
  'Databricks',
  'Dell',
  'Dropbox',
  'eBay',
  'Google',
  'HubSpot',
  'IBM',
  'Intel',
  'Intuit',
  'LinkedIn',
  'Meta',
  'Microsoft',
  'MongoDB',
  'Netflix',
  'Nvidia',
  'Oracle',
  'Palantir',
  'PayPal',
  'Pinterest',
  'Qualcomm',
  'Salesforce',
  'SAP',
  'ServiceNow',
  'Shopify',
  'Snap',
  'Snowflake',
  'Spotify',
  'Stripe',
  'Tesla',
  'Twilio',
  'Uber',
  'VMware',
  'Workday',
  'Zoom',
];

const COMPANY_ALIASES = new Map([
  ['Alphabet', ['Alphabet', 'Google']],
  ['Meta', ['Meta', 'Facebook', 'Instagram', 'WhatsApp']],
  ['Nvidia', ['Nvidia', 'NVIDIA']],
  ['Microsoft', ['Microsoft', 'LinkedIn', 'GitHub']],
  ['Amazon', ['Amazon', 'AWS']],
  ['Akamai', ['Akamai']],
  ['Block', ['Block', 'Square']],
]);

const QA_KEYWORDS = [
  'qa',
  'quality',
  'sdet',
  'test',
  'automation',
  'selenium',
  'playwright',
  'cypress',
  'api testing',
  'performance',
];

function getEnv(name) {
  return process.env[name] || '';
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function isTopCompany(companyName) {
  const company = normalize(companyName);
  return TOP_PRODUCT_COMPANIES.some((name) => {
    const aliases = COMPANY_ALIASES.get(name) || [name];
    return aliases.some((alias) => company.includes(normalize(alias)));
  });
}

function getCompanyPriority(companyName) {
  const company = normalize(companyName);
  const index = TOP_PRODUCT_COMPANIES.findIndex((name) => {
    const aliases = COMPANY_ALIASES.get(name) || [name];
    return aliases.some((alias) => company.includes(normalize(alias)));
  });
  return index === -1 ? 0 : Math.max(5, 40 - index);
}

function getRoleCategory(title) {
  const role = normalize(title);
  if (role.includes('architect')) return 'Test Architect';
  if (role.includes('lead') || role.includes('manager')) return 'QA Leadership';
  if (role.includes('sdet')) return 'SDET';
  if (role.includes('automation')) return 'Test Automation';
  if (role.includes('quality') || role.includes('qa')) return 'Quality Engineering';
  return 'QA Related';
}

function getResumeHint(title, description) {
  const text = normalize(`${title} ${description}`);
  if (text.includes('playwright')) return 'Use your Playwright/API automation resume.';
  if (text.includes('cypress')) return 'Use your Cypress/web automation resume.';
  if (text.includes('selenium')) return 'Use your Selenium automation resume.';
  if (text.includes('performance')) return 'Use your performance testing resume.';
  if (text.includes('lead') || text.includes('manager')) return 'Use your QA leadership resume.';
  if (text.includes('architect')) return 'Use your test strategy and architecture resume.';
  return 'Use your strongest QA automation resume.';
}

function buildReferralSearches(companyName, jobTitle) {
  const encodedCompany = encodeURIComponent(companyName);
  const encodedTitle = encodeURIComponent(jobTitle);
  const roles = [
    'recruiter',
    'talent partner',
    'QA manager',
    'SDET lead',
    'engineering manager',
  ];

  return roles.map((role) => ({
    label: role,
    url: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20${encodeURIComponent(role)}%20${encodedTitle}`,
  }));
}

function calculateFitScore(job) {
  const text = normalize(`${job.title} ${job.description}`);
  const keywordScore = QA_KEYWORDS.reduce((score, keyword) => (
    text.includes(keyword) ? score + 7 : score
  ), 0);
  const priorityScore = getCompanyPriority(job.company?.display_name);
  const createdAt = Date.parse(job.created || '');
  const ageDays = Number.isFinite(createdAt) ? (Date.now() - createdAt) / ONE_DAY_MS : 7;
  const freshnessScore = Math.max(0, 25 - Math.floor(ageDays) * 3);
  return Math.min(98, 25 + keywordScore + priorityScore + freshnessScore);
}

function getFitReasons(job) {
  const text = normalize(`${job.title} ${job.description}`);
  const reasons = [];
  if (isTopCompany(job.company?.display_name)) reasons.push('Top product company target');
  if (text.includes('automation') || text.includes('sdet')) reasons.push('Strong QA automation signal');
  if (text.includes('playwright') || text.includes('selenium') || text.includes('cypress')) reasons.push('Hands-on test framework keywords');
  if (text.includes('api')) reasons.push('API testing relevance');
  if (text.includes('lead') || text.includes('architect')) reasons.push('Senior QA career path match');
  return reasons.slice(0, 3);
}

function formatSalary(job) {
  const min = job.salary_min;
  const max = job.salary_max;
  if (!min && !max) return undefined;
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'USD',
  });
  if (min && max) return `${formatter.format(min)}-${formatter.format(max)}`;
  return formatter.format(min || max);
}

function mapAdzunaJob(job) {
  const companyName = job.company?.display_name || 'Unknown company';
  const createdAt = Date.parse(job.created || '');
  return {
    id: `adzuna-${job.id}`,
    companyName,
    jobTitle: job.title || 'QA role',
    jobUrl: job.redirect_url || job.adref || '',
    createdAt,
    source: 'adzuna',
    sourceId: String(job.id),
    location: job.location?.display_name,
    salaryRange: formatSalary(job),
    description: job.description,
    fitScore: calculateFitScore(job),
    fitReasons: getFitReasons(job),
    roleCategory: getRoleCategory(job.title),
    resumeHint: getResumeHint(job.title, job.description),
    referralSearches: buildReferralSearches(companyName, job.title || 'QA role'),
  };
}

async function fetchRole(role, country, appId, appKey) {
  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
  url.searchParams.set('app_id', appId);
  url.searchParams.set('app_key', appKey);
  url.searchParams.set('content-type', 'application/json');
  url.searchParams.set('results_per_page', '20');
  url.searchParams.set('sort_by', 'date');
  url.searchParams.set('max_days_old', '7');
  url.searchParams.set('what', role);

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Adzuna ${response.status}: ${body.slice(0, 180)}`);
  }

  return response.json();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRolesSafely(country, appId, appKey) {
  const results = [];
  const errors = [];

  for (const role of ROLE_QUERIES) {
    try {
      results.push(await fetchRole(role, country, appId, appKey));
      await wait(1200);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `Unable to fetch ${role}`);
      if (String(errors.at(-1)).includes('429')) break;
    }
  }

  return { results, errors };
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const appId = getEnv('ADZUNA_APP_ID');
  const appKey = getEnv('ADZUNA_APP_KEY');
  const country = normalize(getEnv('ADZUNA_COUNTRY') || request.query.country || 'us') || 'us';

  if (!appId || !appKey) {
    response.status(500).json({
      error: 'Missing ADZUNA_APP_ID or ADZUNA_APP_KEY on the server.',
    });
    return;
  }

  try {
    const { results, errors } = await fetchRolesSafely(country, appId, appKey);

    const weekAgo = Date.now() - 7 * ONE_DAY_MS;
    const seen = new Set();
    const leads = results
      .flatMap((result) => result.results || [])
      .filter((job) => job.id && !seen.has(job.id) && seen.add(job.id))
      .filter((job) => isTopCompany(job.company?.display_name))
      .filter((job) => {
        const createdAt = Date.parse(job.created || '');
        return Number.isFinite(createdAt) && createdAt >= weekAgo;
      })
      .map(mapAdzunaJob)
      .sort((a, b) => b.fitScore - a.fitScore || b.createdAt - a.createdAt)
      .slice(0, 10);

    if (!leads.length && errors.length) {
      response.status(errors.some((error) => error.includes('429')) ? 429 : 502).json({
        error: errors[0],
        leads: [],
      });
      return;
    }

    response.status(200).json({
      generatedAt: new Date().toISOString(),
      source: 'Adzuna',
      attribution: 'Jobs by Adzuna',
      leads,
      warnings: errors,
    });
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : 'Unable to fetch job leads.',
    });
  }
}
