# Eponym

Eponym is a node script capable of generating a list of words that are currently available NPM packages. The list of words is pulled from the wonderful [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary).

> **eponym**: _noun_, a person after who a discovery, invention or place is named

## Getting started

```
# Grab 20 random words from the dictionary that are 6 characters or
# less and return the ones that are available as package names on NPM

npx eponym --limit=20 --max-word-length=6
```

An HTTP request has to be made for each word, so larger data sets can be time consuming. You can skip the wait by using the pre-compiled lists in the `out/` directory.

## Options

| Option                        | Default          | Description                                                                                                                                                      |
| ----------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-l, --limit <limit>`         | -                | The number of dictionary words to run through NPM. The number of results may be less than this because any names which are already taken on NPM are not returned |
| `--full-dictionary`           | false            | Process every word in the dictionary (**Warning**: This is very, _very_ slow)                                                                                    |
| `-b, --batch-size <size>`     | 20               | The number of HTTP requests allowed to happen at once                                                                                                            |
| `-m, --max-word-length <max>` | ∞                | Limit the results to words of a certain maximum length                                                                                                           |
| `-w, --write <filePath>`      | print to console | Passing this option outputs the results to the specified file instead of printing them to the console                                                            |
| `-p, --predictable`           | false            | Do not randomly choose words from the dictionary, instead start from the beginning                                                                               |
