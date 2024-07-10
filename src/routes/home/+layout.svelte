<script>
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
</script>

<Sidebar>
	<SidebarWrapper>
		<SidebarGroup>
			<SidebarItem label="Dashboard"></SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
<slot />
