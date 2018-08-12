'use babel';

import { CompositeDisposable } from 'atom'
import wiki from 'wikijs'

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-wiki:fetch': () => this.fetch()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  fetch() {
    let editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      let query = editor.getSelectedText()
      wiki().page(query)
        .then(page => {
          page.content().then(content => {
              atom.workspace.open().then((editor) => {
                atom.notifications.addSuccess('Found article')
                editor.setSoftWrapped(true)
                editor.insertText(content)
                editor.scrollToBufferPosition(0)
                editor.setCursorBufferPosition(0)
            })
          })
        })
        .catch(error => { atom.notifications.addWarning("Failed to find article for " + query) });
    }
  },
};