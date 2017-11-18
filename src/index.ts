import {HttpClient} from "@angular/common/http";
import {TranslateLoader} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";

export class TranslatePropertiesHttpLoader implements TranslateLoader {

	constructor(protected _http: HttpClient, protected _prefix: string = '/assets/i18n/', protected _suffix: string = '.properties') {
	}

	/**
	 * Gets the translations from the server
	 * @param lang
	 * @returns {any}
	 */
	public getTranslation(lang: string): Observable<any> {
		return this._http
			.get(`${this._prefix}/${lang}${this._suffix}`, {responseType: 'text'})
			.map((contents: string) => this.parseFile(contents));
	}

	/**
	 * Parse property file
	 * @param fileContent
	 * @returns {any}
	 */
	protected parseFile(fileContent: string): any {
		let map = this.readProperties(fileContent);
		return this.convertPropsToObject(map);
	}

	protected readProperties(file: string): Map<string, string> {
		let lines: string[] = file.split('\n');
		let ret: Map<string, string> = new Map();
		lines.forEach((line: string) => {
			line = line.trim();
			if (line.length > 0 && line.charAt(0) !== '#') {
				let equalIndex = line.indexOf('=');
				if (equalIndex !== -1) {
					let key = line.substring(0, equalIndex);
					let value = line.substring(equalIndex + 1);
					ret.set(key, value);
				}
			}
		});
		return ret;
	}

	protected convertPropsToObject(props: Map<string, string>): any {
		let ret: any = {};

		for (let key in props.keys()) {
			if (Object.prototype.hasOwnProperty.call(ret, key)) {
				let currentObject = ret;
				let splitKey = key.split('.');

				for (let i = 0; i < splitKey.length - 1; i++) {
					let part = splitKey[i];

					if (!currentObject[part]) {
						currentObject[part] = {};
					}
					currentObject = currentObject[part];
				}

				let lastKey = splitKey[splitKey.length - 1];
				currentObject[lastKey] = ret[key];
			}
		}

		return ret;
	}

}
