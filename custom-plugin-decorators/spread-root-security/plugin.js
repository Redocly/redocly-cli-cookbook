export default function plugin() {
  return {
    id: "security-plugin",
    decorators: {
      oas3: {
        "spread-root-security": ({ pathSecurityFile }) => {
          return {
            Root: {
              leave(root, { config }) {
                const absolutePath = path.isAbsolute(pathSecurityFile)
                  ? pathSecurityFile
                  : path.resolve(path.dirname(config.configPath), pathSecurityFile);
                const doc = yaml.load(fs.readFileSync(absolutePath, 'utf8'));
                
                if (doc?.security === undefined || root.security !== undefined) return;
                root.security = doc?.security;
              },
            },
          };
        },
      },
    },
  }
}
