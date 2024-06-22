<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
</script>

<Button>Click me</Button>
<Drawer.Root>
	<Drawer.Trigger>Open</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Button>Submit</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
