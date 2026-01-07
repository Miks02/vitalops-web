export type PagedResult<T> = {
    items: T[]
    page: number,
    pageSize: number,
    totalCountPaginated: number,
    totalCount: number
}
