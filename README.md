# Wordage

Wordage is a node script capable of generating a list of words that are currently available NPM packages.

The list of words is pulled from a modified version of the wonderful [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary) and from the awesome [datamuse API](http://www.datamuse.com/api).

## Getting started

```bash
# Find 50 random words that relate to the word "dog" and that are
# available as package names on NPM

npx wordage means dog
```

```bash
# Find 20 random words from the dictionary that are 6 characters or
# less and that are available as package names on NPM

npx wordage search --limit=20 --max-word-length=6
```

```bash
# Find 50 random words that relate to the word "cat"

npx wordage means cat --filter=none
```

An HTTP request has to be made for each word, so larger data sets can be time consuming. You can skip the wait by using the pre-compiled lists in the `out/` directory.

If you're in the middle of a long running process though, you can terminate it at any time and so long as you've passed the `--write` flag, the names processed so far will still be written to the file.

## Commands

Wordage currently supports two commands. Both commands have the same list of options.

### `wordage search`

Search for words from a dictionary.

### `wordage means <subject>`

Search for words with a similar meaning to another word.

### Options

| Option                  | Default         | Description                                                                                       |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| `--limit, -l`           | 50              | The number of results to generate                                                                 |
| `--batch-size, -b`      | 20              | The number of HTTP requests to have out at once                                                   |
| `--max-word-length, -m` | -               | Limit results to words of a certain length                                                        |
| `--write, -w`           | Print to stdout | Instead of printing to to the console, write results to a file                                    |
| `--predictable, -p`     | false           | Instead of searching with some randomness, give repeatable results                                |
| `--filter, -f`          | npm             | Filter the results to only names available on a particular platform. Options are `npm` or `none`. |
