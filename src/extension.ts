import * as vscode from 'vscode';
import * as fs from 'fs';

interface Sets { 
	name?: string;
	icon?: string;
	tooltip?: string;
	enabled?: boolean;
};


let statusBarItem: vscode.StatusBarItem;
let itemSettings = vscode.workspace.getConfiguration('statusBarCustomItem');

export function activate(context: vscode.ExtensionContext) {

	vscode.workspace.onDidChangeConfiguration(() => {
		updateStatusBar(context, );
	});

	let dispose = vscode.commands.registerCommand('extension.createProject', () => {
		vscode.window.showInputBox({
			placeHolder: 'Digite o nome do projeto'
		}).then((projectName) => {
			if (projectName) {
				vscode.window.showQuickPick(['React + ViteJS', 'HTML + CSS + JS','Soon'/*'Node'*/, 'React Native'], {
					placeHolder: 'Selecione o tipo de projeto'
				}).then((result) => {
					if (result) {
						let command = '';
						switch (result) {
							case 'React + ViteJS':
								vscode.window.showQuickPick(['TypeScript (TSX)', 'JavaScript (JSX)'], {
									placeHolder: 'Selecione o template'
								}).then((template) => {
									if (template) {
										switch (template) {
											case 'TypeScript (TSX)':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npm create vite@latest ${projectName} --template typescript
														   cd ${projectName}
														   npm run dev`;
												break;
											case 'JavaScript (JSX)':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npm create vite@latest ${projectName} --template javascript
														   cd ${projectName}
														   npm run dev`;
												break;
										}
									}
									else {
										vscode.window.showErrorMessage('Nenhum diretório selecionado');
									}
								});
								break;
							case 'HTML + CSS + JS':
								vscode.window.showInformationMessage('Aguarde, preparando o projeto...');
								createFolder(projectName);
								break;

							case 'Soon':
								vscode.window.showInformationMessage('Soon..');
								break;
							case 'React Native':
								vscode.window.showQuickPick(['Blank', 'Blank (TypeScript)', 'Navigation (TypeScript)', 'Blank (Bare)', 'Expo'], {
									placeHolder: 'Selecione o template'
								}).then((template) => {
									if (template) {
										switch (template) {
											case 'Blank':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npx create-react-app ${projectName} --template
														   cd ${projectName}`;
												break;
											case 'Blank (TypeScript)':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npx create-react-app ${projectName} --template typescript
														   cd ${projectName}`;
												break;
											case 'Blank (Bare)':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npx create-react-app ${projectName} --template bare
														   cd ${projectName}`;
												break;
											case 'Navigation (TypeScript)':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npx create-react-app ${projectName} --template typescript-navigation
														   cd ${projectName}`;
												break;
											case 'Expo':
												vscode.window.showInformationMessage('Aguarde, preparando o workspace...');
												command = `npx create-expo-app ${projectName}
														   cd ${projectName}`;
										}
									}
									else {
										vscode.window.showErrorMessage('Nenhum diretório selecionado');
									}

									const rootPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
									
									if (rootPath!=='') {
										const terminal = vscode.window.createTerminal({
											cwd: rootPath,
											name: 'New Project'
									});
									
										terminal.show();
										terminal.sendText(command);
									}
								});
							break;
						}
					}
				});
			}
		});	
	});

	let setName = vscode.commands.registerCommand('extension.setStatusBarItemName', () => {
		vscode.window.showInputBox({
			placeHolder: 'Type your name or nickname'
		}).then((name) => {
			if (name) {
				itemSettings.update('text', name);
			}
		});	
	});

	let setIcon = vscode.commands.registerCommand('extension.setStatusBarItemIcon', () => {
		vscode.window.showInputBox({
			placeHolder: 'Type the icon value (can be a emoji)'
		}).then((icon) => {
			if (icon) {
				itemSettings.update('icon', icon);
			}
		});
	});

	let setTooltip = vscode.commands.registerCommand('extension.setStatusBarItemTooltip', () => {
		vscode.window.showInputBox({
			placeHolder: 'Type the tooltip value'
		}).then((tooltip) => {
			if (tooltip) {
				itemSettings.update('tooltip', tooltip, );
			}
		});	
	});

	let statusBar = vscode.commands.registerCommand('extension.setStatusBarItemEnabled', () => {
		vscode.window.showQuickPick(['Disable', 'Enable'], { 
			placeHolder: '' 
		}).then((result) => {
			if (result === 'Enable') {
				itemSettings.update('enabled', true);
			} else {
				itemSettings.update('enabled', false);
			}	
		});
	});

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -20000);
	context.subscriptions.push( dispose, statusBarItem, setName, setIcon, setTooltip, statusBar);
	updateStatusBar(context);
}

function updateStatusBar(context: vscode.ExtensionContext): void {
	let name =  itemSettings.get("text") as string;
  	let icon = itemSettings.get("icon") as string;
  	let tooltip = itemSettings.get("tooltip") as string;
	let enabled = itemSettings.get("enabled") as boolean;
  
	statusBarItem.text = `${icon} ${name}`;
	statusBarItem.tooltip = tooltip;  
	enabled? statusBarItem.show : statusBarItem.hide;
}

async function createFolder(projectName: string = ''): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (projectName) {
			fs.mkdir(projectName, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		}
	});
}

async function createFile(projectName: string = ''): Promise<boolean> {
	return new Promise((resolve, reject) => {
		if (projectName) {
			fs.writeFile(projectName, '', (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		}
	});
}