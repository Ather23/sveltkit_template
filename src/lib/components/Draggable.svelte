<script lang="ts">
	export let left = 30;
	export let top = 30;
	export let width = '1/2';
	export let height = '1/2';
	let moving = false;

	function stop() {
		moving = false;
	}

	function move(e: MouseEvent) {
		if (!moving) {
			return;
		}
		left += e.movementX;
		top += e.movementY;
	}
	function start() {
		moving = true;
	}
</script>

<svelte:window on:mouseup={stop} on:mousemove={move} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	style="top: {top}px; left: {left}px;"
	class="absolute select-none cursor-move border-black w-{width} h-{height}"
	on:mousedown={start}
>
	<slot></slot>
</div>
