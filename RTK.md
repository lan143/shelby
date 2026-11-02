# RTK.md

`rtk` is a Homebrew CLI proxy (installed at `/opt/homebrew/bin/rtk`) that condenses command output to save tokens. Treat its output as the complete result unless it is empty/garbled or contradicts the exit code.

## Project command mapping

| Task | Example |
|---|---|
| Repository overview | `rtk ls`; `rtk tree` |
| Find source files | `rtk find src -name '*.cpp'` |
| Read a file | `rtk read src/main.cpp` |
| Search sources | `rtk grep -n "RELAY_GATE" src` |
| Git status / diff / log | `rtk git status`; `rtk git diff`; `rtk git log --oneline -10` |
| Build errors and warnings only | `rtk err pio run -e kc868a2` |
| One-line build verdict | `rtk summary pio run -e kc868a2` |
| Full build log when needed | `pio run -e kc868a2` |
| Line counts | `rtk wc -l src/**` |
| Token savings | `rtk gain` |

## Rules

- Batch related commands in one call with `;` (for example `rtk git status; rtk git diff`).
- Do not pipe `rtk` output through `head`/`cat`; the proxy already controls size.
- If output is empty when clearly expected, garbled, or contradicts the exit code, re-run the command as `rtk proxy <cmd>`.
- Run the streaming serial monitor unproxied: `pio device monitor` (115200 baud).
- `rtk` has no PlatformIO/SPIFFS awareness. For `-t upload` and `-t uploadfs`, sanity-check for `SUCCESS` / `Hard resetting` markers with `rtk err` or `rtk proxy`.
- Never `rtk read` binary or vendor assets (`data/*.min.js`, `.pio/` build artifacts).
- Do not use `rtk` to hide a failing command; check the exit code and the error summary together.
