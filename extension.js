const vscode = require('vscode')
const { sortCssText } = require('./cssSorter')


function activate(context) {
  const outputChannel = vscode.window.createOutputChannel('whodislol: SortCSS')
  outputChannel.appendLine('✅ Extension activated: whodislol CSS Sorter')

  const sortAll = vscode.commands.registerCommand('TrevorsExtension.sortCssProps.all', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const document = editor.document
    const text = document.getText()

    try {
      const sorted = await sortCssText(text, outputChannel)

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      )

      await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, sorted)
      })

      //outputChannel.show(true)

      outputChannel.appendLine('🔧 Sorted ALL blocks.')
      vscode.window.showInformationMessage('✅ All CSS/SCSS blocks sorted.')
    } catch (err) {
      outputChannel.appendLine('❌ Error during sorting: ' + err.message)
      vscode.window.showErrorMessage('❌ Failed to sort file.')
    }
  })

  const sortSelection = vscode.commands.registerCommand('TrevorsExtension.sortCssProps.selection', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const document = editor.document
    const selection = editor.selection
    const selectedText = document.getText(selection)

    try {
      const sorted = await sortCssText(selectedText)

      await editor.edit(editBuilder => {
        editBuilder.replace(selection, sorted)
      })

      outputChannel.appendLine('🔧 Sorted SELECTED block.')
      vscode.window.showInformationMessage('✅ Selected CSS/SCSS block sorted.')
    } catch (err) {
      outputChannel.appendLine('❌ Error during sorting: ' + err.message)
      vscode.window.showErrorMessage('❌ Failed to sort selection.')
    }
  })


  const sortUltra = vscode.commands.registerCommand('TrevorsExtension.sortCssProps.ultra', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const document = editor.document
    const text = document.getText()

    try {
      const { sortCssTextUltra } = require('./cssSorter')  // lazy-load to avoid breaking existing logic
      const sorted = await sortCssTextUltra(text)

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      )

      await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, sorted)
      })

      vscode.window.showInformationMessage('✅ CSS/SCSS sorted using ULTRA mode.')
    } catch (err) {
      vscode.window.showErrorMessage('❌ Failed to sort with Ultra Mode: ' + err.message)
    }
  })

  context.subscriptions.push(sortAll, sortSelection, sortUltra)
}


function deactivate() {}


module.exports = {
  activate,
  deactivate
}
