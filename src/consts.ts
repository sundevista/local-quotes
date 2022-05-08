export const author_regexp: RegExp = /:::\w(\w| |,|\.)+(\w|\.|,):::/gm;
export const quote_regexp: RegExp = /(- .+)|(\d. .+)/gm;

export const search_or_regexp: RegExp = /^([(\w|,| )+]|[ \|\| ])+/gm;
export const author_string_regexp: RegExp = /^\w(\w| |,|\.)+(\w|\.|,)/gm

export const codeblock_id_regexp: RegExp = /id \w+/gm;
export const codeblock_author_regexp: RegExp = /search .+/gm;
export const codeblock_reloadInterval_regexp: RegExp = /refresh \d+\w/gm;
export const codeblock_customClass_regexp: RegExp = /customClass \w+/gm;

export const sec_in_minute: number = 60;
export const sec_in_hour: number = 3600;
export const sec_in_day: number = 86400;
export const sec_in_week: number = 604800;
export const sec_in_month: number = 2629746;
export const sec_in_year: number = 31556952;
