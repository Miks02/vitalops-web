
export type ApiResponse<T> = {
    data: T,
    message: T
    errorCode: string;
}
