# qtmut

Simple Tmux session manager powered by Deno.

## Usage

```sh
Usage: qtmut -s <session-name> -c <directory>

Description:

  Start new session

Options:

  -h, --help                             - Show this help.
  -s, --session-name     <session-name>  - Session name
  -c, --start-directory  <directory>     - Start directory
```

```yaml
# <directory>/.qtmut.yaml
active:
  window: main
  pane: 1

windows:
  - name: main
    layout: even-horizontal
    panes:
      - command:
      - command: ["vim", "Enter"]
  - layout: tile
    panes:
      - command: ["bundle exec rails s", "Enter"]
      - command: ["tail -f logs/development.log", "Enter"]
```

## Installation

### Zinit

```sh
# ~/.zshrc
zinit wait lucid light-mode as'program' for 'Ryooooooga/qtmut'
```

## Related projects

- [Tmuxinator](https://github.com/tmuxinator/tmuxinator)
- [ptmux](https://github.com/pocke/ptmux)
