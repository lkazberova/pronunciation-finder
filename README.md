# pronunciation-finder
An application for getting audio files with pronunciation from Oxford Learner's Dictionaries

## Installation

```bash
npm install -g pronunciation-finder
```
If you don't have npm please install it https://docs.npmjs.com/getting-started/installing-node#1-install-nodejs--npm
## Usage

```bash
pronunciation-finder car apple window --path /home/user/downloads
```
OR if you have a list with words
```bash
pronunciation-finder $(cat words.txt) --path /home/user/downloads
```

## Output

Files with name like `everything | ˈevriθɪŋ |.mp3`

## Update

```bash
npm update -g pronunciation-finder
```

## Uninstall

```bash
npm uninstall -g pronunciation-finder
```