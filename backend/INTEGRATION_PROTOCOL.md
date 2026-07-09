# Integration Protocol: Hackathon Continuous Integration Manifesto

To build a high-performance, collision-free codebase during this hackathon, all engineering team members must strictly adhere to the following integration protocol rules.

## The 5-Point Manifesto

### 1. Ultra-Frequent Merges (Every 2-3 Hours)
All feature/bugfix branches must be merged back into the main branch every **2-3 hours**. Keeping branches open for longer leads to severe merge conflicts, configuration drift, and integration hell. Work in small, incremental chunks and merge immediately upon passing automated checks.

### 2. Frozen API Contracts (`models.py`)
The Pydantic schemas defined in [models.py](file:///Users/ashu/Documents/VMEG/Hackathons/VYNEDAM/WaveX/backend/app/schemas/models.py) are the **source of truth** and are strictly frozen. If any developer needs to alter a schema, expand a model, or add a field, they **must notify and align with the entire team** (frontend, backend, and QA) before committing or merging the changes.

### 3. Absolute Rule of Green Main Branch
The main branch must remain deployable at all times. Never merge broken, syntax-errored, or failing code. Run local syntax checks and verify endpoints before executing a merge. If a merge breaks main, rollback/revert immediately first, and debug second.

### 4. Zero Placeholders in Production Code
While development relies on mocks initially, do not check in half-written functions, unresolved TODOs, or empty handlers to the main branch. Ensure every endpoint conforms to the specified contract and returns valid mock schema data to allow the frontend to develop concurrently.

### 5. Automated Local Verification Pre-Commit
Before pushing any branch or raising a Pull Request, run the validation test command to verify that all modules load properly, schemas instantiate correctly, and the router initializes without exceptions.
