/* Custom service for Statistics endpoints */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface StatisticsDataResponse {
    year: number;
    value: number;
}

export interface LifeExpectancyData {
    male: StatisticsDataResponse[];
    female: StatisticsDataResponse[];
}

export interface StatisticsResponse {
    growth_rate: StatisticsDataResponse[];
    average_wage: StatisticsDataResponse[];
    valorization: StatisticsDataResponse[];
    inflation: StatisticsDataResponse[];
    life_expectancy: LifeExpectancyData;
    meta?: Record<string, any>;
}

export interface HealthCheckResponse {
    status: string;
    timestamp: string;
}

export class StatisticsService {
    /**
     * Get all statistics data
     * @returns StatisticsResponse All statistics including growth rate, wages, inflation, and life expectancy
     * @throws ApiError
     */
    public static getStatistics(): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get growth rate statistics
     * @returns StatisticsDataResponse[] Growth rate data by year
     * @throws ApiError
     */
    public static getGrowthRate(): CancelablePromise<StatisticsDataResponse[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/growth-rate',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get average wage statistics
     * @returns StatisticsDataResponse[] Average wage data by year
     * @throws ApiError
     */
    public static getAverageWage(): CancelablePromise<StatisticsDataResponse[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/average-wage',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get valorization statistics
     * @returns StatisticsDataResponse[] Valorization data by year
     * @throws ApiError
     */
    public static getValorization(): CancelablePromise<StatisticsDataResponse[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/valorization',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Get inflation statistics
     * @returns StatisticsDataResponse[] Inflation data by year
     * @throws ApiError
     */
    public static getInflation(): CancelablePromise<StatisticsDataResponse[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/inflation',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Health check endpoint
     * @returns HealthCheckResponse Health status of the API
     * @throws ApiError
     */
    public static healthCheck(): CancelablePromise<HealthCheckResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}

