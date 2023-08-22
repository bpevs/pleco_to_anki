# Pleco to Anki

Converts [Pleco](https://www.pleco.com) .xml export into an [Anki](http://ankiweb.net)-importable .tsv file

## Usage

Requires [deno](https://deno.com). I'll work on making a package to use instead.

```
deno run --allow-read --allow-write main.ts [-infile] [-outdir]
```

Example:
```
deno run --allow-read --allow-write main.ts ./flash-2308211824.xml ./results
```
