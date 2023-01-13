import type { GitExtension, Branch } from '../types/git';
import { workspace, extensions } from 'vscode';

export function getCurrentBranch(): Promise<Branch> {
    const workspaceFolder = workspace.workspaceFolders?.[0]?.uri;

    if (!workspaceFolder) {
        throw new Error('Could not get workspace folder');
    }

    const gitExtensionAPI = extensions.getExtension<GitExtension>('vscode.git')?.exports.getAPI(1);
        
    if (!gitExtensionAPI) {
        throw new Error('Could not access git extension');
    }

    const repository = gitExtensionAPI.getRepository(workspaceFolder);

    if (!repository) {
        throw new Error('Could not get repository');
    }

    return repository.getBranch('HEAD');
}