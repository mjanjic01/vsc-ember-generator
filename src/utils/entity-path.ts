export function resolveEntityData(filePath: string, workspacePath: string, entity: 'components' | 'helpers') {
  const relativePath = filePath.split(workspacePath)[1];

  if (!relativePath.split('/').some((part) => part === entity)) {
    throw new Error(`Folder is not a ${entity} folder`);
  }

  let entityRelativePath = relativePath.split(`/${entity}`)[1];
  entityRelativePath = entityRelativePath.startsWith('/') ? entityRelativePath.substring(1) : entityRelativePath;

  return entityRelativePath;
}
