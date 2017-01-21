export class Message {
    public id: string;
    public headers: { [key: string]: any };
    public payload: string;
    public messageType: string;

    constructor(payload: string, headers?: { [key: string]: any }) {
        this.payload = payload;
        this.headers = {};
        if (headers !== undefined && headers !== null) {
            for (let headerKey in headers) {
                this.setHeader(headerKey, headers[headerKey]);
            }
        }
    }

    public getHeader(name: string): any {
        if (this.headers[name] !== undefined) {
            return this.headers[name];
        }
        return null;
    }

    public setHeader = (name: string, value: any): void => {
        this.headers[name] = value;
    }

    public static load(message: Message): Message {
        if (message !== null) {
            let newMessage = new Message(message.payload, message.headers);
            if (message.id !== undefined) {
                newMessage.id = message.id;
            }
            return newMessage;
        }
        return null;
    }
}
