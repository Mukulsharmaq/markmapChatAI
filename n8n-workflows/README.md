# n8n workflows

Importable n8n workflow definitions.

## Workflows

| File | Workflow name | What it does |
|---|---|---|
| `test-from-claude.json` | **test from claude** | Minimal test workflow: a Manual Trigger connected to an Edit Fields (Set) node that outputs `message`, `createdBy`, and `status` fields. |

## How to import into n8n

1. Open your n8n instance.
2. Go to **Workflows** and click **Add workflow** (or open the workflow menu **⋯**).
3. Choose **Import from File…** and select the `.json` file from this folder.
   - Alternatively, open a blank workflow canvas and paste the JSON contents directly (Ctrl/Cmd+V).
4. Save the workflow, then click **Execute workflow** to test it.

The test workflow has no credentials and no external calls, so it runs anywhere as-is.
