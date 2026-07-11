#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
benchmark_dir=$(dirname "$script_dir")
episodic_repo=$(git -C "$benchmark_dir" rev-parse --show-toplevel)
interrogation_repo=${INTERROGATION_REPO:-"$(dirname "$episodic_repo")/interrogation-unfold"}
output="$benchmark_dir/public/interrogation-local"
vgmstream=${VGMSTREAM:-/tmp/vgmstream/vgmstream-cli}
if [ -n "${UV:-}" ]; then
  uv=$UV
elif command -v uv >/dev/null 2>&1; then
  uv=$(command -v uv)
else
  uv="$HOME/.local/bin/uv"
fi

if [ ! -x "$uv" ]; then
  echo "uv not found at $uv" >&2
  echo "Set UV=/absolute/path/to/uv and retry." >&2
  exit 1
fi

if [ ! -x "$vgmstream" ]; then
  echo "vgmstream-cli not found at $vgmstream" >&2
  echo "Set VGMSTREAM=/absolute/path/to/vgmstream-cli and retry." >&2
  exit 1
fi

mkdir -p "$output"

run_cli() {
  (cd "$interrogation_repo" && "$uv" run --locked interrogation-unfold "$@")
}

recover() {
  source_base=$1
  destination=$2
  rm -rf "$output/$destination"
  run_cli recover-texture \
    "$source_base.texturec" \
    "$source_base.texturesetc" \
    "$output/$destination"
}

run_cli export-tutorial "$output/tutorial.json"
recover generated/extracted/episodes/characters/actor/actor actor
recover generated/extracted/episodes/characters/tutor/tutor tutor
recover generated/extracted/level/level level
recover generated/extracted/episodes/casefiles/episode0/en/pages casefile
recover generated/extracted/level/torture/flashes torture-flashes
recover generated/extracted/level/torture/file_cabinet torture-cabinet
recover generated/extracted/level/subject_panel/avatars avatars

temporary=$(mktemp -d)
trap 'rm -rf "$temporary"' EXIT INT TERM
banks="$interrogation_repo/raw/app/Interrogation.app/Wrapper/Interrogation.app/banks"

dd if="$banks/All Levels.bank" of="$temporary/all-levels.fsb" bs=1 skip=84416 status=none
dd if="$banks/Level episode0.bank" of="$temporary/episode0.fsb" bs=1 skip=4000 status=none
mkdir -p "$output/audio"

extract_audio() {
  bank=$1
  stream=$2
  name=$3
  "$vgmstream" -s "$stream" -o "$temporary/$name.wav" "$bank" >/dev/null
  ffmpeg -hide_banner -loglevel error -y -i "$temporary/$name.wav" \
    -c:a libvorbis -q:a 5 "$output/audio/$name.ogg"
}

extract_audio "$temporary/episode0.fsb" 1 tutorial_music
extract_audio "$temporary/all-levels.fsb" 2 roomnoise
extract_audio "$temporary/all-levels.fsb" 8 casefile_open
extract_audio "$temporary/all-levels.fsb" 4 casefile_close
extract_audio "$temporary/all-levels.fsb" 33 bring_them_in
extract_audio "$temporary/all-levels.fsb" 28 cue_ask_question
extract_audio "$temporary/all-levels.fsb" 38 ask
extract_audio "$temporary/all-levels.fsb" 7 tape_stop
extract_audio "$temporary/all-levels.fsb" 23 tape_start
extract_audio "$temporary/all-levels.fsb" 12 torture_male_1
extract_audio "$temporary/all-levels.fsb" 50 torture_male_2
extract_audio "$temporary/all-levels.fsb" 14 torture_male_3
extract_audio "$temporary/all-levels.fsb" 21 chair_slide
extract_audio "$temporary/all-levels.fsb" 25 door_open

echo "Private tutorial payload built at $output"
