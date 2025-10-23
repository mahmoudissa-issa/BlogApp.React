export interface APIResponse<T> {
    statusCode:number;
    isSuccess:boolean;
    errorCode:number;
    totalRows:number;
    result:T;
}