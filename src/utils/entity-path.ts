export function resolveEntityData(filePath: string, workspacePath: string, entity: 'components' | 'helpers') {
  const relativePath = filePath.split(workspacePath)[1];
  const bundleMatch = /\/lib\/(.*?)-bundle\/addon/.exec(relativePath);
  const isBundleEntity = bundleMatch?.length === 2;
  const bundleName = bundleMatch?.[1];

  if (!relativePath.split('/').some((part) => part === entity)) {
    throw new Error(`Folder is not a ${entity} folder`);
  }

  let entityRelativePath = relativePath.split(`/${entity}`)[1];
  entityRelativePath = isBundleEntity && entityRelativePath.startsWith(`/${bundleName}-bundle`) ? entityRelativePath.split(`/${bundleName}-bundle`)[1] : entityRelativePath;
  entityRelativePath = entityRelativePath.startsWith('/') ? entityRelativePath.substring(1) : entityRelativePath;

  return {
    relativePath: entityRelativePath,
    isBundleEntity,
    bundleName
  };
}
