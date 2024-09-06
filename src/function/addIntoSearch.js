import { fetchApiRes } from "./getApi";

export const insertSearch = async (data) => {
  await fetchApiRes("insertSearch", "POST", data);
};
