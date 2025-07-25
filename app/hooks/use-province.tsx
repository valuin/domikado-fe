import { apiRequest } from "@/lib/api";
import { Province } from "@/types/province";
import { useQuery } from "@tanstack/react-query";

export const useProvince = ({
  provinceName,
}: {
  provinceName: string;
}) => {
  const { data, isLoading, error } = useQuery<Province[]>({
    queryKey: ["provinces", provinceName],
    queryFn: () => apiRequest<Province[]>(`/provinces/${provinceName}`),
  });

  return { data, isLoading, error };
};
