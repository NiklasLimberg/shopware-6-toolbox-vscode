import * as vscode from 'vscode';

import { getCurrentBranch } from '../../../adapter/git';
import { parseChangelogs } from '../parser';

export async function getChangelogInBranch(): Promise<void> {
    const currentBranchName = (await getCurrentBranch())?.name;

    if (typeof currentBranchName !== 'string') {
        throw new Error('Could not get current branch');
    }

    if (currentBranchName === 'trunk') {
        throw new Error('You are currently on trunk branch. Please checkout a feature branch.');
    }

    const ticketIdentifier = currentBranchName.match(/next-\d+/)?.[0].toUpperCase();

    if (!ticketIdentifier) {
        throw new Error('Could not get ticket identifier from current branch');
    }

    const changelogs = await parseChangelogs();

    const changelogWithTicket = changelogs.filter(changelog => changelog.tickets.includes(ticketIdentifier));

    if (changelogWithTicket.length === 0) {
        vscode.window.showInformationMessage('Could not find changelog with ticket');
        return;
    }

    changelogWithTicket.forEach(async (changelog) => {
        const textDocument = await vscode.workspace.openTextDocument(changelog.filePath);
        vscode.window.showTextDocument(textDocument);
    });
}
    