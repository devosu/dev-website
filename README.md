# README

Source code for https://osu.dev

## Contributors

| Name        | Email                     | Role              |
|-------------|---------------------------|-------------------|
| Misha Gusev | gusev.2@osu.edu           | Lead Developer    |
| Keming He   | keminghe.career@gmail.com | Software QA       |
| Alex Gulko  | gulko.5[at]osu.edu        | Initial Developer |

Credit: Table made using Tables Generator

> https://www.tablesgenerator.com/markdown_tables#

## Developer Guide

1. Install Hugo

> https://gohugo.io/installation/

```sh
# For Debian (Ubuntu) Linux users:
set -e; sudo apt update; sudo apt upgrade -y; sudo apt install hugo
```

2. Clone the repo and navigate to local dir

```sh
git clone https://github.com/devosu/dev-website.git
cd dev-website

# To clone a specific branch:
git fetch
git checkout remove_branch_name
```

3. To start the Hugo development server:

```sh
hugo server --config=config.toml
```

4. To build the static site:

```sh
set -e; \
if [ -d "build" ]; then rm -Rf build; fi; \
mkdir -p build; \
hugo -d build
```
