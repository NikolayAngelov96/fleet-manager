type HTTPMethods = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

const host = "";

async function request(method: HTTPMethods, url: string, data?: any) {
  const options: {
    method: HTTPMethods;
    headers: { [header: string]: string };
    body?: string;
  } = {
    method,
    headers: {},
  };

  if (data !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(host + url, options);

    if (response.status == 204) {
      return response;
    }

    const result = await response.json();

    if (response.ok == false) {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type MethodsWithoutBody = (url: string) => Promise<any>;
type MethodsContainingBody = (url: string, data: any) => Promise<any>;

export const api: {
  get: MethodsWithoutBody;
  post: MethodsContainingBody;
  put: MethodsContainingBody;
  delete: MethodsWithoutBody;
} = {
  get: request.bind(null, "GET"),
  post: request.bind(null, "POST"),
  put: request.bind(null, "PUT"),
  delete: request.bind(null, "DELETE"),
};
