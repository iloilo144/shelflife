import { useEffect, useState } from 'react'
import { usePantry } from './hooks/usePantry'
import { useHashTab } from './hooks/useHashTab'
import Masthead from './components/Masthead'
import ItemDialog from './components/ItemDialog'
import UndoToast from './components/UndoToast'
import Pantry from './views/Pantry'
import Cook from './views/Cook'
import Insights from './views/Insights'
import './App.css'

const TABS = ['pantry', 'cook', 'insights']
const TITLES = { pantry: 'Pantry', cook: 'What to cook', insights: 'Waste log' }

export default function App() {
  const pantry = usePantry()
  const [tab, setTab] = useHashTab(TABS, 'pantry')
  const [editing, setEditing] = useState(null) // null = closed, {} = new item, item = edit

  useEffect(() => {
    document.title = `${TITLES[tab]} — ShelfLife`
  }, [tab])

  const save = (item) => {
    if (item.id) pantry.update(item)
    else pantry.add(item)
    setEditing(null)
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Masthead items={pantry.items} tab={tab} onTab={setTab} />

      <main id="main" className="wrap">
        {tab === 'pantry' && (
          <Pantry
            items={pantry.items}
            onAdd={() => setEditing({})}
            onEdit={setEditing}
            onFinish={pantry.finish}
            onDelete={pantry.remove}
            onCook={() => setTab('cook')}
          />
        )}
        {tab === 'cook' && <Cook items={pantry.items} onFinish={pantry.finish} />}
        {tab === 'insights' && <Insights log={pantry.log} items={pantry.items} onReset={pantry.reset} />}
      </main>

      <footer className="foot wrap">
        <p>
          <strong>ShelfLife</strong> keeps everything in this browser. Nothing is uploaded.
        </p>
        <p>A portfolio concept. Food photography from Unsplash.</p>
      </footer>

      <ItemDialog item={editing} onClose={() => setEditing(null)} onSave={save} />
      <UndoToast undo={pantry.undo} onUndo={pantry.undoLast} />
    </>
  )
}
