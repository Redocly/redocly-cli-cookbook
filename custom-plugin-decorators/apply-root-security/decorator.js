export const applyRootSecurity = ({ pathSecurityFile } = {}) => {
  return {
    Root: {
      leave(root, { config }) {
        const doc = resolvePath(pathSecurityFile, config);

        mergeSecurityRequirements(root, doc);
        mergeSecuritySchemes(root, doc);
      },
    },
  };
};

function resolvePath(pathSecurityFile, config) {
  const base = config.configPath ? path.dirname(config.configPath) : process.cwd();
  const absolutePath = path.isAbsolute(pathSecurityFile) ? pathSecurityFile : path.resolve(base, pathSecurityFile);
  return yaml.load(fs.readFileSync(absolutePath, 'utf8'));
};

function mergeSecurityRequirements(target, source){
  if (!Array.isArray(source?.security) 
    || JSON.stringify(target.security) === JSON.stringify(source?.security)) return;
  target.security = [...(target.security || []), ...source.security]; 
};

function mergeSecuritySchemes(target, source) {
  if (source?.components?.securitySchemes === undefined) return;
  if (!target.components) target.components = {};
  target.components.securitySchemes = {
    ...target.components.securitySchemes,
    ...source.components.securitySchemes,
  };
};
