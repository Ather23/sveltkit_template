<script lang="ts">
	import { Card, Textarea } from 'flowbite-svelte';
	import Draggable from './Draggable.svelte';

	import DOMPurify from 'isomorphic-dompurify';
	import { Carta } from 'carta-md';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	export let left = 30;
	export let right = 30;

	let renderInHtml = '';
	let timeOut: NodeJS.Timeout;
	let defaultTimeout = 300;
	export let userInput = '';

	function onInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		let text = target.value;

		// Set a new timeout to call the function after debounceTime
		timeOut = setTimeout(async () => {
			await handleFinishedTyping(userInput);
		}, defaultTimeout);
	}

	// Function to be called when the user has finished typing
	async function handleFinishedTyping(input: string) {
		console.log('User has finished typing:', input);
		// Your logic here
		renderInHtml = await carta.render(input);
	}
</script>

<div class="bg-gray-800 rounded-md p-2 w-full h-full">
	<div class="mb-1">
		<Card>
			<p>
				{@html renderInHtml}
			</p>
		</Card>
	</div>
	<div>
		<Textarea rows="2" placeholder="write a note" bind:value={userInput} on:input={onInput}
		></Textarea>
	</div>
</div>
