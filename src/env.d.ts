interface ImportMetaEnv {
	/** URL base de Strapi, sin `/api` (ej. https://cms.temsunal.org). */
	readonly STRAPI_URL?: string;
	/** API token de solo lectura de Strapi. Solo se usa en build. */
	readonly STRAPI_TOKEN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
