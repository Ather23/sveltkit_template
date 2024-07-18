<script lang="ts">
	import type { IChatMessage } from '$lib/ai/chat/models/chat';
	import { code } from '@cartamd/plugin-code';
	import { Carta, Markdown } from 'carta-md';
	import DOMPurify from 'isomorphic-dompurify';
	import '@cartamd/plugin-code/default.css';
	import { onMount } from 'svelte';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
	export let chatMessage: IChatMessage;
</script>

<div>
	{#if chatMessage && chatMessage.getMessageFrom().getIsAgent()}
		<div class="bg-gray-900 rounded-md mb-2 item-center">
			{#key chatMessage}
				{#if chatMessage && chatMessage.getMessage()}
					<div class="p-1 text-lime-400">
						<Markdown {carta} value={chatMessage.getMessage()} />
					</div>
				{/if}
			{/key}
		</div>
	{:else}
		<div class="text-white bg-gray-900 rounded-md mb-2 item-center">
			{#if chatMessage && chatMessage.getMessage()}
				{#key chatMessage}
					<div class="p-1"><Markdown {carta} value={chatMessage.getMessage()} /></div>
				{/key}
			{/if}
		</div>
	{/if}
</div>
