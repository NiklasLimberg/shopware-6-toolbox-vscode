import { workspace, Uri, window } from 'vscode';

import { getUserSettings } from '../user-settings';

export async function createPr(changelogTemplate: string) {
    const workspaceFolder = workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        throw new Error('No workspace folder found');
    }

    const userSettings = await getUserSettings();

    const issue = await window.showInputBox({
        title: 'Issue Key',
        prompt: 'Please enter the issue key',
        placeHolder: 'NEXT-XXXXX',
    });

    const title = await window.showInputBox({
        title: 'Title',
        prompt: 'Please enter the issue title',
        validateInput: (value) => {
            if (!value.length) {
                return 'Title is required';
            }
            return '';
        },
    }) || '';

    const changelog = changelogTemplate
        .replace('${title}', title || '')
        .replace('${issue}', issue || '')
        .replace('${author}', userSettings.author)
        .replace('${authorEmail}', userSettings.authorEmail)
        .replace('${authorGithub}', userSettings.authorGithub);

    const textEncoder = new TextEncoder();

    const titleSlug = title.toLowerCase().replace(/ /g, '-');
    const dateString = new Date().toISOString().slice(0, 10);

    const changelogUri = Uri.joinPath(workspaceFolder.uri, `changelog/_unreleased/${dateString}-${titleSlug}.md`);
    
    await workspace.fs.writeFile(changelogUri, textEncoder.encode(changelog));
    const changelogFile = await workspace.openTextDocument(changelogUri);    
    await window.showTextDocument(changelogFile, { preview: false });
}
