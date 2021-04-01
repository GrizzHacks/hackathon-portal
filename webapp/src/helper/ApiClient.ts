import ky, { Input, Options } from "ky";
import { apiUrl, firebaseApp } from "../config/firebaseConfig";
import firebase from "firebase";

const options: Options = {
  prefixUrl: apiUrl,
  throwHttpErrors: false,
  timeout: 70000, // Slightly longer than the firebase emulator timeout of 60000
};

const apiKyClient = ky.create(options);

const getUserToken = (firebaseAppLocal: firebase.app.App) => {
  const currentUser = firebaseAppLocal.auth().currentUser;
  return currentUser
    ? currentUser
        .getIdToken(true)
        .then((token) => {
          return token;
        })
        .catch((err) => {
          console.log(err);
          return "";
        })
    : Promise.resolve("");
};

const createAuthHeaderOptions = (
  firebaseAppLocal: firebase.app.App,
  options?: Options
) => {
  return getUserToken(firebaseAppLocal)?.then((token) => {
    if (!options) {
      options = {};
    }
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return options;
  });
};

class ApiClient {
  firebaseAppLocal;

  constructor(firebaseAppLocal?: firebase.app.App) {
    this.firebaseAppLocal = firebaseAppLocal ? firebaseAppLocal : firebaseApp;
  }

  /**
	Fetch the given `url` using the option `{method: 'get'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  get: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(this.firebaseAppLocal, options).then(
      (options) => {
        return apiKyClient.get(url, options);
      }
    );
  };

  /**
	Fetch the given `url` using the option `{method: 'post'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  post: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(this.firebaseAppLocal, options).then(
      (options) => {
        return apiKyClient.post(url, options);
      }
    );
  };

  /**
	Fetch the given `url` using the option `{method: 'put'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  put: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(this.firebaseAppLocal, options).then(
      (options) => {
        return apiKyClient.put(url, options);
      }
    );
  };

  /**
	Fetch the given `url` using the option `{method: 'delete'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  delete: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(this.firebaseAppLocal, options).then(
      (options) => {
        return apiKyClient.delete(url, options);
      }
    );
  };

  /**
	Fetch the given `url` using the option `{method: 'patch'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  patch: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(this.firebaseAppLocal, options).then(
      (options) => {
        return apiKyClient.patch(url, options);
      }
    );
  };

  /**
	Fetch the given `url` using the option `{method: 'head'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  head: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(this.firebaseAppLocal, options).then(
      (options) => {
        return apiKyClient.head(url, options);
      }
    );
  };
}

export default ApiClient;
