/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessage } from '../models/ChatMessage';
import type { ChatResponse } from '../models/ChatResponse';
import type { OwlInfoResponse } from '../models/OwlInfoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChatService {
    /**
     * Get ZUŚka owl information
     * @returns OwlInfoResponse ZUŚka owl information
     * @throws ApiError
     */
    public static getOwlInfo(): CancelablePromise<OwlInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/owl/info',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }

    /**
     * Chat with ZUŚka owl
     * @param requestBody
     * @returns ChatResponse ZUŚka owl response
     * @throws ApiError
     */
    public static chatWithOwl(
        requestBody: ChatMessage,
    ): CancelablePromise<ChatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/chat/owl',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                500: `Internal Server Error`,
            },
        });
    }
}
