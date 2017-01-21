import { Message } from '../Message';
import { Queue } from '../Queue';
import { QueueFilter } from './QueueFilter';
import { HandlerResponse } from '../Handlers/HandlerResponse';

export class RetryFilter extends QueueFilter {
    maxRetryAttempts: number;
    constructor(maxRetryAttempts: number) {
        super();
        this.maxRetryAttempts = maxRetryAttempts ? maxRetryAttempts : 3;
    }
    beforeResponse(queue: Queue, response: HandlerResponse): HandlerResponse {
        response = response as HandlerResponse;
        if (!response.wasSuccessful) {
            let retries = response.message.getHeader("retries");
            if (retries < this.maxRetryAttempts) {
                retries++;
                response.message.setHeader("retries", retries);
                queue.enqueue(response.message);
            }
        }
        return response;
    }

}
