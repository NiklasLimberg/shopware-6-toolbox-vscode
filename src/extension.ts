import * as vscode from 'vscode';

import { getChangelogInBranch } from './commands/findChangelog';
import { searchForChangelog } from './commands/searchForChangelog';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "shopware6-vscode-extension" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('shopware6-vscode-extension.getChangelogInBranch', getChangelogInBranch),
        vscode.commands.registerCommand('shopware6-vscode-extension.searchForChangelog', searchForChangelog),
    );
}

// export function deactivate() {}
