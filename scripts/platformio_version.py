"""Inject a git-derived firmware version into the PlatformIO build.

The same algorithm is mirrored in frontend/vite.config.ts so the firmware and
UI stamps are directly comparable. Run standalone from the repo root with
`python3 scripts/platformio_version.py` to print the resolved version.
"""

import os
import subprocess


def _git(args, cwd):
    try:
        return subprocess.check_output(
            ["git", *args],
            cwd=cwd,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except (OSError, subprocess.CalledProcessError):
        return ""


def resolve_version(project_root):
    short_hash = _git(["rev-parse", "--short", "HEAD"], project_root)
    if not short_hash:
        return "unknown"

    dirty = "-dirty" if _git(["status", "--porcelain"], project_root) else ""
    tag = _git(["describe", "--tags", "--abbrev=0"], project_root)

    return "{}-{}{}".format(tag, short_hash, dirty) if tag else "{}{}".format(short_hash, dirty)


try:
    Import("env")  # noqa: F821 - provided by SCons/PlatformIO
except NameError:
    env = None

if "env" not in globals() or env is None:
    print(resolve_version(os.getcwd()))
else:
    version = resolve_version(env.Dir("#").abspath)
    env.Append(CPPDEFINES=[("SHELBY_FW_VERSION", '\\"%s\\"' % version)])
    print("Shelby firmware version: %s" % version)
