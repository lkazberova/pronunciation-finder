# oxford-dictionary-finder
An application for getting audio files with pronunciation from Oxford Learner's Dictionaries

##Installation

```bash
npm install
```

##Usage

```bash
node ./index.js car apple window --path /home/user/downloads
```
OR if you have a list with words
```bash
node ./index.js $(cat words.txt) --path /home/user/downloads
```

##Output

Files with name like `everything | ˈevriθɪŋ |.mp3`