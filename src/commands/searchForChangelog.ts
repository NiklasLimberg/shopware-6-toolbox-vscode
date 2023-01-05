import * as vscode from 'vscode';

export async function searchForChangelog() {
    const files = await vscode.workspace.findFiles('changelog/**/*.md');

    const ticketsInFiles = files.map(async filePath => {
        const fileContent = await vscode.workspace.fs.readFile(filePath);
        const fileContentString = fileContent.toString();

        const ticketIdentifier = [...fileContentString.matchAll(/NEXT-\d+/g)].map(match => match[0]);

        return {
            tickets: ticketIdentifier,
            filePath: filePath.path,
        };
    });

    const quickPickItems = [] as vscode.QuickPickItem[];

    (await Promise.allSettled(ticketsInFiles)).forEach((result) => {
        if (result.status !== 'fulfilled') {
            return;
        }

        result.value.tickets.forEach(ticket => {
            quickPickItems.push({
                label: ticket,
                detail: result.value.filePath,
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
    
    const selectedFile = files.find(file =>  file.path === selectedItem.detail);

    if (!selectedFile) {
        vscode.window.showErrorMessage('Could not find file');
        return;
    }
    
    const textDocument = await vscode.workspace.openTextDocument(selectedFile);
    vscode.window.showTextDocument(textDocument);
    
}