import * as crypto from 'crypto';

export interface ISessionUpdateHandler {
    handle(chatSession:IChatSession):Promise<void>;
}

export interface IChatSessionManager{
    getSessionByIdAsync(sessionId:string):Promise<IChatSession>;
    generateRandomSessionId():Promise<string>;
    updateSessionAsync(chatSession:IChatSession):Promise<void>
    createNewSessionAsync():Promise<IChatSession>;
}


export interface IChatSession{
    session:string;
    chatMessages: IChatMessageCollection | null;
    addChatMessage(message:IChatMessage):void;
    registerSessionHandlers(handlers:ISessionUpdateHandler[]):void;
    getUpdateHandlers():ISessionUpdateHandler[]
    getChatMessages():IChatMessage[];
}

export interface IChatMessage{
    createDate:Date;
    message:string;
    messageFrom:IMessageFrom;

    getMessageFrom():IMessageFrom;
    getMessage():string
    updateMessage(token:string):void;
}

export interface IMessageFrom{
    isAgent:boolean;
    messageType:string;
    codeName:string;
    role: Role;

    getIsAgent():boolean;
}


export interface IChatMessageCollection{
    chatMessageHistory:IChatMessage[];
    addMessage(message:IChatMessage):void;
}

export interface IChatSessionService {
    getSessionByIdAsync(sessionId:string):Promise<IChatSession>;
    updateSessionByIdAsync(chatSession:IChatSession):Promise<void>;
}

export interface IRandomSessionIdGenerator{
    generateUniqueIdAsync():Promise<string>
}

class TempIdGenerator implements IRandomSessionIdGenerator{
    async generateUniqueIdAsync(): Promise<string> {
        const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
        return randomBytes.toString('hex').slice(0, length);
    }    
}

class ChatSessionManager implements IChatSessionManager{
    private _randomIdGenerator: IRandomSessionIdGenerator;
    private _chatSessionService: IChatSessionService;

    constructor(chatSessionService:IChatSessionService, randomIdGenerator:IRandomSessionIdGenerator){
        this._chatSessionService = chatSessionService;
        this._randomIdGenerator = randomIdGenerator;
    }
    async createNewSessionAsync(): Promise<IChatSession> {
        const sessionId = await this.generateRandomSessionId();
        return new ChatSession(sessionId);
    }
    async updateSessionAsync(chatSession: IChatSession): Promise<void> {
        await chatSession.getUpdateHandlers().map(async (u)=>{
           await u.handle(chatSession).catch((e)=>{
            console.log("Error updating session", e);
           })
        });
    }
    async generateRandomSessionId(): Promise<string> {
        return this._randomIdGenerator.generateUniqueIdAsync();
    }

    async getSessionByIdAsync(sessionId: string): Promise<IChatSession> {
        return await this._chatSessionService.getSessionByIdAsync(sessionId); 
    }    
}

class ChatMessageCollection implements IChatMessageCollection {
    chatMessageHistory: IChatMessage[];
    
    constructor(){
        this.chatMessageHistory = [];
    }

    addMessage(message: IChatMessage): void {
        this.chatMessageHistory.push(message);
    }
}

class ChatSession implements IChatSession {
    private _session:string; 
    private _chatMessageHistory:IChatMessageCollection | null;
    private _updateHandlers:ISessionUpdateHandler[];

    constructor(sessionId:string, chatHistory:IChatMessageCollection | null = null){
        if (sessionId === null){
            throw new Error("sessionId is null");
        }
        this._chatMessageHistory = chatHistory;
        this._session = sessionId;
        this._updateHandlers=[]
    }

    getChatMessages(): IChatMessage[] {
        if (this._chatMessageHistory === null){
            return []
        }
        return this._chatMessageHistory?.chatMessageHistory;
    }
    
    getUpdateHandlers(): ISessionUpdateHandler[] {
        return this._updateHandlers;
    }

    registerSessionHandlers(handlers: ISessionUpdateHandler[]): void {
      this._updateHandlers.push(...handlers);
    }

    addChatMessage(chatMessage:IChatMessage){
        if(this._chatMessageHistory == null){
            this._chatMessageHistory = new ChatMessageCollection();
        }
        this._chatMessageHistory.addMessage(chatMessage);
    }

    get session():string{      
        return this._session;
    }

    get chatMessages():IChatMessageCollection | null{
        return this._chatMessageHistory;
    }

}

enum Role{
    USER,
    SYSTEM,
    AGENT
}

class MessageFrom implements IMessageFrom {
    private _isAgent:boolean;
    private _messageType:string;
    private _codeName:string;
    private _role: Role;


    constructor(isAgent:boolean, messageType:string, codeName:string, role:Role){
        this._codeName = codeName;
        this._isAgent = isAgent;
        this._messageType = messageType;
        this._role = role;
    }
    getIsAgent(): boolean {
        return this._isAgent;
    }

    getRole():Role{
        return this._role;
    }


    get role():Role{
        return this._role;
    }

    get isAgent():boolean{
        return this._isAgent;
    }

    get codeName():string{
        return this._codeName;
    }

    get messageType():string{
        return this._messageType;
    }
}

class ChatMessage implements IChatMessage {
    private _createDate: Date;
    private _message: string;
    private _messageFrom: IMessageFrom
    constructor(createDate: Date, messageFrom:IMessageFrom, message: string) {
        this._createDate = createDate;
        this._message = message;
        this._messageFrom = messageFrom;
    }
    updateMessage(token: string): void {
       this.message = this.message.concat(token)
    }
    getMessageFrom(): IMessageFrom {
        return this._messageFrom
    }
    
    getMessage(): string{
        return this._message;
    }

    get createDate(): Date {
        return this._createDate;
    }
    get message(): string {
        return this._message;
    }

    get messageFrom():IMessageFrom{
        return this._messageFrom;
    }
    set createDate(value: Date) {
        this._createDate = value;
    }

    set message(value: string) {
        this._message = value;
    }
}

export {Role, ChatMessage, ChatSession, MessageFrom,ChatSessionManager, ChatMessageCollection, TempIdGenerator };