// Quote listing: author's and quote's lines
export const author_regexp: RegExp = /^:::(?:[^:|\s]| )+:::$/m;
export const quote_regexp: RegExp = /^\d+\..+$|^- .+$/m;

// Internal: search query
export const search_regexp: RegExp = /^(?:[^:|\s]| | \|\| )+$/m;

// Code block fields: id, search, refresh, customClass
export const code_block_id_regexp: RegExp = /^id [\w\-_]+$/m;
export const code_block_search_regexp: RegExp = /^search (?:[^:|\s]| | \|\| )+$/m;
export const code_block_refreshInterval_regexp: RegExp = /^refresh \d+[smhdwMy]$/m;
export const code_block_customClass_regexp: RegExp = /^customClass \.?[\w\-_]+$/m;

// Constant values for time (refresh) parsing
export const sec_in_minute: number = 60;
export const sec_in_hour: number = 3600;
export const sec_in_day: number = 86400;
export const sec_in_week: number = 604800;
export const sec_in_month: number = 2629746;
export const sec_in_year: number = 31556952;
