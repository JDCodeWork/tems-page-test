/**
 * Lightweight DOM utility inspired by jQuery.
 */
export interface ElApi {
	/**
	 * Gets or sets a data-* attribute.
	 */
	data(key: string, value?: string): string | ElApi | undefined;

	/**
	 * Checks whether a data-* attribute exists.
	 */
	hasData(key: string): boolean;

	/**
	 * Removes a data-* attribute.
	 */
	removeData(key: string): ElApi;

	/**
	 * Toggles a data-* attribute.
	 */
	toggleData(key: string): boolean;

	/**
	 * Adds one or more CSS classes.
	 */
	addClass(...classes: string[]): ElApi;

	/**
	 * Removes one or more CSS classes.
	 */
	removeClass(...classes: string[]): ElApi;

	/**
	 * Toggles a CSS class.
	 */
	toggleClass(className: string): ElApi;

	/**
	 * Checks whether a CSS class exists.
	 */
	hasClass(className: string): boolean;

	/**
	 * Adds an event listener.
	 */
	on<K extends keyof HTMLElementEventMap>(
		event: K,
		handler: (event: HTMLElementEventMap[K]) => void,
	): ElApi;

	/**
	 * Removes an event listener.
	 */
	off<K extends keyof HTMLElementEventMap>(
		event: K,
		handler: (event: HTMLElementEventMap[K]) => void,
	): ElApi;

	/**
	 * Dispatches a custom event.
	 */
	trigger(event: string, detail?: unknown): ElApi;

	/**
	 * Gets or sets a standard HTML attribute.
	 */
	attr(name: string, value?: string): string | null | ElApi;

	/**
	 * Returns the underlying HTMLElement.
	 */
	element(): HTMLElement;
}

/**
 * Lightweight DOM utility inspired by jQuery.
 *
 * @param selectorOrElement CSS selector or HTMLElement.
 *
 * @example
 * $el('#menu')
 *   .data('state', 'open')
 *   .addClass('active')
 *   .on('click', () => console.log('clicked'));
 */
export function $el(selectorOrElement: string | HTMLElement): ElApi {
	const el =
		typeof selectorOrElement === "string"
			? document.querySelector<HTMLElement>(selectorOrElement)
			: selectorOrElement;

	if (!el) {
		throw new Error(`Element not found: "${selectorOrElement}"`);
	}

	const api: ElApi = {
		/**
		 * Gets or sets a data-* attribute.
		 *
		 * @param key Attribute name without the `data-` prefix.
		 * @param value Optional value. If omitted, the current value is returned.
		 *
		 * @example
		 * $el('#menu').data('state', 'open');
		 * $el('#menu').data('state');
		 */
		data(key: string, value?: string) {
			if (value === undefined) {
				return el.dataset[key];
			}

			el.dataset[key] = value;
			return api;
		},

		/**
		 * Checks whether a data-* attribute exists.
		 *
		 * @param key Attribute name without the `data-` prefix.
		 */
		hasData(key: string) {
			return key in el.dataset;
		},

		/**
		 * Removes a data-* attribute.
		 *
		 * @param key Attribute name without the `data-` prefix.
		 */
		removeData(key: string) {
			delete el.dataset[key];
			return api;
		},

		/**
		 * Toggles a data-* attribute between "true" and "false".
		 *
		 * @param key Attribute name without the `data-` prefix.
		 * @returns The new boolean state.
		 *
		 * @example
		 * $el('#modal').toggleData('open');
		 * // data-open="true"
		 *
		 * $el('#modal').toggleData('open');
		 * // data-open="false"
		 */
		toggleData(key: string) {
			const current = el.dataset[key] === "true";
			const next = !current;

			el.dataset[key] = String(next);

			return next;
		},

		/**
		 * Adds one or more CSS classes.
		 *
		 * @param classes Classes to add.
		 */
		addClass(...classes: string[]) {
			el.classList.add(...classes);
			return api;
		},

		/**
		 * Removes one or more CSS classes.
		 *
		 * @param classes Classes to remove.
		 */
		removeClass(...classes: string[]) {
			el.classList.remove(...classes);
			return api;
		},

		/**
		 * Toggles a CSS class.
		 *
		 * @param className Class name to toggle.
		 */
		toggleClass(className: string) {
			el.classList.toggle(className);
			return api;
		},

		/**
		 * Checks whether a CSS class exists.
		 *
		 * @param className Class name to check.
		 */
		hasClass(className: string) {
			return el.classList.contains(className);
		},

		/**
		 * Adds an event listener.
		 *
		 * @param event DOM event name.
		 * @param handler Event handler.
		 */
		on(event, handler) {
			el.addEventListener(event, handler as EventListener);
			return api;
		},

		/**
		 * Removes an event listener.
		 *
		 * @param event DOM event name.
		 * @param handler Event handler.
		 */
		off(event, handler) {
			el.removeEventListener(event, handler as EventListener);
			return api;
		},

		/**
		 * Dispatches a custom event.
		 *
		 * @param event Event name.
		 * @param detail Optional event payload.
		 */
		trigger(event: string, detail?: unknown) {
			el.dispatchEvent(
				new CustomEvent(event, {
					detail,
					bubbles: true,
				}),
			);

			return api;
		},

		/**
		 * Gets or sets an HTML attribute.
		 *
		 * @param name Attribute name.
		 * @param value Optional value. If omitted, the current value is returned.
		 *
		 * @example
		 * $el('#link').attr('href');
		 * $el('#link').attr('target', '_blank');
		 */
		attr(name: string, value?: string) {
			if (value === undefined) {
				return el.getAttribute(name);
			}

			el.setAttribute(name, value);
			return api;
		},

		/**
		 * Returns the underlying HTMLElement.
		 *
		 * @example
		 * const button = $el('#button').element();
		 */
		element() {
			return el;
		},
	};

	return api;
}
