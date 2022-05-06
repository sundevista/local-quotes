export const author_regexp = /:::.+:::/gm;
export const quote_regexp = /(- .+)|(\d. .+)/gm;

export const codeblock_id_regexp = /id \w+/gm;
export const codeblock_author_regexp = /author .+/gm;
export const codeblock_reloadInterval_regexp = /reload \d+\w/gm;
export const codeblock_customClass_regexp = /customClass \w+/gm;

export const sec_in_minute = 60;
export const sec_in_hour = 3600;
export const sec_in_day = 86400;
export const sec_in_week = 604800;
export const sec_in_month = 2592000;
export const sec_in_year = 31536000;

export const quote_format = '{{content}}\n— {{author}}';
