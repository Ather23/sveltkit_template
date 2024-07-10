<script lang="ts">
	import Draggable from '$lib/components/Draggable.svelte';
	import ChatWindow from '$lib/components/chat/ChatWindow.svelte';
</script>

<div class="w-screen h-screen">
	<Draggable>
		<ChatWindow />
	</Draggable>
</div>
