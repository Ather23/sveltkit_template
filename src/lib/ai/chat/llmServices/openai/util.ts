import { Role } from "../../models/chat";

export class OpenAiUtils{
    static roleToString(role:Role):string{
        switch(role){
            case Role.USER:
                return "user"
            case Role.AGENT:
                return "assistant"
            case Role.SYSTEM:
                return "system"
        } 
    }
}