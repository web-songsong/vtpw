import * as fs from 'fs';
import * as vscode from 'vscode';

export const SHADOW_TS_FILE_EXTENSION = '.vtpw.ts';
export const VUE_FILE_EXTENSION = '.vue';

// VS Code plugin helpers

export function mirorCursorAndScrollPosition({ from, to } : {
  from:vscode.TextEditor,
  to?:vscode.TextEditor,
}) {
  if (!to) {
    return;
  }

  to.selection = new vscode.Selection(
    from.selection.anchor,
    from.selection.active,
  );

  to.revealRange(last(from.visibleRanges));
}

export function showFileNotCompatibleWarningMessage() {
  vscode
    .window
    .showWarningMessage(`Works only in ${VUE_FILE_EXTENSION} or ${SHADOW_TS_FILE_EXTENSION} files`);
}

// File system helpers

export function getVueFileLocationFromShadowTsFile(tsFileLocation:string) {
  return `${tsFileLocation
      .replace(SHADOW_TS_FILE_EXTENSION, VUE_FILE_EXTENSION)}`;

}

export function getShadowTsFileLocationFromVueFile(vueFileLocation:string) {
  return `${vueFileLocation.replace(VUE_FILE_EXTENSION, SHADOW_TS_FILE_EXTENSION)}`;
}

export function removeFileIfExists(location:string) {
  fs.stat(location, (err) => {
    if (!err) {
      fs.unlink(location, () => {});
    }
  });
}

export function writeFile(path:string, content:string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

// Formating code helpers

export function commentOutVueComponentTags(vueFile:string) {
  // TODO: improve with regex to be more flexible
  return vueFile
    .replace('<template>', '/*vtpw<template>')
    .replace('</template>', '</template>vtpw*/')
    .replace('<style', '/*vtpw<style')
    .replace('</style>', '</style>vtpw*/')
    .replace('<script lang="ts">', '/*vtpw<script lang="ts">vtpw*/')
    .replace('</script>', '/*vtpw</script>vtpw*/');
}

export function revertCommentingOutOfVueTags(tsFile:string) {
    // TODO: improve with regex to be more flexible
  return tsFile
    .replace('/*vtpw<template>', '<template>')
    .replace('</template>vtpw*/', '</template>')
    .replace('/*vtpw<style', '<style')
    .replace('</style>vtpw*/', '</style>')
    .replace('/*vtpw<script lang="ts">vtpw*/', '<script lang="ts">')
    .replace('/*vtpw</script>vtpw*/', '</script>');
}

// General helpers

export const last = (arr:any[]) => arr[arr.length -1];
