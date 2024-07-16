<script lang="ts">
	import { Card, Textarea } from 'flowbite-svelte';
	import Draggable from './Draggable.svelte';
	import { Editor, Viewer } from 'bytemd';
	import gfm from '@bytemd/plugin-gfm';
	import DOMPurify from 'isomorphic-dompurify';
	import { Carta } from 'carta-md';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});

	let renderInHtml = '';
	let timeOut: NodeJS.Timeout;
	let defaultTimeout = 300;
	export let userInput = '';

	function onInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		let text = target.value;

		timeOut = setTimeout(async () => {
			await handleFinishedTyping(userInput);
		}, defaultTimeout);
	}

	async function handleFinishedTyping(input: string) {
		renderInHtml = await carta.render(input);
	}

	let value: any;
	const plugins = [
		gfm()
		// Add more plugins here
	];

	function handleChange(e: CustomEvent<any>) {
		value = e.detail.value;
	}
</script>

<div class="bg-gray-800 rounded-md p-2 w-1/4 h-1/4">
	<div class="mb-1 w-full h-full rounded-sm text-white p-1">
		{#if renderInHtml}
			<p>
				{@html renderInHtml}
			</p>
		{/if}
	</div>
	<div>
		<Textarea rows="5" placeholder="write a note" bind:value={userInput} on:input={onInput} />
	</div>
</div>
