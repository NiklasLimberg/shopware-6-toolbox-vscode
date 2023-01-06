import * as vscode from 'vscode';

import { parseChangelogs } from '../parser';

export async function searchForChangelog() {
    const changelogs = await parseChangelogs();
    
    const quickPickItems = [] as vscode.QuickPickItem[];
    changelogs.forEach((result) => {
        result.tickets.forEach(ticket => {
            quickPickItems.push({
                label: ticket,
                detail: result.filePath.path,
            });
        });
    });

    if (quickPickItems.length === 0) {
        vscode.window.showErrorMessage('Could not find any changelog files');
        return;
    }
    
    const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
        title: 'Search for changelog based on ticket key',
        placeHolder: 'NEXT-XXXX',        
    });

    if (!selectedItem) {
        return;
    }
    
    const selectedFile = changelogs.find(file =>  file.filePath.path === selectedItem.detail);

    if (!selectedFile) {
        vscode.window.showErrorMessage('Could not find file');
        return;
    }
    
    const textDocument = await vscode.workspace.openTextDocument(selectedFile.filePath);
    vscode.window.showTextDocument(textDocument);
}
