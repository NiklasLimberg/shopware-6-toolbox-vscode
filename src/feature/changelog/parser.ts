import { workspace, Uri, window, ProgressLocation } from 'vscode';

interface ChangelogInfo {
    tickets: string[];
    filePath: Uri;
}

export async function parseChangelogs(): Promise<ChangelogInfo[]> {
    const files = await workspace.findFiles('changelog/**/*.md');

    const changelogInfo = await window.withProgress({
        location: ProgressLocation.Notification,
        title: 'Reading changelogs',
        cancellable: true,
    }, async (progressReporter) => {
        const totalFiles = files.length + 1;
        let progress = 1;

        return await Promise.allSettled(files.map(async (filePath) => {
            const fileContent = await workspace.fs.readFile(filePath);
            const fileContentString = fileContent.toString();
            
            const ticketIdentifiers = [...fileContentString.matchAll(/NEXT-\d+/g)].map(match => match[0].toUpperCase());
            
            progressReporter.report({message: `${progress++} / ${totalFiles}`});
            return {
                tickets: ticketIdentifiers,
                filePath: filePath,
            };
        }));
    });

    return changelogInfo.reduce((acc, changelog) => {
        if (changelog.status === 'fulfilled') {
            acc.push(changelog.value);
        }
        return acc;
    }, [] as ChangelogInfo[]);
}