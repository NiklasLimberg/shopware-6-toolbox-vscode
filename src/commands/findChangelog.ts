import * as vscode from 'vscode';

import { getCurrentBranch } from '../adapter/git';

export async function getChangelogInBranch() {
    const currentBranchName = (await getCurrentBranch())?.name;

    if (typeof currentBranchName !== 'string') {
        throw new Error('Could not get current branch');
    }

    if (currentBranchName === 'trunk') {
        throw new Error('You are currently on trunk branch. Please checkout a feature branch.');
    }

    const ticketIdentifier = currentBranchName.match(/next-\d+/)?.[0];

    if (!ticketIdentifier) {
        throw new Error('Could not get ticket identifier from current branch');
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
}
    