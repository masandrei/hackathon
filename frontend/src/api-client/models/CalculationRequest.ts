/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Job } from './Job';
import type { Leave } from './Leave';
export type CalculationRequest = {
    calculationDate: string;
    /**
     * calculation time in UTC
     */
    calculationTime: string;
    /**
     * Currency value, format: digits.digits (2 decimal places)
     */
    expectedPension: string;
    /**
     * Age must be a non-negative integer, up to 6 digits
     */
    age: number;
    /**
     * Sex of the person, must be 'male' or 'female'
     */
    sex: CalculationRequest.sex;
    /**
     * Currency value, format: digits.digits (2 decimal places)
     */
    salary: string;
    isSickLeaveIncluded: boolean;
    /**
     * Currency value, format: digits.digits (2 decimal places)
     */
    totalAccumulatedFunds: string;
    /**
     * Year when an individual started working
     */
    yearWorkStart: number;
    /**
     * Year when an individual wants to retire
     */
    yearDesiredRetirement: number;
    postalCode?: string;
    jobs: Array<Job>;
    leaves: Array<Leave>;
};
export namespace CalculationRequest {
    /**
     * Sex of the person, must be 'male' or 'female'
     */
    export enum sex {
        MALE = 'male',
        FEMALE = 'female',
    }
}

