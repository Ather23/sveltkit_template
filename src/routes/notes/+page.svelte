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
	import NotesCard from '$lib/components/NotesCard.svelte';

	import { draggable } from '@neodrag/svelte';
	import Chat from '$lib/components/chat/Chat.svelte';

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
		console.log('agentresponse', agentResponse);
		chatSession.addChatMessage(agentResponse);
		userInput = '';
	}

	let chatContainer: HTMLDivElement | null = null;

	// Scroll to bottom function
	function scrollToBottom() {
		if (chatContainer) {
			console.log('scrolling..');
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

	let hidden = false;
</script>

<div class="absolute end-6 bottom-6 w-1/4 h-3/4">
	<div class="end-10 bottom-15 w-3/4 h-3/4">
		{#if !hidden}
			<Chat />
		{/if}
	</div>

	<div class="absolute end-6 bottom-6">
		<Button on:click={() => (hidden = !hidden)}>Chat</Button>
	</div>
</div>

<div use:draggable>
	<NotesCard />
</div>

<style>
	/* Set your monospace font (Required to have the editor working correctly!) */
	:global(.carta-font-code) {
		font-family: '...', monospace;
		font-size: 1.1rem;
		color: white;
	}
</style>
