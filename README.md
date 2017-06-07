# Telegram-Core-Docs-Generator

Generated content is available at https://github.com/wfjsw/telegram-core-docs

## Usage

Download the latest TL-Schema from [here](https://github.com/telegramdesktop/tdesktop/blob/dev/Telegram/Resources/scheme.tl), remove everything before `///////// Main application API`, rename the file to `schema.tl`.

After `npm install`, run `node make-skeleton` to init non-existence item in `./sources`

`node build-schema` to generate `./generated/schema.json`, `./generated/schema.md` and `./generated/schema.tl`

`node generate` to produce the rest parts of the doc.