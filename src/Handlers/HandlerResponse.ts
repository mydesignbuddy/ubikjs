import { Message } from '../Message';

export class HandlerResponse {
    public message: Message;
    public data: any;
    public wasSuccessful: boolean;

    constructor(message: Message, errorMessages: any, wasSuccessful: boolean) {
        this.message = message;
        this.data = errorMessages;
        this.wasSuccessful = wasSuccessful;
    }
    public static load(obj: any): HandlerResponse {
        let message = null;
        let data = null;
        let wasSuccessful = false;
        if (obj.message !== undefined) {
            message = obj.message;
        }
        if (obj.data !== undefined) {
            data = obj.data;
        }
        if (obj.wasSuccessful !== undefined) {
            wasSuccessful = obj.wasSuccessful;
        }
        return new HandlerResponse(message, data, wasSuccessful);
    }
}