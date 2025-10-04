/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CalculationAdminDetail = {
    calculationId: string;
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
    sex: CalculationAdminDetail.sex;
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
     * Currency value, format: digits.digits (2 decimal places)
     */
    nominalPension: string;
    /**
     * Currency value, format: digits.digits (2 decimal places)
     */
    realPension: string;
    postalCode: string;
};
export namespace CalculationAdminDetail {
    /**
     * Sex of the person, must be 'male' or 'female'
     */
    export enum sex {
        MALE = 'male',
        FEMALE = 'female',
    }
}

