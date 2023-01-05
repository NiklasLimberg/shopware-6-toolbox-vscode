import type { GitExtension, Branch } from '../types/git';
import * as vscode from 'vscode';

export function getCurrentBranch(): Promise<Branch> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri;

    if (!workspaceFolder) {
        throw new Error('Could not get workspace folder');
    }

    const gitExtensionAPI = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports.getAPI(1);
        
    if (!gitExtensionAPI) {
        throw new Error('Could not access git extension');
    }

    const repository = gitExtensionAPI.getRepository(workspaceFolder);

    if (!repository) {
        throw new Error('Could not get repository');
    }

    return repository.getBranch('HEAD');
}