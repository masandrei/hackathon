/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationAdminDetail } from '../models/CalculationAdminDetail';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * List all submitted calculations
     * @param page Page number (starting from 1)
     * @param limit Number of items per page
     * @returns any A paginated list of submitted calculations
     * @throws ApiError
     */
    public static listCalculations(
        page: number = 1,
        limit: number = 20,
    ): CancelablePromise<{
        submissions?: Array<CalculationAdminDetail>;
        page?: number;
        pageSize?: number;
        totalItems?: number;
        totalPages?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calculations',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Download all submitted calculations in XLS format
     * @param lang Language for the exported file
     * @returns binary XLS file containing all submitted calculations
     * @throws ApiError
     */
    public static downloadAllCalculations(
        lang: string = 'pl-PL',
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calculations/download',
            query: {
                'lang': lang,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
