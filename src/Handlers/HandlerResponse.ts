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
}