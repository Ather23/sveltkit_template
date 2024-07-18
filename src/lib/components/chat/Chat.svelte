<script lang="ts">
	import 'bytemd/dist/index.css';
	import { OpenAiConfig } from '$lib/ai/chat/llmServices/openai/openAiConfig';
	import {
		OpenAIChatWrapper,
		OpenAiChatResponse
	} from '$lib/ai/chat/llmServices/openai/openAiWrapper';
	import {
		ChatMessage,
		ChatMessageCollection,
		type IChatMessage,
		ChatSession,
		MessageFrom,
		Role
	} from '$lib/ai/chat/models/chat';
	import ChatMessageDisplay from '$lib/components/chat/ChatMessageDisplay.svelte';
	import { Button, Drawer, Textarea, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte';
	import {
		CodeOutline,
		FaceGrinOutline,
		MapPinAltSolid,
		PaperClipOutline,
		PaperPlaneOutline
	} from 'flowbite-svelte-icons';
	import { afterUpdate, onMount } from 'svelte';

	import { draggable } from '@neodrag/svelte';

	let openAiConfig = new OpenAiConfig('gpt-4', '');
	let openAiChatService = new OpenAIChatWrapper(openAiConfig);

	let chatSession = new ChatSession('test_Session', new ChatMessageCollection());

	// system prompt
	let prompt = 'Your name is Hal. Only reply in markdown format.';
	let systemFrom = new MessageFrom(false, 'type', 'system', Role.SYSTEM);
	chatSession.addChatMessage(new ChatMessage(new Date(), systemFrom, prompt));

	let userInput = '';
	let agentResponse: IChatMessage;
	let chatHistory: IChatMessage[];

	async function callAiAgent() {
		let date = new Date();

		renderHistory();
		// user
		let userMsgFrom = new MessageFrom(false, 'type', 'userx', Role.USER);
		chatSession.addChatMessage(new ChatMessage(date, userMsgFrom, userInput));
		let stream = await openAiChatService.predictAsStreamAsync(chatSession.getChatMessages());

		// agent
		let agentMsgFrom = new MessageFrom(true, 'type', 'agentx', Role.AGENT);
		agentResponse = new ChatMessage(date, agentMsgFrom, '');
		for await (const prediction of stream) {
			agentResponse.updateMessage(prediction.message);
			agentResponse = agentResponse;
		}
		chatSession.addChatMessage(agentResponse);
		userInput = '';
	}

	let chatContainer: HTMLDivElement | null = null;

	// Scroll to bottom function
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	// Scroll to bottom on mount
	onMount(() => {
		scrollToBottom();
	});

	// Scroll to bottom after each update
	afterUpdate(() => {
		scrollToBottom();
	});

	function renderHistory() {
		chatHistory = chatSession.getChatMessages();
	}
</script>

<div
	class="text-lime-600 p-2 max-h-[50vh] overflow-y-auto overflow-x-hidden w-full"
	bind:this={chatContainer}
>
	{#if chatHistory}
		{#each chatHistory as hist}
			{#if hist.getMessageFrom().role !== Role.SYSTEM}
				<ChatMessageDisplay chatMessage={hist} />
			{/if}
		{/each}
	{/if}
	{#key agentResponse}
		<ChatMessageDisplay chatMessage={agentResponse} />
	{/key}
</div>
<div class="w-full h-full">
	<form class="h-full w-full">
		<label for="editor" class="sr-only">Publish post</label>
		<Textarea
			id="editor"
			rows="5"
			class="mb-4"
			placeholder="Write a comment"
			bind:value={userInput}
		>
			<Toolbar slot="footer" embedded>
				<ToolbarGroup>
					<ToolbarButton name="Attach file"
						><PaperClipOutline class="w-6 h-6 rotate-45" /></ToolbarButton
					>
					<ToolbarButton name="Embed map"><MapPinAltSolid class="w-6 h-6" /></ToolbarButton>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton name="Format code"><CodeOutline class="w-6 h-6" /></ToolbarButton>
					<ToolbarButton name="Add emoji"><FaceGrinOutline class="w-6 h-6" /></ToolbarButton>
				</ToolbarGroup>
				<ToolbarButton name="send" slot="end" on:click={callAiAgent}
					><PaperPlaneOutline class="w-6 h-6 rotate-45" /></ToolbarButton
				>
			</Toolbar>
		</Textarea>
	</form>
</div>

<style>
	/* Set your monospace font (Required to have the editor working correctly!) */
	:global(.carta-font-code) {
		font-family: '...', monospace;
		font-size: 1.1rem;
		color: white;
	}
</style>
