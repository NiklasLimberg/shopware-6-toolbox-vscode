import { window, workspace, ConfigurationTarget } from 'vscode';

const settings = workspace.getConfiguration('shopware-6-toolbox');

interface UserSettings { 
    author: string,
    authorEmail: string,
    authorGithub: string
}

export async function getUserSettings() {
    const userSettings = {
        author: settings.get<string>('changelog.author') || '',
        authorEmail: settings.get<string>('changelog.authorEmail') || '',
        authorGithub: settings.get<string>('changelog.authorGithub') || '',
    };

    let userEditedSettings = false;
    if (!userSettings.author) {
        const input = await window.showInputBox({
            title: 'Author',
            prompt: 'Please enter an author to be used in changelogs',
        });

        if (input) {
            userSettings.author = input;
            userEditedSettings = true;
        }

    }

    if (!userSettings.authorEmail) {
        const input = await window.showInputBox({
            title: 'Author Email',
            prompt: 'Please enter an author email to be used in changelogs',
        });

        if (input) {
            userSettings.authorEmail = input;
            userEditedSettings = true;
        }
    }

    if(!userSettings.authorGithub) {
        const input = await window.showInputBox({
            title: 'Author Github',
            prompt: 'Please enter an author github to be used in changelogs',
        });
        
        if(input) {
            userSettings.authorGithub = input;
            userEditedSettings = true;
        }
    }

    if (userEditedSettings) {
        await saveUserSettings(userSettings);
    }
    
    return userSettings;
}

async function saveUserSettings(userSettings: UserSettings) {
    const shouldSave = await window.showInformationMessage('Do you want to save these settings?', {
        detail: 'These settings will be used for future changelog entries',
        modal: true,
    }, {
        title: 'Save',
    }, {
        title: 'Discard', 
        isCloseAffordance: true,
    });

    if (shouldSave?.title !== 'Save') {
        return;
    }

    await settings.update('changelog.author', userSettings.author, ConfigurationTarget.Global);
    await settings.update('changelog.authorEmail', userSettings.authorEmail, ConfigurationTarget.Global);
    await settings.update('changelog.authorGithub', userSettings.authorGithub, ConfigurationTarget.Global);
}