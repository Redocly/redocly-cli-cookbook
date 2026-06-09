export default function plugin() {
  return {
    id: "security-plugin",
    decorators: {
      oas3: {
        'apply-root-security': ({ pathSecurityFile } = {}) => {
          return {
            Root: {
              leave(root, { config }) {
                const doc = resolvePath(pathSecurityFile, config);
                
                if (doc?.security !== undefined && root.security === undefined){
                  root.security = doc?.security;
                }

                if (doc.components?.securitySchemes !== undefined) {
                  if (!root.components) {
                    root.components = {};
                  }
                  root.components.securitySchemes = {
                    ...root.components.securitySchemes,
                    ...doc.components.securitySchemes,
                  };
                }
              },
            },
          };
        },
      },
    },
  }
}
