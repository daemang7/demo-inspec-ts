import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { apiRequest as apiClientRequest } from "./api-client";

export async function apiRequest(method: string, url: string, data?: unknown | undefined): Promise<Response> {
  try {
    // 새로운 API 클라이언트 사용
    let response;

    switch (method.toUpperCase()) {
      case "GET":
        response = await apiClientRequest.get(url);
        break;
      case "POST":
        response = await apiClientRequest.post(url, data);
        break;
      case "PUT":
        response = await apiClientRequest.put(url, data);
        break;
      case "DELETE":
        response = await apiClientRequest.delete(url);
        break;
      case "PATCH":
        response = await apiClientRequest.patch(url, data);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    // 성공적인 응답인지 확인
    if (response.status >= 200 && response.status < 300) {
      // Response 객체로 변환
      const responseData = response.data;
      const responseStatus = response.status;
      const responseStatusText = response.statusText;
      const responseHeaders = response.headers;

      // Response 객체 생성
      const responseBody = JSON.stringify(responseData);
      const responseInit: ResponseInit = {
        status: responseStatus,
        statusText: responseStatusText,
        headers: responseHeaders,
      };

      return new Response(responseBody, responseInit);
    } else {
      // 에러 응답인 경우
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    // 에러를 Response 객체로 변환
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorResponse = new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    throw errorResponse;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn =
  <T>(options: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    try {
      // 새로운 API 클라이언트 사용
      const url = queryKey.join("/") as string;
      console.log("QueryFn - queryKey:", queryKey);
      console.log("QueryFn - built URL:", url);
      const response = await apiClientRequest.get<T>(url);

      // 401 에러 처리
      if (options.on401 === "returnNull" && response.status === 401) {
        return null as T;
      }

      return response.data as T;
    } catch (error) {
      console.error("QueryFn - error:", error);
      // 에러 처리
      if (error instanceof Error && error.message.includes("401")) {
        if (options.on401 === "returnNull") {
          return null as T;
        }
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
