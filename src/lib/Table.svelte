<script lang="ts">
    export let names: { id: string, name: string, email: string }[];
    let toggleUpdate = false;
    let userToUpdate: { id: string, name: string, email: string } | null = null;

    function showUpdateForm(user: { id: string, name: string, email: string }) {
        userToUpdate = user;
        toggleUpdate = true;
    }

    function hideUpdateForm() {
        userToUpdate = null;
        toggleUpdate = false;
    }

    async function updateUser(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const response = await fetch('/profiles?/update', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
			window.location.reload();
            const updatedUser = await response.json();
            names = names.map(user => user.id === updatedUser.id ? updatedUser : user);
            hideUpdateForm();
        } else {
            console.error('Failed to update user'); 
        }
    }
</script>

<div
    class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
>
    <div class="flex items-center justify-between mb-4">
        <div class="space-y-1">
            <h2 class="text-xl font-semibold">List of Users</h2>
            <p class="text-sm text-gray-500">
                Fetched {names.length} users
            </p>
        </div>
    </div>
    <div class="divide-y divide-gray-900/5">
        {#each names as user (user.id)}
            <div class="flex items-center justify-between py-3">
                <div class="flex items-center space-x-4">
                    <div class="flex">
                        <p class="font-medium pt-1 leading-none">{user.name}</p>
                        <p class="font-medium pl-5 text-gray-500 pt-0">{user.email}</p>
                    </div>
                </div>
                <button on:click={() => showUpdateForm(user)}>UPDATE</button>
                <form method="POST" action="/profiles?/delete">
                    <input type="hidden" name="id" id="id" value={user.id}>
                    <button type="submit">
                        <img class="w-4 float-right" src="./trash-can.svg" alt="delete"/>
                    </button>
                </form>
            </div>
        {/each}
    </div>
</div>

{#if toggleUpdate && userToUpdate}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold mb-4">Update User</h3>
            <form on:submit|preventDefault={updateUser}>
                <input type="hidden" name="id" value={userToUpdate.id}>
                <div class="mb-4">
                    <label class="block text-gray-700">Name</label>
                    <input type="text" name="name" value={userToUpdate.name} class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700">Email</label>
                    <input type="email" name="email" value={userToUpdate.email} class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="flex justify-end">
                    <button type="button" on:click={hideUpdateForm} class="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Update</button>
                </div>
            </form>
        </div>
    </div>
{/if}
