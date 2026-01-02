// ======= read DTO =======
export interface GetUserProjectsDto {
  page?: number;
  limit?: number;
  order?: string[];
  order_by?: string[];
}

export interface GetUserProjectFinalDto {
  page: number;
  limit: number;
  order: string[];
  order_by: string[];
}



