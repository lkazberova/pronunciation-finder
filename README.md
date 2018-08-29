# pronunciation-finder
An application for getting audio files with pronunciation from Oxford Learner's Dictionaries

## Installation

```bash
npm install -g pronunciation-finder
```

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
