import apiClient from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

export function useWarehousesSummary() {
  return useQuery({
    queryKey: ['warehouses', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get('/warehouses/summary')

      return response.data.data
    },
  })
}