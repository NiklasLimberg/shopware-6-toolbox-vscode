import * as vscode from 'vscode';

import { getChangelogInBranch } from './feature/changelog/commands/getInBranch';
import { searchForChangelog } from './feature/changelog/commands/search';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "shopware-6-toolbox" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('shopware-6-toolbox.getChangelogInBranch', getChangelogInBranch),
        vscode.commands.registerCommand('shopware-6-toolbox.searchForChangelog', searchForChangelog),
    );
}

// export function deactivate() {}
