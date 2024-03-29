#! /bin/bash
name="nyanya-process-priority"
port=16111
DIR=$(cd $(dirname $0) && pwd)
version="1.0.2"

allowMethods=("push delete build saki-ui")

push() {
  git tag v$version
  git push origin v$version
}

delete() {
  git tag -d v$version
  git push origin :refs/tags/v$version
}

build() {
  saki-ui
  yarn el:icon
  
  mkdir -p ./el-build/packages
  cp -r ./el-build/*.AppImage ./el-build/packages/
  cp -r ./el-build/*.deb ./el-build/packages/
  cp -r ./el-build/*.exe ./el-build/packages/

  rm -rf ./el-build/linux-unpacked
  rm -rf ./el-build/*.AppImage
  rm -rf ./el-build/*.deb
  rm -rf ./el-build/*.exe

  yarn el:build-win-x64

  mv "./el-build/Nyanya Process Priority Setup "$version".exe" \
  ./el-build/$name-setup-v$version-x64.exe
  rm -rf ./el-build/*.exe.blockmap
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
