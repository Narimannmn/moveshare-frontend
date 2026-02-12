# 🎨 Figma MCP Integration

## What is Figma MCP?

Model Context Protocol (MCP) server that allows Claude Code to interact with Figma designs, fetch design tokens, and retrieve design context directly from Figma files.

## Setup

### Prerequisites

1. **Figma MCP Server Running** - The Figma MCP server must be running locally on port 3845
2. **VS Code Settings** - MCP configuration is in `.vscode/settings.json`

### Configuration

The Figma MCP server is configured in `.vscode/settings.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "http",
      "args": ["http://127.0.0.1:3845/mcp"]
    }
  }
}
```

### Verifying Connection

1. **Open Claude Code chat**: `Ctrl+Shift+I` (Windows/Linux) or `⌃⌘I` (Mac)
2. **Switch to Agent mode** in the chat toolbar
3. **Type** `#get_design_context` to confirm Figma MCP tools are available
4. **Check available tools**: The Figma MCP should provide design-related tools

## Available Tools (Typical)

The Figma MCP server typically provides:

- `get_design_context` - Fetch design context from Figma files
- `get_design_tokens` - Extract design tokens (colors, typography, spacing)
- `get_component_details` - Get details about Figma components
- `search_designs` - Search for designs in Figma

## Usage in Development

### Getting Design Tokens

When implementing UI components, you can ask Claude Code to:

```
"Get the design tokens from Figma for the Button component"
"Fetch color palette from our Figma design system"
"What are the spacing values defined in Figma?"
```

### Implementing from Designs

```
"Implement this component based on the Figma design [link]"
"Generate CSS variables from our Figma design tokens"
"Create React component matching the Figma specs"
```

## Integration with stp-ui-kit

**Important**: Even with Figma MCP, you MUST:

1. ✅ Use `stp-ui-kit` components (not create from scratch)
2. ✅ Use `stp-ui-kit` design tokens (not hardcode Figma values)
3. ✅ Reference Figma for design validation and missing tokens

### Workflow

1. **Check Figma** → Understand the design intent
2. **Check stp-ui-kit** → Use existing components and tokens
3. **Compare** → Ensure stp-ui-kit matches Figma specs
4. **If missing** → Request update to stp-ui-kit or add new tokens

## Troubleshooting

### MCP Server Not Available

If `#get_design_context` doesn't work:

1. **Check server is running**: Visit http://127.0.0.1:3845/mcp in browser
2. **Restart VS Code** after adding MCP configuration
3. **Check VS Code settings**: Ensure `.vscode/settings.json` is correct
4. **Check logs**: VS Code Output panel → "MCP" channel

### Server Connection Error

```bash
# Check if port 3845 is in use
netstat -ano | findstr :3845

# Restart Figma MCP server
# (Follow Figma MCP server documentation)
```

## Security Note

The MCP server runs on `localhost:3845`. Ensure:
- Only trusted Figma MCP servers are configured
- Port 3845 is not exposed to external networks
- Figma API tokens (if used) are kept secure

## Documentation

For more information about Figma MCP:
- Check Figma MCP server documentation
- See MCP protocol docs: https://modelcontextprotocol.io
