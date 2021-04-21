# LiveAlert Webextension

> LiveAlert is a Webextension for streamers, compatible with chromium-browsers and firefox.

> It's main purpose is building engagement with your community, and notify when you are coming live on any streaming platform or channel.

LiveAlert is actually pre-configured as a fully working extension called **Sardalert**. If that's what you are looking for, see [Using the pre-configured Sardalert](#using-the-pre-configured-sardalert)

If you want to build your extension based on this system, see [Hosting your own](#hosting-your-own).

## Features

- Can notify ANYTHING ! (Really..)
- Displays the next scheduled stream time in the badge.
- Displays a countdown 5 minutes before the stream starts in the badge.
- You can edit the skin (icons, badges, texts, etc..) AT RUNTIME ! (from the server)
- Compatible with almost any frontend framework with NO CONFIGURATION !
- Typescript friendly, but not mandatory.
- You can add a proxy for specific urls to unlock websites, or redirect your users to other machines.
- You can superset youtube audio with your own hosted HQ lossless flac !

## Using the pre-configured Sardalert

- Either download it on [chrome](https://chrome.google.com/webstore/detail/sardalert/elnpfaoipdfdhikjacbpcfhpnehjjaii) or [firefox](https://addons.mozilla.org/en-US/firefox/addon/sardalert/) official stores.

OR

- Clone the project and cd in it.
- Install dependencies: `npm i`
- Build the project: `npm run build`
- Sardalert should be in `dist` folder, add it as unpacked extension in your favorite browser.

If you have any issue with this process, please, consider opening a [Github Issue](https://github.com/neolectron/livealert-webextension/issues/new).

## Hosting your own

LiveAlert use Parcel 2 to build itself as a webextension.

You will find an already configured extension in `src/manifest.json` and `src/popup/` you can just edit it, or remove it completly.

### Configuration

- Change all metadata in `src/manifest.json` (Parcel will use them to build your project in the `dist` folder)
- Set your [LiveAlert server](https://github.com/neolectron/livealert-server) url location in `src/config.js`
- If you plan not to use a specific feature, you can leave it blank, you can toggle any features from the server anyway.

### Designing your interface

Just edit `src/popup/index.html`. That's it.

The Sardalert addon uses React and Tailwind by default to handle the Popup view.

You can **opt-out of React** simply by editing `popup/index.html` and changing `<script src="./index.jsx"></script>` to point to your script.

To **opt-out Tailwind**, it's just a postcss plugin, simply edit `postcssrc.json` to add/remove any plugin you want.
(don't forget to `npm uninstall` / `npm install` accordingly)

You can use almost all frontend framework (or none) out of the box, either with Typescript or plain Javascript.

[See the full list of supported languages and technologies](https://v2.parceljs.org/)

## Contributing

The main purpose of this repository is to continue evolving LiveAlert, making it faster and easier to use. Development of LiveAlert happens in the open on GitHub, and I'm grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving LiveAlert.

## License

Licensed under [MIT](./LICENSE).
