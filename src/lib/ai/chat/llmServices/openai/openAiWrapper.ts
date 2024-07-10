import { OpenAI } from "openai";
import type { OpenAiConfig } from "./openAiConfig";
import type { IChatMessage } from "../../models/chat";
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { OpenAiUtils } from "./util";
export interface ILlmChatResponse{
    message:string;
}

export interface ILllmChatService{
    predictAsStreamAsync(chatHistory:Array<IChatMessage>): AsyncGenerator<ILlmChatResponse>;    
}

class OpenAiChatResponse implements ILlmChatResponse{
    message: string;
    constructor(message:string){
        this.message = message;
    }
}

class OpenAIChatWrapper implements ILllmChatService {
    config:OpenAiConfig;
    openai:OpenAI;

    constructor(config:OpenAiConfig)
    {   
        this.config = config;
        this.openai = new OpenAI({ apiKey: config.openAiKey, dangerouslyAllowBrowser: true } );
    }

    async * predictAsStreamAsync(chatHistory:Array<IChatMessage>): AsyncGenerator<ILlmChatResponse> {
        
        const history : ChatCompletionMessageParam[] = chatHistory.map((h)=>{
            return {
                    "role" : OpenAiUtils.roleToString(h.getMessageFrom().role),
                    "content":h.message
            } as ChatCompletionMessageParam
        });



        const stream = await this.openai.chat.completions.create({
            model:'gpt-3.5-turbo',
            messages: history,
            stream: true,
          });
          for await (const chunk of stream) {
            if (chunk.choices[0]?.finish_reason == "stop") {
                break;
            }
            const token = chunk.choices[0]?.delta?.content || '';
            yield new OpenAiChatResponse(token)
          }
    }
}


export {OpenAIChatWrapper, OpenAiChatResponse}