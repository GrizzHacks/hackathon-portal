import ky, { Input, Options } from "ky";
import { apiUrl, firebaseApp } from "../config/firebaseConfig";

const options: Options = {
  prefixUrl: apiUrl,
};

const apiKyClient = ky.create(options);

const getUserToken = () => {
  const currentUser = firebaseApp.auth().currentUser;
  return currentUser
    ? currentUser
        .getIdToken()
        .then((token) => {
          return token;
        })
        .catch((err) => {
          console.log(err);
          return "";
        })
    : Promise.resolve("");
};

const createAuthHeaderOptions = (options?: Options) => {
  return getUserToken()?.then((token) => {
    if (!options) {
      options = {};
    }
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return options;
  });
};

class apiClient {
  /**
	Fetch the given `url` using the option `{method: 'get'}`.

	@param url - `Request` object, `URL` object, or URL string.
	@returns A promise with `Body` methods added.
	*/
  get: (url: Input, options?: Options) => Promise<Response> = (
    url,
    options
  ) => {
    return createAuthHeaderOptions(options).then((options) => {
      return apiKyClient.get(url, options);
    });
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
    return createAuthHeaderOptions(options).then((options) => {
      return apiKyClient.get(url, options);
    });
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
    return createAuthHeaderOptions(options).then((options) => {
      return apiKyClient.get(url, options);
    });
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
    return createAuthHeaderOptions(options).then((options) => {
      return apiKyClient.get(url, options);
    });
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
    return createAuthHeaderOptions(options).then((options) => {
      return apiKyClient.get(url, options);
    });
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
    return createAuthHeaderOptions(options).then((options) => {
      return apiKyClient.get(url, options);
    });
  };
}

export default apiClient;
