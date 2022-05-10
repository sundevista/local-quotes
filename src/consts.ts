// Long regular expressions created for Ukrainian, Russian, Japanese and partial Chinese support

export const author_regexp: RegExp =
	/^:::[\w ,.*_'"іІїЇёЁа-яА-Я一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤ヶ\u4e00-\u9fa5]+:::$/m;
export const quote_regexp: RegExp = /^\d+\..+$|^- .+$/m;

export const search_regexp: RegExp =
	/^(?:[\w ,._'"іІїЇёЁа-яА-Я一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤ヶ\u4e00-\u9fa5]| \|\| )+$/m;

export const code_block_id_regexp: RegExp = /^id [\w\-_]+$/m;
export const code_block_search_regexp: RegExp =
	/^search (?:[\w ,._'"іІїЇёЁа-яА-Я一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤ヶ\u4e00-\u9fa5]| \|\| )+$/m;
export const code_block_refreshInterval_regexp: RegExp = /^refresh \d+[smhdwMy]$/m;
export const code_block_customClass_regexp: RegExp = /^customClass \.?[\w\-_]+$/m;

export const sec_in_minute: number = 60;
export const sec_in_hour: number = 3600;
export const sec_in_day: number = 86400;
export const sec_in_week: number = 604800;
export const sec_in_month: number = 2629746;
export const sec_in_year: number = 31556952;
