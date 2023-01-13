import type { ExtensionContext } from 'vscode';

import { commands }  from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';


import { getChangelogInBranch } from './feature/changelog/commands/getInBranch';
import { searchForChangelog } from './feature/changelog/commands/search';
import { createPr } from './feature/create-pr/commands/create';

export function activate(context: ExtensionContext) {
    console.log('Extension "shopware-6-toolbox" is now active!');

    context.subscriptions.push(
        commands.registerCommand('shopware-6-toolbox.getChangelogInBranch', getChangelogInBranch),
        commands.registerCommand('shopware-6-toolbox.searchForChangelog', searchForChangelog),
        commands.registerCommand('shopware-6-toolbox.createPr', async () => {
            const fullFilePath = context.asAbsolutePath(path.join('templates', 'changelogTemplate.txt'));
            const template = await fs.readFile(fullFilePath, 'utf-8');
            
            return createPr(template);
        }), 
    );
}

// export function deactivate() {}
