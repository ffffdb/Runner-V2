const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Votre extension "bouton-runner-on-terminal" est maintenant active.');

	// Commande pour exécuter la commande dans un terminal
	const runCommand = vscode.commands.registerCommand('bouton-runner-on-terminal.runCommand', async () => {
		const config = vscode.workspace.getConfiguration('bouton-runner-on-terminal');
		let command = config.get('commandToRun', 'echo "Aucune commande configurée"');

		// Fermer tous les terminaux ouverts
		vscode.window.terminals.forEach(term => term.dispose());

		// Créer un nouveau terminal
		const terminal = vscode.window.createTerminal({ name: "Runner" });
		terminal.show(true);

		// Envoyer la commande dans le terminal
		terminal.sendText(command);
	});

	// Commande pour configurer la commande à exécuter
	const configureCommand = vscode.commands.registerCommand('bouton-runner-on-terminal.configureCommand', async () => {
		const newCommand = await vscode.window.showInputBox({
			prompt: 'Entrez la commande à exécuter dans le terminal',
			placeHolder: 'ex: npm run dev'
		});

		if (newCommand === undefined) {
			return; // Annulé
		}

		const config = vscode.workspace.getConfiguration('bouton-runner-on-terminal');
		await config.update('commandToRun', newCommand, vscode.ConfigurationTarget.Global);

		vscode.window.showInformationMessage(`Commande configurée : ${newCommand}`);
	});

	// Bouton Configurer dans la Status Bar (bas à droite)
	const configStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	configStatusBarItem.text = '$(gear) Configurer Commande';
	configStatusBarItem.command = 'bouton-runner-on-terminal.configureCommand';
	configStatusBarItem.tooltip = 'Configurer la commande à exécuter dans le terminal';
	configStatusBarItem.show();

	context.subscriptions.push(runCommand, configureCommand, configStatusBarItem);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
