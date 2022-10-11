#! /bin/bash
name="meow-sticky-note-client"
port=16111
DIR=$(cd $(dirname $0) && pwd)
allowMethods=("build saki-ui")

build() {
  saki-ui
  yarn el:icon
  rm -rf ./el-build/linux-unpacked
  rm -rf ./el-build/*.AppImage
  yarn el:build-win
  # rm -rf ./build
  # sudo apt install -y ./el-build/meow-sticky-note_1.0.1_amd64.deb
  # AppImage deb
  # run
}

saki-ui() {
  wget https://saki-ui.aiiko.club/saki-ui.tgz
  tar zxvf ./saki-ui.tgz -C ./public
  rm -rf ./saki-ui*
}

main() {
  if echo "${allowMethods[@]}" | grep -wq "$1"; then
    "$1"
  else
    echo "Invalid command: $1"
  fi
}

main "$1"