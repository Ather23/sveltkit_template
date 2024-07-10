export class OpenAiConfig{
    model:string
    openAiKey:string;

    constructor(model:string, openAiKey:string){
        this.model=model;
        this.openAiKey=openAiKey;
    }
}

