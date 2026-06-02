export default function spreadSecurityToOperations({ pathSecurityFile } = {}) {
  return {
    Operation: {
      leave(operation, { config }) {
        const absolutePath = path.isAbsolute(pathSecurityFile)
          ? pathSecurityFile
          : path.resolve(path.dirname(config.configPath), pathSecurityFile);
        const doc = yaml.load(fs.readFileSync(absolutePath, 'utf8'));
        
        if (doc?.security === undefined || operation.security !== undefined) return;
        operation.security = doc?.security;
      },
    },
  };
};
