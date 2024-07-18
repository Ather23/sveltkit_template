<script>
	import { Button } from 'flowbite-svelte';
	import Chat from '$lib/components/chat/Chat.svelte';

	let isOpen = false;

	function toggleDiv() {
		isOpen = !isOpen;
	}
</script>

<div class="relative h-screen">
	<div class="fixed bottom-4 right-4">
		<Button on:click={() => toggleDiv()}>Chat</Button>

		{#if isOpen}
			<div class="bg-opacity-0 resize absolute bottom-full right-0 mb-2 w-[80vh] shadow-lg p-4">
				<div class="absolute bottom-0 right-0.5 w-full items-center">
					<Chat />
				</div>
			</div>
		{/if}
	</div>
</div>
