<script context="module">
	/** * @type {import('@sveltejs/kit').Load} */
	export async function load({ session }) {
    return { 
      props: { user: session.user || false } 
    }
  }
</script>

<script>
  export let user;
  console.log('user', user)
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if !user}
  <a title="Discord OAuth2" href="api/auth">Authenticate via Discord</a>
{:else}
  <img alt="{user.userName}#{user.discriminator} avatar" src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png">
  <h1>{user.username}#{user.discriminator}</h1>
  <a title="Sign out" href="api/signout">Sign Out</a>
{/if}