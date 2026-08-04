import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        ecosystem: 'ecosystem.html',
        creator: 'creator-hub.html',
        story: 'story-hub.html',
        game: 'game-hub.html',
        marketplace: 'marketplace.html',
        communities: 'communities.html',
        tradefusion: 'tradefusion.html',
        roadmap: 'roadmap.html',
        vision: 'vision.html',
        about: 'about.html',
        contact: 'contact.html',
      },
    },
  },
});
