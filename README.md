# pronunciation-finder
An application for getting audio files with pronunciation from
* [Oxford Learner's Dictionaries](https://www.oxfordlearnersdictionaries.com/definition/english/)
* [Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary)

## Installation

### MacOS, Linux
```bash
npm install -g pronunciation-finder
```
If you don't have npm please install it https://docs.npmjs.com/getting-started/installing-node#1-install-nodejs--npm

## Usage

```bash
pronunciation-finder car apple window
```
OR if you have a file with words
```bash
pronunciation-finder $(cat words.txt)
```

### Options
```text
$ pronunciation-finder --help

  Usage: pronunciation-finder [options] <words>

  An application for getting transcription and audio from Oxford Advanced Learner’s Dictionary, Cambridge Dictionary

  Options:

    -v, --version               output the version number
    -p, --path [value]          Path for downloaded files (default: ./)
    -d, --dictionary [value]    Dictionary [oxford, cambridge] (default: cambridge)
    -g, --gap [value]           Add gap [value] sec to the end of file (default: 0)
        --play                  Autoplay files after downloading (default: false)
    -h, --help                  output usage information


```

## Output

Files with a name like `everything | ˈevriθɪŋ |.mp3`

## Update

```bash
npm update -g pronunciation-finder
```
Please verify that `pronunciation-finder -v` returns `0.7.0`, in some cases you have to uninstall and install for getting latest version

## Uninstall

```bash
npm uninstall -g pronunciation-finder
```
