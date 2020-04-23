# Eponym

Eponym is a node script capable of generating a list of words that are currently available NPM packages. The list of words is pulled from a modified version of the wonderful [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary).

> **eponym**: _noun_, a person after who a discovery, invention or place is named

## Getting started

```
# Grab 20 random words from the dictionary that are 6 characters or
# less and return the ones that are available as package names on NPM

npx eponym --limit=20 --max-word-length=6
```

An HTTP request has to be made for each word, so larger data sets can be time consuming. You can skip the wait by using the pre-compiled lists in the `out/` directory.

If you're in the middle of a long running process though, you can terminate it at any time and so long as you've passed the `--write` flag, the names processed so far will still be written to the file.

## Options

### `-l, --limit <limit>`

The number of dictionary words to run through NPM. The number of results returned will likely be less than this because any names which are already taken on NPM are not returned.

This option is required unless `--full-dictionary` is passed.

### `--full-dictionary`

Process every word in the dictionary (**Warning**: This is very, _very_ slow).

**Default**: `false`

### `-b, --batch-size <size>`

The number of HTTP requests allowed to happen at once.

**Default**: `20`

### `-m, --max-word-length <max>`

Limit the results to words of a certain maximum length.

**Default**: No limit

### `-w, --write <filePath>`

Passing this option outputs the results to the specified file instead of printing them to the console.

**Default**: Write to console

### `-p, --predictable`

Do not randomly choose words from the dictionary, instead start from the beginning.

**Default**: `false`
