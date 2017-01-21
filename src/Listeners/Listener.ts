import { Message } from '../Message';
import { HandlerResponse } from '../Handlers/HandlerResponse';

export class Listener {
        private _successfulFunction: Function;
        private _failureFunction: Function;
        private _expiredFunction: Function;

        constructor(successfulFunction: Function, failureFunction: Function, expiredFunction: Function) {
            this._successfulFunction = successfulFunction;
            this._failureFunction = failureFunction;
            this._expiredFunction = expiredFunction;
        }
        public successful(response: HandlerResponse): void {
            this._successfulFunction(response);
        }
        public failure(response: HandlerResponse): void {
            this._failureFunction(response);
        }
        public expired(message: Message): void {
            this._expiredFunction(message);
        }
}