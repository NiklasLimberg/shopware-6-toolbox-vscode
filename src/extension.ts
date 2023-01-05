import * as vscode from 'vscode';

import { getChangelogInBranch } from './commands/findChangelog';
import { searchForChangelog } from './commands/searchForChangelog';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "shopware-6-toolbox" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('shopware-6-toolbox.getChangelogInBranch', getChangelogInBranch),
        vscode.commands.registerCommand('shopware-6-toolbox.searchForChangelog', searchForChangelog),
    );
}

// export function deactivate() {}
