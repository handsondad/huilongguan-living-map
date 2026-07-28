export type ThemeAccent = 'sand' | 'blue' | 'pink' | 'green' | 'purple' | 'leaf' | 'yellow';

export interface Theme {
  id: string;
  index: string;
  icon: string;
  accent: ThemeAccent;
  label: string;
  title: string;
  summary: string;
  question: string;
  prompts: string[];
  fields: string[];
  outputs: string[];
}

export interface Observation {
  id: string;
  themeId: Theme['id'];
  title: string;
  place: string;
  date: string;
  status: 'draft' | 'published';
  summary: string;
  childQuote?: string;
}
