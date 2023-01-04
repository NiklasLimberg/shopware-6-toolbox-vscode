import * as vscode from 'vscode';
import type { GitExtension } from './git';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "shopware6-vscode-extension" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand('shopware6-vscode-extension.searchChangelog', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri;

        if (!workspaceFolder) {
            vscode.window.showErrorMessage('Could not get workspace folder');
            return;
        }

        const gitExtensionAPI = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports.getAPI(1);
        
        if (!gitExtensionAPI) {
            vscode.window.showErrorMessage('Could not access git extension');
            return;
        }

        const currentBranchName = (await gitExtensionAPI.getRepository(workspaceFolder)?.getBranch('HEAD'))?.name;

        if (typeof currentBranchName !== 'string') {
            vscode.window.showErrorMessage('Could not get current branch');
            return;
        }

        if (currentBranchName === 'trunk') {
            vscode.window.showErrorMessage('You are currently on trunk branch. Please checkout a feature branch.');
            return;
        }

        const ticketIdentifier = currentBranchName.match(/next-\d+/)?.[0];

        if (!ticketIdentifier) {
            vscode.window.showErrorMessage('Could not get ticket identifier from current branch');
            return;
        }
        
        const files = await vscode.workspace.findFiles('changelog/**/*.md');

        const changelogFiles = files.map(async filePath => {
            const fileContent = await vscode.workspace.fs.readFile(filePath);
            const fileContentString = fileContent.toString();

            const isChangelogFile = fileContentString.includes(ticketIdentifier.toUpperCase()) 
            || fileContentString.includes(ticketIdentifier);

            if (!isChangelogFile) {
                return false;
            }

            const textDocument = await vscode.workspace.openTextDocument(filePath);
            vscode.window.showTextDocument(textDocument);

            return true;
        });

        const couldOpenFile  = (await Promise.allSettled(changelogFiles))
            .filter(result => result.status === 'fulfilled' && result.value)
            .length > 0;

        if (!couldOpenFile) {
            vscode.window.showErrorMessage('Could not find changelog file');
        }
    }));
}

// export function deactivate() {}
