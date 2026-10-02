// 모든 페이지/컴포넌트가 fetch를 직접 쓰지 않고 이 함수들을 통해서만
// json-server와 통신합니다. (과제 요구사항: "API 함수는 별도 파일로 분리")
// 주소가 바뀌거나 실제 백엔드로 전환할 때 이 파일 한 곳만 고치면 됩니다.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error("요청에 실패했습니다.");
  }

  return response.json();
}

export const getItems = () => request("/items?_sort=dueDate&_order=asc");

export const getItem = (id) => request(`/items/${id}`);

export const createItem = (data) =>
  request("/items", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateItem = (id, data) =>
  request(`/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteItem = (id) =>
  request(`/items/${id}`, {
    method: "DELETE",
  });
