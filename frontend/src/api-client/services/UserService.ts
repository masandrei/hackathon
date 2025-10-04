/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationDetail } from '../models/CalculationDetail';
import type { CalculationRequest } from '../models/CalculationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Download specific calculation as PDF file
     * @param id calculation identifier
     * @returns binary PDF file containing the calculation
     * @throws ApiError
     */
    public static downloadCalculationById(
        id: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calculations/{id}/download',
            path: {
                'id': id,
            },
            errors: {
                404: `Calculation not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get detailed calculation by ID
     * @param id calculation identifier
     * @returns CalculationDetail Detailed calculation information
     * @throws ApiError
     */
    public static getCalculationById(
        id: string,
    ): CancelablePromise<CalculationDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calculations/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Calculation not found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Submit new calculation
     * @param requestBody
     * @returns any Successfully created calculation
     * @throws ApiError
     */
    public static submitCalculation(
        requestBody: CalculationRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calculations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                500: `Internal Server Error`,
            },
        });
    }
}
