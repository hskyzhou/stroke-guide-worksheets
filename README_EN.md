# Stroke Guide Worksheets

[简体中文](README.md) | **English**

[Source repository](https://github.com/hskyzhou/stroke-guide-worksheets) · [Report an issue](https://github.com/hskyzhou/stroke-guide-worksheets/issues/new/choose) · [Support the project](https://ko-fi.com/hskylab)

A static, browser based worksheet generator for Chinese characters, English letters, and numbers. It supports stroke order, start and end markers, direction arrows, progressive stroke practice, focused stroke exercises, pinyin, tracing, curriculum presets, and A4 printing.

## Features

- Chinese worksheets with Tian Zi, Mi Zi, and square grids, stroke order, and progressive writing practice
- English worksheets for uppercase and lowercase A–Z, four line handwriting guides, one letter per row, and one letter per page
- Number worksheets for 0–9 with formation order and direction cues
- Curriculum presets for writable characters from Grades 1–6 of the unified Chinese language curriculum
- Local preferences stored in browser `localStorage`, with no account required
- A4 pagination with browser printing and PDF export

## Run Locally

No build step is required. Start any static file server in the repository directory:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

Chinese stroke data is stored with the project and loaded on demand. Run the project through a static file server, because browsers may restrict local JSON requests when `index.html` is opened directly.

## Privacy and Network Requests

Worksheet content and custom settings are processed in the browser. Settings are stored only in the current browser's `localStorage`. The project itself has no accounts, analytics, or server side content storage.

The Patrick Hand typeface, `pinyin-pro`, and Chinese stroke data are stored locally with the project. Initial page loading does not depend on Google Fonts, jsDelivr, or an external stroke data service. External sites are contacted only after a user follows links such as Ko-fi or upstream source links.

Deployers who add analytics, accounts, advertising, or server side features should update the privacy notice accordingly.

## Data and Writing Conventions

Letter and number formation paths are maintained in this project as simplified practice models. Writing forms may vary between regions, curricula, and teachers. When proposing a change, please cite the convention or teaching source in the Issue or Pull Request.

Curriculum presets were compiled from the writable character tables in the unified Chinese language textbooks. Textbook revisions may change lesson order and character lists, so users should follow the edition they actually use. See [`DATA_SOURCES.md`](DATA_SOURCES.md) for scope and licensing boundaries.

Chinese stroke paths use the locally stored [Hanzi Writer Data](https://github.com/chanind/hanzi-writer-data) 2.0.1 dataset, and pinyin conversion uses [pinyin-pro](https://github.com/zh-lx/pinyin-pro). See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for third party licensing information.

## Contributing

Corrections to character lists, well sourced writing order improvements, printing bug reports, and code contributions are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before contributing. See [`SECURITY.md`](SECURITY.md) for reporting security issues.

Please use [GitHub Issues](https://github.com/hskyzhou/stroke-guide-worksheets/issues/new/choose) for bug reports and suggestions, or email [xezw211@gmail.com](mailto:xezw211@gmail.com). Please do not include students' names, schools, contact details, or other personal information.

## License

Unless marked otherwise, original program code in this repository is licensed under the [GNU Affero General Public License v3.0](LICENSE).

AGPL-3.0 permits use, modification, redistribution, and commercial use. If a modified version is made available to users over a network, those users must be offered the corresponding source code as required by the license.

The project name, visual identity, third party fonts, stroke data, and textbook related material are not automatically licensed under AGPL-3.0. See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) and [`DATA_SOURCES.md`](DATA_SOURCES.md).

## Support the Project

The core worksheet generator is intended to remain free. You can support hosting, curriculum list maintenance, writing order review, and continued development through [Ko-fi](https://ko-fi.com/hskylab).
