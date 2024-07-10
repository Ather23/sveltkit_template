<script lang="ts">
	import { Textarea, Toolbar, ToolbarButton } from 'flowbite-svelte';
	import { PaperPlaneOutline } from 'flowbite-svelte-icons';
	import ChatMessageDisplay from './ChatMessageDisplay.svelte';
	import { ChatSession, MessageFrom, ChatMessage, Role } from '$lib/ai/chat/models/chat';
	import { onMount } from 'svelte';

	let sessionId;
	let chatSession: ChatSession;

	onMount(() => {
		sessionId = '12312';
		chatSession = new ChatSession(sessionId, null);

		// 1 test
		let msgFrom = new MessageFrom(true, 'agent', 'code_user', Role.AGENT);
		let dt = new Date(2024, 1, 1);
		chatSession.addChatMessage(new ChatMessage(dt, msgFrom, 'this is an agent message'));

		// 2 test
		let msgFrom2 = new MessageFrom(false, 'user', 'code_user', Role.USER);
		let dt2 = new Date(2024, 1, 1);
		chatSession.addChatMessage(new ChatMessage(dt2, msgFrom2, 'this is a user message'));
		console.log(chatSession.getChatMessages());
	});
</script>

<div class="w-1/2 h-1/2 bg-gray-800 rounded-md relative p-1">
	<div class="m-1 text-white">Chat</div>
	<div>
		{#each chatSession?.getChatMessages() || [] as m}
			{#if m != null}
				<ChatMessageDisplay chatMessage={m} />
			{/if}
		{/each}
	</div>
	<form class="bottom-0 w-full absolute">
		<Textarea id="editor" rows="5" placeholder="Write a comment">
			<Toolbar slot="footer" embedded>
				<ToolbarButton name="send" slot="end"
					><PaperPlaneOutline class="w-6 h-6 rotate-45" /></ToolbarButton
				>
			</Toolbar>
		</Textarea>
	</form>
</div>
