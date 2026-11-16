# Alpine Outfitters demo

A fictional ski equipment store for learning how to add a voice-and-avatar assistant to an existing website. It has product pages, mountain and beginner guides, policy pages and a browser-local demo bag. Prices, policies and products are fictional; checkout takes no payment and forms send no messages.

The companion [Nova website assistant](https://github.com/ChangliangLiu/nova-website-assistant) uses Zoom Voice Agent, Pipecat and Simli. Follow its [complete setup guide](https://github.com/ChangliangLiu/nova-website-assistant/blob/main/docs/INTEGRATION.md) to create provider keys, run both projects locally, and deploy the agent to Pipecat Cloud and the website and widget gateway to Cloudflare.

## Run locally

Install Node.js 22 or newer and clone both repositories as siblings:

```sh
git clone https://github.com/ChangliangLiu/alpine-outfitters-demo.git
git clone https://github.com/ChangliangLiu/nova-website-assistant.git
cd alpine-outfitters-demo
npm run build
npm test
npm run dev
```

Open http://127.0.0.1:4173. The default build loads the assistant at http://127.0.0.1:8000; start it and import the generated feed as described in the assistant guide. The store can also be browsed independently.

## How the integration works

The build inserts one script into each page:

```html
<script src="http://127.0.0.1:8000/widget.js" data-site="alpine" data-label="Ask Nova" defer></script>
```

The script host changes to your Cloudflare Worker in production. No provider secrets or avatar SDK are stored in the website. Product and guide buttons can call `window.AvatarAssistant.ask()` after the script loads.

Edit `src/content.mjs` to change products, guides and policies. `npm run build` creates both static pages and `dist/assistant-content.json` from the same content. Import the feed into the assistant and rebuild its agent and gateway after content changes; the snapshot does not automatically crawl the site.

The build accepts `SITE_ORIGIN`, `ASSISTANT_ORIGIN` and `ASSISTANT_SITE_ID`. Defaults are `http://127.0.0.1:4173`, `http://127.0.0.1:8000` and `alpine`. The site ID is used in both the widget and feed. For deployment, replace the example origins and project name with your own:

```sh
SITE_ORIGIN=https://YOUR-PROJECT.pages.dev ASSISTANT_ORIGIN=https://YOUR-WORKER.workers.dev npm run build
npx wrangler pages deploy dist --project-name YOUR-PROJECT --branch main
```

The assistant guide explains how to create the Pages project, import its production feed, deploy the agent and configure the Worker first. `dist/` contains the deployable static site.

## Content sources and credits

Products, illustrations and policies were authored for this demo. General mountain introductions were checked against the official [Whistler Blackcomb](https://www.whistlerblackcomb.com/), [Palisades Tahoe](https://www.palisadestahoe.com/), [Chamonix](https://en.chamonix.com/) and [Niseko United](https://www.niseko.ne.jp/en/) websites. No live conditions or availability are asserted. General ski safety reading: [NSAA Your Responsibility Code](https://www.nsaa.org/NSAA/Safety/Your_Responsibility_Code.aspx).

Photography: [Robert Katzki on Unsplash](https://unsplash.com/photos/ruWJ1-WHce8), [Patrick Robert Doyle on Unsplash](https://unsplash.com/photos/IvHZn4flNbc). Images are requested from Unsplash's image CDN; Google Fonts supplies DM Sans and Manrope.
