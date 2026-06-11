const applyRootSecurity = ({ pathSecurityFile } = {}) => {
  return {
    Root: {
      leave(root, { config, specVersion }) {
        const doc = resolvePath(pathSecurityFile, config);

        validateOpenapiSpecification(pathSecurityFile, doc, specVersion);

        if (specVersion === 'oas2') {
          mergeSecurityRequirements(root, doc);
          if (doc?.securityDefinitions !== undefined) {
            root.securityDefinitions = { ...root.securityDefinitions, ...doc.securityDefinitions };
          }
        } else {
          mergeSecurityRequirements(root, doc);
          mergeSecuritySchemes(root, doc);
        }
      },
    },
  };
};

function resolvePath(pathSecurityFile, config) {
  const base = config.configPath ? path.dirname(config.configPath) : process.cwd();
  const absolutePath = path.isAbsolute(pathSecurityFile) ? pathSecurityFile : path.resolve(base, pathSecurityFile);
  return yaml.load(fs.readFileSync(absolutePath, 'utf8'));
};

function validateOpenapiSpecification(pathSecurityFile, doc, specVersion) {
  if (specVersion === 'oas2' && doc?.components?.securitySchemes !== undefined && doc?.securityDefinitions === undefined) {
    throw new Error(
      `apply-root-security: "${pathSecurityFile}" uses OAS3 components.securitySchemes but the target spec is OAS2. Use securityDefinitions instead.`
    );
  }
  if (specVersion !== 'oas2' && doc?.securityDefinitions !== undefined && doc?.components?.securitySchemes === undefined) {
    throw new Error(
      `apply-root-security: "${pathSecurityFile}" uses OAS2 securityDefinitions but the target spec is ${specVersion}. Use components.securitySchemes instead.`
    );
  }
};

function mergeSecurityRequirements(root, doc) {
  if (!Array.isArray(doc?.security)) return;
  root.security = [...(root.security || []), ...doc.security];
};

function mergeSecuritySchemes(root, doc) {
  if (doc?.components?.securitySchemes === undefined) return;
  if (!root.components) root.components = {};
  root.components.securitySchemes = {
    ...root.components.securitySchemes,
    ...doc.components.securitySchemes,
  };
};
