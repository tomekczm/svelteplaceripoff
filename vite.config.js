import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), {
		name: 'development-server',
		async configureServer(instance) {
			console.log("hi ongies!!")
			const index = await import('./server/main')
			index.main(instance)
		}
	}]
};

export default config;
